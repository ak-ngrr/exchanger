import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { api_key } from 'src/app/core/contants';
import { conversion } from 'src/app/mock/conversion';
import { historicalRatesResponse } from 'src/app/mock/historical-rates-mock';
import { latest } from 'src/app/mock/latest';
import { symbols } from 'src/app/mock/symbols';
@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private endSubs$ = new Subject();
  myHeaders: any;
  constructor(private http: HttpClient) {
    this.myHeaders = new HttpHeaders({ apikey: api_key });
  }

  /**
 * For getting all the currency symbols
 * @returns Observable
 */

  getCurrencySymbols() {
    // return this.http.get<CurrencyConversionresponse>("https://api.apilayer.com/fixer/symbols", { headers: this.myHeaders });
    return of(symbols);
  }

  /**
 * For getting converted amount into a desired currency
 * @param amount 
 * @param from base currency
 * @param to desired currency
 * @returns Observable
 */

  getConversion(amount: string, from: string, to: string) {
    // return this.http.get<CurrencyConversionresponse>(`https://api.apilayer.com/fixer/convert?to=${to}&from=${from}&amount=${amount}`, { headers: this.myHeaders });
    return of(conversion);
  }

  /**
* For getting converted amount into a desired currency
* @param from base currency
* @param to desired currencies
* @returns Observable
*/
  getPopularCurrencyConversions(from: string, to: string) {
    // return this.http.get<CurrencyConversionresponse>(`https://api.apilayer.com/fixer/latest?symbols=${to}&base=${from}`, { headers: this.myHeaders });
    return of(latest);
  }

  /**
* For getting historical rates of the desired currency
* @param from base currency
* @param to desired currencies
* @returns Observable
*/
  public requestDataForHistoricalDates(from: string, to: string, historicalDates: string[]): Observable<any[]> {
    // return forkJoin(historicalDates.map(x => this.http.get(`https://api.apilayer.com/fixer/${x}?symbols=${to}&base=${from}`, { headers: this.myHeaders })));
    return of(historicalRatesResponse)
  }
}
