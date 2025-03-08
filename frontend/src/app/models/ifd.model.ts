import { Mvp } from './mvp.model';
import { Configuration } from './configuration.model';
import { TotalEstimation } from './total-estimation.model';

export interface Ifd {
  id?: number;
  mvps?: Mvp[];
  configuration?: Configuration;
  totalEstimation?: TotalEstimation;
}
