import { ClassItem } from '../types';
import { apiRequest, ApiResponse } from './config';
import { INITIAL_CLASSES } from '../data/mockData';

let currentTimetableStore: ClassItem[] = [...INITIAL_CLASSES];

export const timetableApi = {
  async getTimetable(): Promise<ApiResponse<ClassItem[]>> {
    try {
      return await apiRequest<ClassItem[]>('/timetable');
    } catch {
      return {
        success: true,
        data: [...currentTimetableStore],
        isDemoData: true
      };
    }
  },

  async saveTimetable(classes: ClassItem[]): Promise<ApiResponse<boolean>> {
    try {
      return await apiRequest<boolean>('/timetable', {
        method: 'POST',
        body: JSON.stringify({ classes })
      });
    } catch {
      currentTimetableStore = [...classes];
      return {
        success: true,
        data: true,
        isDemoData: true
      };
    }
  }
};
