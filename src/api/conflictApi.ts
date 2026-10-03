import { ConflictItem, ClassItem } from '../types';
import { INITIAL_CONFLICTS } from '../data/mockData';
import { apiRequest, ApiResponse } from './config';
import { buildConflictGraph } from '../utils/graphColoringEngine';

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
      const { edges } = buildConflictGraph(classes);
      const generatedConflicts: ConflictItem[] = edges.map((edge, idx) => ({
        id: `cnf-det-${idx + 100}`,
        type: edge.reason.includes('Faculty')
          ? 'Faculty Conflict'
          : edge.reason.includes('Room')
          ? 'Room Conflict'
          : 'Student Group Conflict',
        subject1: classes.find(c => c.id === edge.source)?.subject || edge.source,
        subject2: classes.find(c => c.id === edge.target)?.subject || edge.target,
        relatedResource: edge.reason,
        timeSlot: 'Unassigned Conflict',
        severity: 'Critical',
        status: 'Unresolved'
      }));

      return {
        success: true,
        data: generatedConflicts.length > 0 ? generatedConflicts : [],
        isDemoData: true
      };
    }
  }
};
