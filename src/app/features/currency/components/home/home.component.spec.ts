import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { latest } from 'src/app/mock/latest';
import { HomeComponent } from './home.component';

import { of } from 'rxjs';
import { CurrencyApiService } from 'src/app/core/api/currency-api.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(() => {
    const routerStub = () => ({ navigate: (array: any) => ({}) });
    const currencyApiServiceStub = () => ({
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
        { provide: CurrencyApiService, useFactory: currencyApiServiceStub }
      ]
    });
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`popularConversions has default value`, () => {
    expect(component.popularConversions).toEqual([]);
  });

  describe('ConvertToPopularCurrecies', () => {
    it('makes expected calls', () => {
      const currencyApiServiceStub: CurrencyApiService = fixture.debugElement.injector.get(
        CurrencyApiService
      );
      spyOn(
        currencyApiServiceStub,
        'getPopularCurrencyConversions'
      ).and.callThrough().and.returnValue(of(latest));
      component.getPopularCurrencyConversions({ from: "", amount: "", to: "" });
      expect(
        currencyApiServiceStub.getPopularCurrencyConversions
      ).toHaveBeenCalled();
    });
  });
});
