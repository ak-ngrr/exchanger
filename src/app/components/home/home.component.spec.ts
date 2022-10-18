import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyService } from 'src/app/services/currency.service';
import { HomeComponent } from './home.component';
import { conversion } from 'src/app/mock/conversion';
import { of } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(() => {
    const routerStub = () => ({ navigate: (array: any) => ({}) });
    const currencyServiceStub = () => ({
      getCurrencySymbols: () => ({ subscribe: (f: any) => f({}) }),
      getConversion: (value: any, value1: any, value2: any) => ({ subscribe: (f: any) => f({}) }),
      getPopularCurrencyConversions: (value: any, popularCurrencies: any) => ({
        subscribe: (f: any) => f({})
      })
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [HomeComponent],
      providers: [
        { provide: Router, useFactory: routerStub },
        { provide: CurrencyService, useFactory: currencyServiceStub }
      ]
    });
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`currencySymbols has default value`, () => {
    expect(component.currencySymbols).toEqual([]);
  });

  it(`popularConversions has default value`, () => {
    expect(component.popularConversions).toEqual([]);
  });

  it(`popularCurrencies has default value`, () => {
    expect(component.popularCurrencies).toEqual([
      `INR`,
      `USD`,
      `EUR`,
      `AED`,
      `SGD`,
      `CNY`,
      `AUD`,
      `RUB`,
      `GBP`
    ]);
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getCurrencySymbols').and.callThrough();
      component.ngOnInit();
      expect(component.getCurrencySymbols).toHaveBeenCalled();
    });
  });

  describe('getCurrencySymbols', () => {
    it('makes expected calls', () => {
      const currencyServiceStub: CurrencyService = fixture.debugElement.injector.get(
        CurrencyService
      );
      spyOn(currencyServiceStub, 'getCurrencySymbols').and.callThrough();
      component.getCurrencySymbols();
      expect(currencyServiceStub.getCurrencySymbols).toHaveBeenCalled();
    });
  });

  describe('convert', () => {
    it('makes expected calls', () => {
      const currencyServiceStub: CurrencyService = fixture.debugElement.injector.get(
        CurrencyService
      );
      spyOn(component, 'ConvertToPopularCurrecies').and.callThrough();
      spyOn(currencyServiceStub, 'getConversion').and.callThrough().and.returnValue(of(conversion));
      component.convert();
      // expect(component.ConvertToPopularCurrecies).toHaveBeenCalled();
      expect(currencyServiceStub.getConversion).toHaveBeenCalled();
    });
  });

  describe('ConvertToPopularCurrecies', () => {
    it('makes expected calls', () => {
      const currencyServiceStub: CurrencyService = fixture.debugElement.injector.get(
        CurrencyService
      );
      spyOn(
        currencyServiceStub,
        'getPopularCurrencyConversions'
      ).and.callThrough();
      component.ConvertToPopularCurrecies();
      expect(
        currencyServiceStub.getPopularCurrencyConversions
      ).toHaveBeenCalled();
    });
  });

  describe('redirectToDetails', () => {
    it('makes expected calls', () => {
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      spyOn(routerStub, 'navigate').and.callThrough();
      component.redirectToDetails();
      expect(routerStub.navigate).toHaveBeenCalled();
    });


    it('should reset Amount', () => {
      let button = fixture.debugElement.nativeElement.querySelector('button');
      button.click();
      fixture.whenStable().then(() => {
        expect(component.resetAmount).toHaveBeenCalled();
      });
    });

  });
});
