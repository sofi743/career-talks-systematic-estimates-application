import { TaskRow } from './task-row';
import { TaskFieldEstimation } from '../../models/task-field-estimation.model';

export interface ProcessedData {
  rows: { [keyName: string]: TaskRow };
  totals: { [callsign: string]: TaskFieldEstimation };
  finalEstimates: { [keyName: string]: TaskFieldEstimation };
}
