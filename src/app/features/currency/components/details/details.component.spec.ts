import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { CurrencyApiService } from 'src/app/core/api/currency-api.service';
import { historicalRatesResponse } from 'src/app/mock/historical-rates-mock';
import { symbols } from 'src/app/mock/symbols';
import { DetailsComponent } from './details.component';

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;

  beforeEach(() => {
    const routerStub = () => ({ navigate: (array: any) => ({}) });
    const activatedRouteStub = () => ({
      paramMap: {
        get: () => 1,
        subscribe: () => { }
      }
    });
    const currencyApiServiceStub = () => ({
      getCurrencySymbols: () => ({ subscribe: (f: any) => f({}) }),
      getConversion: (value: string, value1: string, value2: string) => ({ subscribe: (f: any) => f({}) }),
      requestDataForHistoricalDates: (value: string, value1: string, historicalDates: string[]) => ({
        subscribe: (f: any) => f({})
      })
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [DetailsComponent],
      providers: [
        { provide: Router, useFactory: routerStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: CurrencyApiService, useFactory: currencyApiServiceStub }
      ]
    });
    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const currencyApiServiceStub: CurrencyApiService = fixture.debugElement.injector.get(
        CurrencyApiService
      );
      spyOn(currencyApiServiceStub, 'getCurrencySymbols').and.callThrough().and.returnValue(of(symbols));
    });
  });

  describe('redirectToHome', () => {
    it('makes expected calls', () => {
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      spyOn(routerStub, 'navigate').and.callThrough();
      component.redirectToHome();
      expect(routerStub.navigate).toHaveBeenCalled();
    });
  });

  describe('gethistoricalData', () => {
    it('makes expected calls', () => {
      const currencyApiServiceStub: CurrencyApiService = fixture.debugElement.injector.get(
        CurrencyApiService
      );
      spyOn(
        currencyApiServiceStub,
        'requestDataForHistoricalDates'
      ).and.callThrough().and.returnValue(of(historicalRatesResponse));
      component.requestDataForHistoricalDates({ from: "USD", amount: "1", to: "INR" });
      expect(
        currencyApiServiceStub.requestDataForHistoricalDates
      ).toHaveBeenCalled();
    });
  });
});
