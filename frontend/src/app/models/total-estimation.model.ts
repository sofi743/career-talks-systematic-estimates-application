export interface TotalEstimation {
  id?: number;
  best: number;
  likely: number;
  worst: number;
  riskBuffer: number;
}
