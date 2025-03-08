import { TestBed } from '@angular/core/testing';

import { EstimationNavigationApiService } from './estimation-navigation-api.service';

describe('EstimationNavigationApiService', () => {
  let service: EstimationNavigationApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstimationNavigationApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
