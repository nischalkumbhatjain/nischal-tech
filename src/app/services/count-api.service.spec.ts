import { TestBed } from '@angular/core/testing';

import { CountApiService } from './count-api.service';

describe('CountApiService', () => {
  let service: CountApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CountApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
