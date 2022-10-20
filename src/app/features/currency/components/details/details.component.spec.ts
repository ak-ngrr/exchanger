import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { DetailsComponent } from './details.component';
import { of } from 'rxjs';
import { conversion } from 'src/app/mock/conversion';
import { symbols } from 'src/app/mock/symbols';
import { historicalRatesResponse } from 'src/app/mock/historical-rates-mock';
import { CurrencyApiService } from 'src/app/core/api/currency-api.service';

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

  it(`currencySymbols has default value`, () => {
    expect(component.currencySymbols).toEqual([``]);
  });

  it(`historicaldata has default value`, () => {
    expect(component.historicaldata).toEqual([]);
  });



  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const currencyApiServiceStub: CurrencyApiService = fixture.debugElement.injector.get(
        CurrencyApiService
      );
      spyOn(currencyApiServiceStub, 'getCurrencySymbols').and.callThrough().and.returnValue(of(symbols));
    });
  });

  describe('getCurrencySymbols', () => {
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
    it('should reset Amount', () => {
      const button = fixture.debugElement.nativeElement.querySelector('button');
      button.click();
      fixture.whenStable().then(() => {
        expect(component.resetAmount).toHaveBeenCalled();
      });
    });
  });

  describe('convert', () => {
    xit('makes expected calls', () => {
      const currencyApiServiceStub: CurrencyApiService = fixture.debugElement.injector.get(
        CurrencyApiService
      );
      spyOn(currencyApiServiceStub, 'getConversion').and.callThrough().and.returnValue(of(conversion));
      component.convert();
      expect(currencyApiServiceStub.getConversion).toHaveBeenCalled();
    });
  });

  describe('gethistoricalData', () => {
    xit('makes expected calls', () => {
      const currencyApiServiceStub: CurrencyApiService = fixture.debugElement.injector.get(
        CurrencyApiService
      );
      spyOn(
        currencyApiServiceStub,
        'requestDataForHistoricalDates'
      ).and.callThrough().and.returnValue(of(historicalRatesResponse));
      expect(
        currencyApiServiceStub.requestDataForHistoricalDates
      ).toHaveBeenCalled();
    });


  });
});
