import { TestBed } from '@angular/core/testing';

import { TaskEstimationsApiService } from './task-estimations-api.service';

describe('TaskEstimationsApiService', () => {
  let service: TaskEstimationsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskEstimationsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
