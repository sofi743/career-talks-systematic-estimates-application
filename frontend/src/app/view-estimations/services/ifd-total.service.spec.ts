import { TestBed } from '@angular/core/testing';

import { IfdTotalService } from './ifd-total.service';

describe('IfdTotalService', () => {
  let service: IfdTotalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IfdTotalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
