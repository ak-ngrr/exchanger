import { Component, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CurrencyApiService } from 'src/app/core/api/currency-api.service';
import { popularCurrencies } from 'src/app/shared/core/constants';
import { CurrencyConversionEvent } from '../../models/response.model';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnDestroy {
  popularCurrencies: string = popularCurrencies.join(',');
  popularConversions: any[] = [];
  private destroyed$: Subject<boolean> = new Subject();

  constructor(private currencyApiService: CurrencyApiService) { }

  /**
  * Unsubscribe all the subscriptions when component gets destroyed
  */
  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
  /**
  * to get the conversion in nine popular currencies 
  */
  getPopularCurrencyConversions(event: CurrencyConversionEvent) {
    this.currencyApiService.getPopularCurrencyConversions(event.from, this.popularCurrencies)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: any) => {
        this.popularConversions.length = 0;
        if (response && response.rates && typeof response.rates == 'object') {
          Object.keys(response.rates).forEach((key) => {
            this.popularConversions.push({ symbol: key, rate: (response?.rates?.[key] * parseFloat(event.amount)).toFixed(2) })
          })
        }
      })
  }
}
