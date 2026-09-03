import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CountApiService } from './count-api.service';

describe('CountApiService', () => {
  let service: CountApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(CountApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
