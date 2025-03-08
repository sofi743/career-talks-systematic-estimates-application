import { TestBed } from '@angular/core/testing';

import { CreateIfdService } from './create-ifd.service';

describe('CreateIfdService', () => {
  let service: CreateIfdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateIfdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
