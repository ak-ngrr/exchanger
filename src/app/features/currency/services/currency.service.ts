import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, Subject } from 'rxjs';
import { API_ENDPOINT_BASE_URL, API_KEY } from 'src/environments/environment';
import { CurrencyConversionresponse } from '../models/response.model';
@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private endSubs$ = new Subject();
  myHeaders: HttpHeaders;
  constructor(private http: HttpClient) {
    this.myHeaders = new HttpHeaders({ apikey: API_KEY });
  }

  /**
   * For getting all the currency symbols
   * @returns Observable
   */

  getCurrencySymbols() {
    return this.http.get<CurrencyConversionresponse>(`${API_ENDPOINT_BASE_URL}/symbols`, { headers: this.myHeaders });
    // return of(symbols);
  }

  /**
  * For getting converted amount into a desired currency
  * @param amount 
  * @param from base currency
  * @param to desired currency
  * @returns Observable
  */

  getConversion(amount: string, from: string, to: string) {
    return this.http.get<CurrencyConversionresponse>(`${API_ENDPOINT_BASE_URL}/convert?to=${to}&from=${from}&amount=${amount}`, { headers: this.myHeaders });
    // return of(conversion);
  }

  /**
  * For getting converted amount into a desired currency
  * @param from base currency
  * @param to desired currencies
  * @returns Observable
  */
  getPopularCurrencyConversions(from: string, to: string) {
    return this.http.get<CurrencyConversionresponse>(`${API_ENDPOINT_BASE_URL}/latest?symbols=${to}&base=${from}`, { headers: this.myHeaders });
    // return of(latest);
  }

  /**
  * For getting historical rates of the desired currency
  * @param from base currency
  * @param to desired currencies
  * @returns Observable
  */
  public requestDataForHistoricalDates(from: string, to: string, historicalDates: string[]): Observable<any[]> {
    return forkJoin(historicalDates.map(x => this.http.get(`${API_ENDPOINT_BASE_URL}/${x}?symbols=${to}&base=${from}`, { headers: this.myHeaders })));
    // return of(historicalRatesResponse)
  }
}
