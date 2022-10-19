import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { HomeComponent } from './home.component';
import { conversion } from 'src/app/mock/conversion';
import { of } from 'rxjs';
import { CurrencyService } from '../../services/currency.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(() => {
    const routerStub = () => ({ navigate: (array: any) => ({}) });
    const currencyServiceStub = () => ({
      getCurrencySymbols: () => ({ subscribe: (f: any) => f({}) }),
      getConversion: (value: string, value1: string, value2: string) => ({ subscribe: (f: any) => f({}) }),
      getPopularCurrencyConversions: (value: string, popularCurrencies: string) => ({
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
    xit('makes expected calls', () => {
      component.ngOnInit();
    });
  });

  describe('getCurrencySymbols', () => {
    xit('makes expected calls', () => {
      const currencyServiceStub: CurrencyService = fixture.debugElement.injector.get(
        CurrencyService
      );
      spyOn(currencyServiceStub, 'getCurrencySymbols').and.callThrough();
      component.getCurrencySymbols();
      expect(currencyServiceStub.getCurrencySymbols).toHaveBeenCalled();
    });
  });

  describe('convert', () => {
    xit('makes expected calls', () => {
      const currencyServiceStub: CurrencyService = fixture.debugElement.injector.get(
        CurrencyService
      );
      spyOn(currencyServiceStub, 'getConversion').and.callThrough().and.returnValue(of(conversion));
      component.convert();
      expect(currencyServiceStub.getConversion).toHaveBeenCalled();
    });
  });

  describe('ConvertToPopularCurrecies', () => {
    xit('makes expected calls', () => {
      const currencyServiceStub: CurrencyService = fixture.debugElement.injector.get(
        CurrencyService
      );
      spyOn(
        currencyServiceStub,
        'getPopularCurrencyConversions'
      ).and.callThrough();
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
      const button = fixture.debugElement.nativeElement.querySelector('button');
      button.click();
      fixture.whenStable().then(() => {
        expect(component.resetAmount).toHaveBeenCalled();
      });
    });

  });
});
