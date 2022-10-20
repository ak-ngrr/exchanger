import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { concatMap, forkJoin, Subject, takeUntil } from 'rxjs';
import { CurrencyApiService } from 'src/app/core/api/currency-api.service';
import { historicalDates, months } from '../../../../shared/core/constants';
import { CurrencyConversionresponse } from '../../models/response.model';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {
  amount = new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+(\.?[0-9]+)?$/)]);
  from = new FormControl('');
  to = new FormControl('');
  rate = new FormControl('');
  convertedCurrency = new FormControl('');
  title = '';
  currencySymbols = ['']
  historicaldata: any[] = [];
  historicalMonths = months.map((m, i) => months[parseInt(historicalDates[i].split('-')[1]) - 1]);
  private destroyed$: Subject<boolean> = new Subject();
  constructor(private route: ActivatedRoute, private router: Router, private currencyApiService: CurrencyApiService,) { }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        concatMap(params => {
          this.setValues(params);
          return forkJoin([
            this.currencyApiService.getCurrencySymbols(),
            this.currencyApiService.requestDataForHistoricalDates(this.from.value, this.to.value, historicalDates)
          ]);
        })
      )
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: any[]) => {
        if (response && response.length == 2 && response[0].symbols && typeof response[0].symbols == 'object' && response[1].length > 0) {
          this.currencySymbols = Object.keys(response[0].symbols);
          this.title = `${this.from.value} - ${response[0].symbols[this.from.value]}`;
          this.historicaldata = response[1].map((x: any) => x.rates[this.to.value]);
        }
      })
  }
  /**
  * Unsubscribe all the subscriptions when component gets destroyed
  */
  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }

  /**
  * For setting form values
  */
  setValues(params: ParamMap) {
    this.from.setValue(params.get('from'));
    this.to.setValue(params.get('to'));
    this.amount.setValue(params.get('amount'));
    this.convertedCurrency.setValue(params.get('convertedCurrency'));
    this.rate.setValue(params.get('rate'));
  }

  /**
  * For navigating to the Details page
  */
  redirectToHome() {
    this.router.navigate(['/home']);
  }

  /**
  * For clearing/resetting the amount
  */
  resetAmount() {
    this.amount.setValue('');
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
            this.convertedCurrency.setValue(`${response.result} ${this.to.value}`);
          }
          return this.currencyApiService.requestDataForHistoricalDates(this.from.value, this.to.value, historicalDates)
        })
      )
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response && response.length > 0) {
          this.historicaldata = response.map((x: any) => x.rates[this.to.value]);
        }
      })
  }
}
