import { AlgorithmType, AlgorithmComparisonResult, ClassItem } from '../types';
import { apiRequest, ApiResponse } from './config';
import {
  buildConflictGraph,
  firstFitGraphColoring,
  welshPowellGraphColoring,
  dsaturGraphColoring,
  mapColorToTimeSlots,
  runAlgorithmComparison
} from '../utils/graphColoringEngine';

export const optimizationApi = {
  async runOptimization(algorithm: AlgorithmType, classes: ClassItem[]): Promise<ApiResponse<{ classes: ClassItem[]; executionTimeMs: number }>> {
    try {
      return await apiRequest('/optimization/run', {
        method: 'POST',
        body: JSON.stringify({ algorithm, classes })
      });
    } catch {
      const { edges } = buildConflictGraph(classes);
      const t0 = performance.now();

      let colorMap: Map<string, number>;
      if (algorithm === 'Welsh-Powell') {
        colorMap = welshPowellGraphColoring(classes, edges);
      } else if (algorithm === 'DSATUR') {
        colorMap = dsaturGraphColoring(classes, edges);
      } else {
        colorMap = firstFitGraphColoring(classes, edges);
      }

      const t1 = performance.now();
      const optimizedClasses = mapColorToTimeSlots(classes, colorMap);

      return {
        success: true,
        data: {
          classes: optimizedClasses,
          executionTimeMs: Number((t1 - t0).toFixed(2))
        },
        isDemoData: true
      };
    }
  },

  async compareAlgorithms(classes: ClassItem[]): Promise<ApiResponse<AlgorithmComparisonResult[]>> {
    try {
      return await apiRequest<AlgorithmComparisonResult[]>('/optimization/compare', {
        method: 'POST',
        body: JSON.stringify({ classes })
      });
    } catch {
      const results = runAlgorithmComparison(classes);
      return {
        success: true,
        data: results,
        isDemoData: true
      };
    }
  }
};
