import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyConversionresponse } from 'src/app/models/response.model';
import { CurrencyService } from 'src/app/services/currency.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  amount = new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+(\.?[0-9]+)?$/)]);
  from = new FormControl('');
  to = new FormControl('');
  rate = new FormControl('');
  convertedCurrency = new FormControl('');

  currencySymbols: any[] = [];
  popularConversions: any[] = [];
  popularCurrencies = ['INR', 'USD', 'EUR', 'AED', 'SGD', 'CNY', 'AUD', 'RUB', 'GBP']

  constructor(private currencySevice: CurrencyService,
    private router: Router) { }

  ngOnInit(): void {
    this.getCurrencySymbols();
  }

  /**
* For getting list of all the currencies
*/
  getCurrencySymbols() {
    this.currencySevice.getCurrencySymbols().subscribe((response: any) => {
      if (typeof response.symbols == 'object')
        this.currencySymbols = Object.keys(response.symbols)
      console.log(response.symbols)
      this.amount.setValue(1);
      this.from.setValue('EUR');
      this.to.setValue('USD');

    })

  }

  /**
* For converion from base currency to a desired currency
*/
  convert() {
    this.currencySevice.getConversion(this.amount.value, this.from.value, this.to.value).subscribe((response: CurrencyConversionresponse) => {
      if (response && response.info && response.info.rate && response.result) {
        this.rate.setValue(`1.00 ${this.from.value} = ${response.info.rate} ${this.to.value}`);
        this.convertedCurrency.setValue(`${response.result} ${this.to.value}`)
        this.ConvertToPopularCurrecies();
      }

    })
  }

  /**
* For converion from base currency to a list of currencies
*/
  ConvertToPopularCurrecies() {
    const popularCurrencies = this.popularCurrencies.join(',');
    this.currencySevice.getPopularCurrencyConversions(this.from.value, popularCurrencies).subscribe((response: any) => {
      console.log(response.rates);

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
