import { TestBed } from '@angular/core/testing';

import { TaskEstimationsService } from './task-estimations.service';

describe('TaskEstimationsService', () => {
  let service: TaskEstimationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskEstimationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
