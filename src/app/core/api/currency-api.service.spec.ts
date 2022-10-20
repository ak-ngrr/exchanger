import {
  HttpClientTestingModule
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CurrencyApiService } from './currency-api.service';

describe('CurrencyApiService', () => {
  let service: CurrencyApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CurrencyApiService]
    });
    service = TestBed.inject(CurrencyApiService);
  });

  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
});
