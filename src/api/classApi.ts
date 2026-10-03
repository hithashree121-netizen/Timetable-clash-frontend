import { ClassItem } from '../types';
import { INITIAL_CLASSES } from '../data/mockData';
import { apiRequest, ApiResponse } from './config';

let localClassesStore: ClassItem[] = [...INITIAL_CLASSES];

export const classApi = {
  async getAll(): Promise<ApiResponse<ClassItem[]>> {
    try {
      return await apiRequest<ClassItem[]>('/classes');
    } catch {
      return {
        success: true,
        data: [...localClassesStore],
        isDemoData: true
      };
    }
  },

  async add(newClass: Omit<ClassItem, 'id'>): Promise<ApiResponse<ClassItem>> {
    const item: ClassItem = {
      ...newClass,
      id: `cls-${Date.now()}`
    };

    try {
      return await apiRequest<ClassItem>('/classes', {
        method: 'POST',
        body: JSON.stringify(item)
      });
    } catch {
      localClassesStore.push(item);
      return {
        success: true,
        data: item,
        isDemoData: true
      };
    }
  },

  async update(id: string, updatedFields: Partial<ClassItem>): Promise<ApiResponse<ClassItem>> {
    try {
      return await apiRequest<ClassItem>(`/classes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedFields)
      });
    } catch {
      const idx = localClassesStore.findIndex(c => c.id === id);
      if (idx !== -1) {
        localClassesStore[idx] = { ...localClassesStore[idx], ...updatedFields };
      }
      return {
        success: true,
        data: localClassesStore[idx],
        isDemoData: true
      };
    }
  },

  async delete(id: string): Promise<ApiResponse<boolean>> {
    try {
      return await apiRequest<boolean>(`/classes/${id}`, { method: 'DELETE' });
    } catch {
      localClassesStore = localClassesStore.filter(c => c.id !== id);
      return {
        success: true,
        data: true,
        isDemoData: true
      };
    }
  }
};
