import { EstimationType } from './estimation-type.model';

export interface Configuration {
  id: number;
  estimationType: EstimationType;
  complexity: number;
}
