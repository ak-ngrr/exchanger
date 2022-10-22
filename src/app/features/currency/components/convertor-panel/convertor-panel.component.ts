import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CurrencyApiService } from 'src/app/core/api/currency-api.service';
import { CurrencyConversionData, CurrencyConversionEvent, CurrencyConversionresponse } from 'src/app/features/currency/models/response.model';
import { popularCurrencies } from '../../../../shared/core/constants';

@Component({
  selector: 'app-convertor-panel',
  templateUrl: './convertor-panel.component.html',
  styleUrls: ['./convertor-panel.component.scss']
})
export class ConvertorPanelComponent implements OnInit, OnDestroy {

  amount = new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+(\.?[0-9]+)?$/)]);
  from = new FormControl('');
  to = new FormControl('');
  rate = new FormControl('');
  convertedCurrency = new FormControl('');
  viewMode = "home";
  currencySymbols: string[] = [];
  popularCurrencies = popularCurrencies;
  private destroyed$: Subject<boolean> = new Subject();

  @Output() currencyConversionEvent = new EventEmitter<CurrencyConversionEvent>();

  constructor(private currencyApiService: CurrencyApiService,
    private router: Router) { }

  ngOnInit(): void {
    this.getCurrencySymbols();
    this.currencyApiService.setCUrrencyValues
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: CurrencyConversionData) => {
        if (response && response.amount)
          this.setValues(response);
        else
          this.setDefaultValues();
      })
    if (this.router.url.indexOf('details') > -1)
      this.viewMode = "details";
    else
      this.viewMode = "home";
  }

  /**
  * Unsubscribe all the subscriptions when component gets destroyed
  */
  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
  /**
  * For setting default form values
  */
  setDefaultValues() {
    this.amount.setValue('1');
    this.from.setValue('EUR');
    this.to.setValue('USD');
  }
  /**
  * For swapping the to and from currency
  */
  swapCurrencySymbols() {
    const temp = this.from.value;
    this.from.setValue(this.to.value);
    this.to.setValue(temp);
  }

  /**
  * For setting form values
  */
  setValues(params: CurrencyConversionData) {
    this.from.setValue(params.from);
    this.to.setValue(params.to);
    this.amount.setValue(params.amount);
    this.convertedCurrency.setValue(params.convertedCurrency);
    this.rate.setValue(params.rate);
  }

  /**
  * For getting list of all the currencies
  */
  getCurrencySymbols() {
    this.currencyApiService.getCurrencySymbols()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: any) => {
        if (typeof response.symbols == 'object') {
          this.currencySymbols = Object.keys(response.symbols)
          this.amount.setValue(1);
          this.from.setValue('EUR');
          this.to.setValue('USD');
        }
      })
  }

  /**
  * For converion from base currency to a desired currency
  */
  convert() {
    this.currencyApiService.getConversion(this.amount.value, this.from.value, this.to.value)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: CurrencyConversionresponse) => {
        if (response && response.info && response.info.rate && response.result) {
          this.rate.setValue(`1.00 ${this.from.value} = ${response.info.rate} ${this.to.value}`);
          this.convertedCurrency.setValue(`${response.result} ${this.to.value}`)
          this.currencyConversionEvent.emit({ from: this.from.value, amount: this.amount.value, to: this.to.value });
          const param = { from: this.from.value, to: this.to.value, amount: this.amount.value, rate: this.rate.value, convertedCurrency: this.convertedCurrency.value };
          this.currencyApiService.setCUrrencyValues.next(param);
        }
      })
  }

  /**
  * For clearing/resetting the amount
  */
  resetAmount() {
    this.amount.setValue('');
  }

  /**
  * For navigating to the Details page
  */
  redirectToDetails() {
    const param = { from: this.from.value, to: this.to.value, amount: this.amount.value, rate: this.rate.value, convertedCurrency: this.convertedCurrency.value };
    this.currencyApiService.setCUrrencyValues.next(param)
    this.router.navigate(['/details'])
  }
}
