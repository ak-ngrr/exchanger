import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CurrencyService } from 'src/app/shared/services/currency.service';
import { DetailsComponent } from './details.component';
import { of } from 'rxjs';
import { conversion } from 'src/app/mock/conversion';
import { symbols } from 'src/app/mock/symbols';
import { historicalRatesResponse } from 'src/app/mock/historical-rates-mock';

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
    const currencyServiceStub = () => ({
      getCurrencySymbols: () => ({ subscribe: (f: any) => f({}) }),
      getConversion: (value: any, value1: any, value2: any) => ({ subscribe: (f: any) => f({}) }),
      requestDataForHistoricalDates: (value: any, value1: any, historicalDates: any) => ({
        subscribe: (f: any) => f({})
      })
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [DetailsComponent],
      providers: [
        { provide: Router, useFactory: routerStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: CurrencyService, useFactory: currencyServiceStub }
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
      const currencyServiceStub: CurrencyService = fixture.debugElement.injector.get(
        CurrencyService
      );
      spyOn(currencyServiceStub, 'getCurrencySymbols').and.callThrough().and.returnValue(of(symbols));

      spyOn(component, 'getCurrencySymbols').and.callThrough();
      spyOn(component, 'gethistoricalData').and.callThrough();

    });
  });

  describe('getCurrencySymbols', () => {
    it('makes expected calls', () => {
      const currencyServiceStub: CurrencyService = fixture.debugElement.injector.get(
        CurrencyService
      );
      spyOn(currencyServiceStub, 'getCurrencySymbols').and.callThrough().and.returnValue(of(symbols));
      component.getCurrencySymbols();
      expect(currencyServiceStub.getCurrencySymbols).toHaveBeenCalled();
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
    it('makes expected calls', () => {
      const currencyServiceStub: CurrencyService = fixture.debugElement.injector.get(
        CurrencyService
      );
      spyOn(component, 'gethistoricalData').and.callThrough();
      spyOn(currencyServiceStub, 'getConversion').and.callThrough().and.returnValue(of(conversion));
      component.convert();
      expect(currencyServiceStub.getConversion).toHaveBeenCalled();
    });
  });

  describe('gethistoricalData', () => {
    it('makes expected calls', () => {
      const currencyServiceStub: CurrencyService = fixture.debugElement.injector.get(
        CurrencyService
      );
      spyOn(
        currencyServiceStub,
        'requestDataForHistoricalDates'
      ).and.callThrough().and.returnValue(of(historicalRatesResponse));
      component.gethistoricalData();
      expect(
        currencyServiceStub.requestDataForHistoricalDates
      ).toHaveBeenCalled();
    });


  });
});
