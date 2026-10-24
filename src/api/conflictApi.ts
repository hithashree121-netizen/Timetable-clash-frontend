import { ConflictItem, ClassItem, SlotRecommendation, DayOfWeek, TimeSlotString } from '../types';
import { INITIAL_CONFLICTS } from '../data/mockData';
import { apiRequest, ApiResponse } from './config';
import {
  findActiveScheduleConflicts,
  suggestAlternativeSlots,
  resolveConflictWithSlot,
  autoResolveAllConflicts
} from '../utils/graphColoringEngine';

export const conflictApi = {
  async getConflicts(): Promise<ApiResponse<ConflictItem[]>> {
    try {
      return await apiRequest<ConflictItem[]>('/conflicts');
    } catch {
      return { success: true, data: [...INITIAL_CONFLICTS], isDemoData: true };
    }
  },

  async detectConflicts(classes: ClassItem[]): Promise<ApiResponse<ConflictItem[]>> {
    try {
      return await apiRequest<ConflictItem[]>('/conflicts/detect', {
        method: 'POST',
        body: JSON.stringify({ classes })
      });
    } catch {
      const active = findActiveScheduleConflicts(classes);
      // If active conflicts are found, return them; otherwise if any initial conflicts exist, combine
      const results = active.length > 0 ? active : [...INITIAL_CONFLICTS];
      return {
        success: true,
        data: results,
        isDemoData: true
      };
    }
  },

  getSlotRecommendations(classItem: ClassItem, allClasses: ClassItem[]): SlotRecommendation[] {
    return suggestAlternativeSlots(classItem, allClasses);
  },

  async resolveConflict(
    conflictId: string,
    classToMoveId: string,
    newDay: DayOfWeek,
    newSlot: TimeSlotString,
    classes: ClassItem[],
    conflicts: ConflictItem[]
  ): Promise<ApiResponse<{ classes: ClassItem[]; conflicts: ConflictItem[] }>> {
    try {
      return await apiRequest('/conflicts/resolve', {
        method: 'POST',
        body: JSON.stringify({ conflictId, classToMoveId, newDay, newSlot })
      });
    } catch {
      const res = resolveConflictWithSlot(conflictId, classToMoveId, newDay, newSlot, classes, conflicts);
      return {
        success: true,
        data: res,
        isDemoData: true
      };
    }
  },

  async autoResolveAll(
    classes: ClassItem[],
    conflicts: ConflictItem[]
  ): Promise<ApiResponse<{ classes: ClassItem[]; conflicts: ConflictItem[]; resolvedCount: number }>> {
    try {
      return await apiRequest('/conflicts/auto-resolve', {
        method: 'POST',
        body: JSON.stringify({ classes })
      });
    } catch {
      const res = autoResolveAllConflicts(classes, conflicts);
      return {
        success: true,
        data: res,
        isDemoData: true
      };
    }
  }
};

