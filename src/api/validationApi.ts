import { ClassItem, ValidationReport } from '../types';
import { apiRequest, ApiResponse } from './config';
import { validateTimetable } from '../utils/graphColoringEngine';

export const validationApi = {
  async validate(classes: ClassItem[]): Promise<ApiResponse<ValidationReport>> {
    try {
      return await apiRequest<ValidationReport>('/timetable/validate', {
        method: 'POST',
        body: JSON.stringify({ classes })
      });
    } catch {
      const report = validateTimetable(classes);
      return {
        success: true,
        data: report,
        isDemoData: true
      };
    }
  }
};
