import { TestBed } from '@angular/core/testing';

import { EstimationNavigationService } from './estimation-navigation.service';

describe('EstimationNavigationService', () => {
  let service: EstimationNavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstimationNavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
