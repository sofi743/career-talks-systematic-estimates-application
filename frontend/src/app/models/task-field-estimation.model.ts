/**
 * Partially mapped with the backend bean, keeping core information about task field estimation and task field id (fieldId)
 */
export interface TaskFieldEstimation {
  best: number;
  likely: number;
  worst: number;
  fieldId?: number;
  id?: number;
  comments?: string;
}
