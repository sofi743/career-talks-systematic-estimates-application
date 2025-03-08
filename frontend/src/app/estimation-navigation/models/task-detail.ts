export interface TaskDetail {
  comments: string | null;
  keyName: string;
  best: number;
  likely: number;
  worst: number;
  userId: number;
  callsign: string;
}
