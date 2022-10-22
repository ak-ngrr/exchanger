import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap, Subject, Subscription, takeUntil } from 'rxjs';
import { CurrencyApiService } from 'src/app/core/api/currency-api.service';
import { historicalDates, months } from '../../../../shared/core/constants';
import { CurrencyConversionData, CurrencyConversionEvent } from '../../models/response.model';
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {
  title?= '';
  currencyValues: CurrencyConversionData = {
    from: 'EUR',
    amount: '1',
    to: 'USD',
    convertedCurrency: '',
    rate: ''
  }
  subscription: Subscription;
  currencySymbols = [''];
  historicaldata: any[] = [];
  historicalMonths = months.map((m, i) => months[parseInt(historicalDates[i].split('-')[1]) - 1]);
  private destroyed$: Subject<boolean> = new Subject();
  constructor(private route: ActivatedRoute, private router: Router, private currencyApiService: CurrencyApiService,) { }

  ngOnInit(): void {
    this.subscription = this.currencyApiService.setCUrrencyValues
      .pipe(concatMap((params: CurrencyConversionData) => {
        this.title = params.from;
        this.currencyValues = params;
        this.currencyApiService.setCUrrencyValues.next(params);
        return this.currencyApiService.requestDataForHistoricalDates(params.from, params.to, historicalDates);
      })
      )
      .subscribe(response => {
        if (response && response.length > 0) {
          this.historicaldata = response.map((x: any) => x.rates[this.currencyValues.to]);
        }
      })
  }
  /**
  * Unsubscribe all the subscriptions when component gets destroyed
  */
  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
    this.subscription?.unsubscribe();
  }

  /**
  * For navigating to the Details page
  */
  redirectToHome() {
    this.router.navigate(['/home']);
  }

  requestDataForHistoricalDates(event: CurrencyConversionEvent) {
    this.currencyApiService.requestDataForHistoricalDates(event.from, event.to, historicalDates)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response && response.length > 0) {
          this.historicaldata = response.map((x: any) => x.rates[event.to]);
        }
      })
  }
}
