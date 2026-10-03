export const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  isDemoData?: boolean;
  message?: string;
}

let isDemoMode = true;

export function getDemoMode(): boolean {
  return isDemoMode;
}

export function setDemoMode(enabled: boolean): void {
  isDemoMode = enabled;
}

export async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  if (isDemoMode) {
    throw new Error('DEMO_MODE_ACTIVE');
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      ...options
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data,
      isDemoData: false
    };
  } catch (err: any) {
    console.warn(`API call to ${endpoint} failed or backend offline. Using fallback engine:`, err?.message);
    throw err;
  }
}
