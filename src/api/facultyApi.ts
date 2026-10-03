import { FacultyItem } from '../types';
import { INITIAL_FACULTY } from '../data/mockData';
import { apiRequest, ApiResponse } from './config';

let localFacultyStore: FacultyItem[] = [...INITIAL_FACULTY];

export const facultyApi = {
  async getAll(): Promise<ApiResponse<FacultyItem[]>> {
    try {
      return await apiRequest<FacultyItem[]>('/faculty');
    } catch {
      return {
        success: true,
        data: [...localFacultyStore],
        isDemoData: true
      };
    }
  },

  async add(item: Omit<FacultyItem, 'id'>): Promise<ApiResponse<FacultyItem>> {
    const newItem: FacultyItem = { ...item, id: `fac-${Date.now()}` };
    try {
      return await apiRequest<FacultyItem>('/faculty', {
        method: 'POST',
        body: JSON.stringify(newItem)
      });
    } catch {
      localFacultyStore.push(newItem);
      return { success: true, data: newItem, isDemoData: true };
    }
  },

  async delete(id: string): Promise<ApiResponse<boolean>> {
    try {
      return await apiRequest<boolean>(`/faculty/${id}`, { method: 'DELETE' });
    } catch {
      localFacultyStore = localFacultyStore.filter(f => f.id !== id);
      return { success: true, data: true, isDemoData: true };
    }
  }
};
