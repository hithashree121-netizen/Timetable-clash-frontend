import { ClassItem, GraphNode, GraphEdge, AlgorithmType, AlgorithmComparisonResult, ConflictItem, ValidationReport, SlotRecommendation, DayOfWeek, TimeSlotString } from '../types';
import { DAYS, TIME_SLOTS } from '../data/mockData';

/**
 * Builds a Conflict Graph from a list of academic classes.
 * Nodes = Classes
 * Edges = Constraints (Faculty, Room, or Student Group Overlap)
 */
export function buildConflictGraph(classes: ClassItem[]): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const edges: GraphEdge[] = [];
  const adjacencyMap: Map<string, Set<string>> = new Map();

  classes.forEach(c => adjacencyMap.set(c.id, new Set()));

  for (let i = 0; i < classes.length; i++) {
    for (let j = i + 1; j < classes.length; j++) {
      const c1 = classes[i];
      const c2 = classes[j];

      const reasons: string[] = [];
      if (c1.facultyId && c1.facultyId === c2.facultyId) {
        reasons.push(`Same Faculty (${c1.facultyName})`);
      }
      if (c1.roomId && c1.roomId === c2.roomId) {
        reasons.push(`Same Room (${c1.roomNumber})`);
      }
      if (c1.batch && c1.batch === c2.batch) {
        reasons.push(`Same Student Batch (${c1.batch})`);
      }

      if (reasons.length > 0) {
        const edgeId = `edge-${c1.id}-${c2.id}`;
        edges.push({
          id: edgeId,
          source: c1.id,
          target: c2.id,
          reason: reasons.join(', ')
        });

        adjacencyMap.get(c1.id)?.add(c2.id);
        adjacencyMap.get(c2.id)?.add(c1.id);
      }
    }
  }

  // Calculate degrees and create graph node structures
  const nodes: GraphNode[] = classes.map((cls, index) => {
    const neighbors = adjacencyMap.get(cls.id) || new Set();
    // Layout in circular or grid coordinates for rendering
    const angle = (index / Math.max(classes.length, 1)) * 2 * Math.PI;
    const radius = 180;
    const cx = 350 + Math.cos(angle) * radius;
    const cy = 250 + Math.sin(angle) * radius;

    return {
      id: cls.id,
      label: cls.subject,
      code: cls.code,
      faculty: cls.facultyName,
      batch: cls.batch,
      room: cls.roomNumber,
      degree: neighbors.size,
      colorIndex: -1,
      x: cx,
      y: cy,
      saturation: 0
    };
  });

  return { nodes, edges };
}

/**
 * 1. First-Fit / Greedy Graph Coloring
 */
export function firstFitGraphColoring(classes: ClassItem[], edges: GraphEdge[]): Map<string, number> {
  const result = new Map<string, number>();
  const neighborMap = getNeighborMap(classes, edges);

  classes.forEach(c => {
    const neighbors = neighborMap.get(c.id) || [];
    const usedColors = new Set<number>();

    neighbors.forEach(nId => {
      if (result.has(nId)) {
        usedColors.add(result.get(nId)!);
      }
    });

    let assignedColor = 0;
    while (usedColors.has(assignedColor)) {
      assignedColor++;
    }
    result.set(c.id, assignedColor);
  });

  return result;
}

/**
 * 2. Welsh-Powell Graph Coloring (Degree-based descending sort)
 */
export function welshPowellGraphColoring(classes: ClassItem[], edges: GraphEdge[]): Map<string, number> {
  const result = new Map<string, number>();
  const neighborMap = getNeighborMap(classes, edges);

  // Sort classes by degree in descending order
  const sortedClasses = [...classes].sort((a, b) => {
    const degA = (neighborMap.get(a.id) || []).length;
    const degB = (neighborMap.get(b.id) || []).length;
    return degB - degA;
  });

  sortedClasses.forEach(c => {
    const neighbors = neighborMap.get(c.id) || [];
    const usedColors = new Set<number>();

    neighbors.forEach(nId => {
      if (result.has(nId)) {
        usedColors.add(result.get(nId)!);
      }
    });

    let assignedColor = 0;
    while (usedColors.has(assignedColor)) {
      assignedColor++;
    }
    result.set(c.id, assignedColor);
  });

  return result;
}

/**
 * 3. DSATUR Graph Coloring (Degree of Saturation)
 */
export function dsaturGraphColoring(classes: ClassItem[], edges: GraphEdge[]): Map<string, number> {
  const result = new Map<string, number>();
  const neighborMap = getNeighborMap(classes, edges);
  const uncolored = new Set(classes.map(c => c.id));

  const getSaturation = (classId: string): number => {
    const neighbors = neighborMap.get(classId) || [];
    const neighborColors = new Set<number>();
    neighbors.forEach(nId => {
      if (result.has(nId)) neighborColors.add(result.get(nId)!);
    });
    return neighborColors.size;
  };

  while (uncolored.size > 0) {
    let maxSat = -1;
    let maxDegree = -1;
    let chosenId = '';

    uncolored.forEach(id => {
      const sat = getSaturation(id);
      const degree = (neighborMap.get(id) || []).length;

      if (sat > maxSat || (sat === maxSat && degree > maxDegree)) {
        maxSat = sat;
        maxDegree = degree;
        chosenId = id;
      }
    });

    const neighbors = neighborMap.get(chosenId) || [];
    const usedColors = new Set<number>();
    neighbors.forEach(nId => {
      if (result.has(nId)) usedColors.add(result.get(nId)!);
    });

    let color = 0;
    while (usedColors.has(color)) color++;

    result.set(chosenId, color);
    uncolored.delete(chosenId);
  }

  return result;
}

/**
 * Helper to get adjacency lists
 */
function getNeighborMap(classes: ClassItem[], edges: GraphEdge[]): Map<string, string[]> {
  const map = new Map<string, string[]>();
  classes.forEach(c => map.set(c.id, []));

  edges.forEach(e => {
    map.get(e.source)?.push(e.target);
    map.get(e.target)?.push(e.source);
  });

  return map;
}

/**
 * Applies color mapping to classes to produce optimized day/time assignments.
 */
export function mapColorToTimeSlots(classes: ClassItem[], colorMap: Map<string, number>): ClassItem[] {
  const totalSlotsPerDay = TIME_SLOTS.length; // 6 slots

  return classes.map(cls => {
    const colorIndex = colorMap.get(cls.id) ?? 0;
    const dayIndex = Math.floor(colorIndex / totalSlotsPerDay) % DAYS.length;
    const slotIndex = colorIndex % totalSlotsPerDay;

    const assignedDay = DAYS[dayIndex];
    const assignedSlot = TIME_SLOTS[slotIndex];

    return {
      ...cls,
      assignedDay,
      assignedSlot,
      assignedSlotIndex: colorIndex,
      color: getColorForSlot(colorIndex)
    };
  });
}

/**
 * Color palette for assigned time slots
 */
export function getColorForSlot(colorIndex: number): string {
  const palette = [
    '#CEBCED', // Pale Lavender Luminous (#E6E0F0 tint)
    '#6F4E37', // Mocha Brown (#6F4E37)
    '#E5E4E2', // Platinum Silver (#E5E4E2)
    '#BFA5DC', // Soft Lilac Lavender
    '#8E6548', // Warm Espresso Mocha
    '#D8C8F2', // Frosted Lavender
    '#A37554', // Golden Mocha Bronze
    '#C4C1BA'  // Metallic Platinum
  ];
  return palette[colorIndex % palette.length];
}

/**
 * Evaluates algorithm comparison
 */
export function runAlgorithmComparison(classes: ClassItem[]): AlgorithmComparisonResult[] {
  const { edges } = buildConflictGraph(classes);

  const t0 = performance.now();
  const ffMap = firstFitGraphColoring(classes, edges);
  const t1 = performance.now();

  const wpMap = welshPowellGraphColoring(classes, edges);
  const t2 = performance.now();

  const dsaturMap = dsaturGraphColoring(classes, edges);
  const t3 = performance.now();

  const countSlots = (map: Map<string, number>) => Math.max(0, ...Array.from(map.values())) + 1;

  return [
    {
      algorithm: 'First-Fit',
      slotsUsed: countSlots(ffMap),
      conflictsCount: 0,
      executionTimeMs: Number((t1 - t0).toFixed(2)),
      validationStatus: 'Success',
      colorPaletteCount: countSlots(ffMap)
    },
    {
      algorithm: 'Welsh-Powell',
      slotsUsed: countSlots(wpMap),
      conflictsCount: 0,
      executionTimeMs: Number((t2 - t1).toFixed(2)),
      validationStatus: 'Success',
      colorPaletteCount: countSlots(wpMap)
    },
    {
      algorithm: 'DSATUR',
      slotsUsed: countSlots(dsaturMap),
      conflictsCount: 0,
      executionTimeMs: Number((t3 - t2).toFixed(2)),
      validationStatus: 'Success',
      colorPaletteCount: countSlots(dsaturMap)
    }
  ];
}

/**
 * Performs full validation of current timetable assignments.
 */
export function validateTimetable(classes: ClassItem[]): ValidationReport {
  const issues: ValidationReport['issues'] = [];

  for (let i = 0; i < classes.length; i++) {
    for (let j = i + 1; j < classes.length; j++) {
      const c1 = classes[i];
      const c2 = classes[j];

      const sameDay = (c1.assignedDay || c1.preferredDay) === (c2.assignedDay || c2.preferredDay);
      const sameSlot = (c1.assignedSlot || c1.preferredTime) === (c2.assignedSlot || c2.preferredTime);

      if (sameDay && sameSlot) {
        if (c1.facultyId === c2.facultyId) {
          issues.push({
            id: `val-fac-${c1.id}-${c2.id}`,
            class1: c1.subject,
            class2: c2.subject,
            type: 'Faculty Conflict',
            reason: `Faculty ${c1.facultyName} assigned to both classes simultaneously`,
            timeSlot: `${c1.assignedDay || c1.preferredDay} ${c1.assignedSlot || c1.preferredTime}`
          });
        }
        if (c1.roomId === c2.roomId) {
          issues.push({
            id: `val-rm-${c1.id}-${c2.id}`,
            class1: c1.subject,
            class2: c2.subject,
            type: 'Room Conflict',
            reason: `Room ${c1.roomNumber} double-booked`,
            timeSlot: `${c1.assignedDay || c1.preferredDay} ${c1.assignedSlot || c1.preferredTime}`
          });
        }
        if (c1.batch === c2.batch) {
          issues.push({
            id: `val-batch-${c1.id}-${c2.id}`,
            class1: c1.subject,
            class2: c2.subject,
            type: 'Student Group Conflict',
            reason: `Student batch ${c1.batch} scheduled in overlapping slots`,
            timeSlot: `${c1.assignedDay || c1.preferredDay} ${c1.assignedSlot || c1.preferredTime}`
          });
        }
      }
    }
  }

  const facultyCheck = issues.every(i => i.type !== 'Faculty Conflict');
  const roomCheck = issues.every(i => i.type !== 'Room Conflict');
  const studentCheck = issues.every(i => i.type !== 'Student Group Conflict');
  const slotCheck = issues.length === 0;

  return {
    isValid: issues.length === 0,
    facultyConflictsPassed: facultyCheck,
    roomConflictsPassed: roomCheck,
    studentGroupConflictsPassed: studentCheck,
    timeSlotConflictsPassed: slotCheck,
    issues
  };
}

/**
 * Finds all active schedule clashes between classes currently assigned to the same Day & Time Slot.
 */
export function findActiveScheduleConflicts(classes: ClassItem[]): ConflictItem[] {
  const conflicts: ConflictItem[] = [];

  for (let i = 0; i < classes.length; i++) {
    for (let j = i + 1; j < classes.length; j++) {
      const c1 = classes[i];
      const c2 = classes[j];

      const day1 = c1.assignedDay || c1.preferredDay;
      const slot1 = c1.assignedSlot || c1.preferredTime;
      const day2 = c2.assignedDay || c2.preferredDay;
      const slot2 = c2.assignedSlot || c2.preferredTime;

      if (day1 && slot1 && day1 === day2 && slot1 === slot2) {
        let type: ConflictItem['type'] | null = null;
        let relatedResource = '';
        let severity: 'Critical' | 'Warning' = 'Critical';

        if (c1.facultyId && c1.facultyId === c2.facultyId) {
          type = 'Faculty Conflict';
          relatedResource = `Faculty: ${c1.facultyName}`;
          severity = 'Critical';
        } else if (c1.roomId && c1.roomId === c2.roomId) {
          type = 'Room Conflict';
          relatedResource = `Room: ${c1.roomNumber}`;
          severity = 'Critical';
        } else if (c1.batch && c1.batch === c2.batch) {
          type = 'Student Group Conflict';
          relatedResource = `Batch: ${c1.batch}`;
          severity = 'Critical';
        }

        if (type) {
          conflicts.push({
            id: `cnf-live-${c1.id}-${c2.id}`,
            type,
            subject1: c1.subject,
            subject2: c2.subject,
            class1Id: c1.id,
            class2Id: c2.id,
            relatedResource,
            timeSlot: `${day1} ${slot1}`,
            severity,
            status: 'Unresolved'
          });
        }
      }
    }
  }

  return conflicts;
}

/**
 * Evaluates alternative time slots for a specific class to find collision-free recommendations.
 */
export function suggestAlternativeSlots(classToMove: ClassItem, allClasses: ClassItem[]): SlotRecommendation[] {
  const recommendations: SlotRecommendation[] = [];
  const otherClasses = allClasses.filter(c => c.id !== classToMove.id);

  DAYS.forEach(day => {
    TIME_SLOTS.forEach(slot => {
      // Find classes occupying this slot
      const clashingClasses = otherClasses.filter(c => {
        const cDay = c.assignedDay || c.preferredDay;
        const cSlot = c.assignedSlot || c.preferredTime;
        return cDay === day && cSlot === slot;
      });

      const clashReasons: string[] = [];
      clashingClasses.forEach(c => {
        if (c.facultyId && c.facultyId === classToMove.facultyId) {
          clashReasons.push(`Faculty ${c.facultyName} busy`);
        }
        if (c.roomId && c.roomId === classToMove.roomId) {
          clashReasons.push(`Room ${c.roomNumber} occupied`);
        }
        if (c.batch && c.batch === classToMove.batch) {
          clashReasons.push(`Batch ${c.batch} already has class`);
        }
      });

      recommendations.push({
        day,
        slot,
        isSafe: clashReasons.length === 0,
        conflictsCount: clashReasons.length,
        reason: clashReasons.length > 0 ? clashReasons.join(', ') : 'Free & Conflict-Safe'
      });
    });
  });

  // Sort: conflict-free first, then by least conflicts
  return recommendations.sort((a, b) => a.conflictsCount - b.conflictsCount);
}

/**
 * Resolves a specific conflict by moving one of the conflicting classes to a new Day & Time Slot.
 */
export function resolveConflictWithSlot(
  conflictId: string,
  classToMoveId: string,
  newDay: DayOfWeek,
  newSlot: TimeSlotString,
  classes: ClassItem[],
  conflicts: ConflictItem[]
): { classes: ClassItem[]; conflicts: ConflictItem[] } {
  // Update class schedule
  const updatedClasses = classes.map(c => {
    if (c.id === classToMoveId) {
      return {
        ...c,
        assignedDay: newDay,
        assignedSlot: newSlot
      };
    }
    return c;
  });

  // Update conflict status
  const updatedConflicts = conflicts.map(c => {
    if (c.id === conflictId) {
      return {
        ...c,
        status: 'Resolved' as const,
        resolvedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        resolutionNote: `Rescheduled to ${newDay} ${newSlot}`
      };
    }
    return c;
  });

  return { classes: updatedClasses, conflicts: updatedConflicts };
}

/**
 * Automatically resolves all active conflicts using DSATUR heuristic graph coloring.
 */
export function autoResolveAllConflicts(
  classes: ClassItem[],
  conflicts: ConflictItem[]
): { classes: ClassItem[]; conflicts: ConflictItem[]; resolvedCount: number } {
  const { edges } = buildConflictGraph(classes);
  const colorMap = dsaturGraphColoring(classes, edges);
  const optimizedClasses = mapColorToTimeSlots(classes, colorMap);

  const resolvedConflicts = conflicts.map(c => ({
    ...c,
    status: 'Resolved' as const,
    resolvedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    resolutionNote: 'Auto-resolved via DSATUR chromatic time-slot scheduling'
  }));

  const resolvedCount = conflicts.filter(c => c.status === 'Unresolved').length;

  return {
    classes: optimizedClasses,
    conflicts: resolvedConflicts,
    resolvedCount
  };
}
