import { RoomItem } from '../types';
import { INITIAL_ROOMS } from '../data/mockData';
import { apiRequest, ApiResponse } from './config';

let localRoomStore: RoomItem[] = [...INITIAL_ROOMS];

export const roomApi = {
  async getAll(): Promise<ApiResponse<RoomItem[]>> {
    try {
      return await apiRequest<RoomItem[]>('/rooms');
    } catch {
      return { success: true, data: [...localRoomStore], isDemoData: true };
    }
  },

  async add(item: Omit<RoomItem, 'id'>): Promise<ApiResponse<RoomItem>> {
    const newItem: RoomItem = { ...item, id: `rm-${Date.now()}` };
    try {
      return await apiRequest<RoomItem>('/rooms', {
        method: 'POST',
        body: JSON.stringify(newItem)
      });
    } catch {
      localRoomStore.push(newItem);
      return { success: true, data: newItem, isDemoData: true };
    }
  },

  async delete(id: string): Promise<ApiResponse<boolean>> {
    try {
      return await apiRequest<boolean>(`/rooms/${id}`, { method: 'DELETE' });
    } catch {
      localRoomStore = localRoomStore.filter(r => r.id !== id);
      return { success: true, data: true, isDemoData: true };
    }
  }
};
