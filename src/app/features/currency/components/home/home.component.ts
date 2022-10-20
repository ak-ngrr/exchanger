import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { concatMap, ReplaySubject, takeUntil } from 'rxjs';
import { CurrencyApiService } from 'src/app/core/api/currency-api.service';
import { popularCurrencies } from '../../constants';
import { CurrencyConversionresponse } from '../../models/response.model';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  amount = new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+(\.?[0-9]+)?$/)]);
  from = new FormControl('');
  to = new FormControl('');
  rate = new FormControl('');
  convertedCurrency = new FormControl('');

  currencySymbols: string[] = [];
  popularConversions: any[] = [];
  popularCurrencies = popularCurrencies;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private currencyApiService: CurrencyApiService,
    private router: Router) { }

  ngOnInit(): void {
    this.getCurrencySymbols();
  }
  /**
 * Unsubscribe all the subscriptions when component gets destroyed
 */
  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }

  /**
  * For getting list of all the currencies
  */
  getCurrencySymbols() {
    this.currencyApiService.getCurrencySymbols()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: any) => {
        if (typeof response.symbols == 'object')
          this.currencySymbols = Object.keys(response.symbols)
        this.amount.setValue(1);
        this.from.setValue('EUR');
        this.to.setValue('USD');

      })

  }

  /**
  * For converion from base currency to a desired currency
  */
  convert() {
    this.currencyApiService.getConversion(this.amount.value, this.from.value, this.to.value)
      .pipe(
        concatMap((response: CurrencyConversionresponse) => {
          if (response && response.info && response.info.rate && response.result) {
            this.rate.setValue(`1.00 ${this.from.value} = ${response.info.rate} ${this.to.value}`);
            this.convertedCurrency.setValue(`${response.result} ${this.to.value}`)
          }
          const popularCurrencies = this.popularCurrencies.join(',');
          return this.currencyApiService.getPopularCurrencyConversions(this.from.value, popularCurrencies)
        })
      )
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: any) => {
        this.popularConversions.length = 0;
        if (response && response.rates && typeof response.rates == 'object') {
          Object.keys(response.rates).forEach((key) => {
            this.popularConversions.push({ symbol: key, rate: (response?.rates?.[key] * this.amount.value).toFixed(2) })
          })
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
    this.router.navigate(['/details', param])
  }

  /**
  * For swapping the to and from currency
  */
  swapCurrencySymbols() {
    const temp = this.from.value;
    this.from.setValue(this.to.value);
    this.to.setValue(temp);
  }
}
