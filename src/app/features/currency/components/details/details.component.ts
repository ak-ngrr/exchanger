import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { historicalDates, months } from 'src/app/contants';
import { CurrencyConversionresponse } from 'src/app/models/response.model';
import { CurrencyService } from 'src/app/services/currency.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  amount = new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+(\.?[0-9]+)?$/)]);
  from = new FormControl('');
  to = new FormControl('');
  rate = new FormControl('');
  convertedCurrency = new FormControl('');
  title = '';
  currencySymbols = ['']
  historicaldata: any[] = [];
  historicalMonths = months.map((m, i) => months[parseInt(historicalDates[i].split('-')[1]) - 1]);
  constructor(private route: ActivatedRoute, private router: Router, private currencySevice: CurrencyService,) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      console.log(params);
      this.from.setValue(params.get('from'));
      this.to.setValue(params.get('to'));
      this.amount.setValue(params.get('amount'));
      this.convertedCurrency.setValue(params.get('convertedCurrency'));
      this.rate.setValue(params.get('rate'));
      this.getCurrencySymbols();
      this.gethistoricalData();
    });
  }

  /**
* For getting list of all the currencies
*/
  getCurrencySymbols() {
    this.currencySevice.getCurrencySymbols().subscribe((response: any) => {
      if(response && response.symbols && typeof response.symbols == 'object') {
        this.currencySymbols = Object.keys(response.symbols)
        this.amount.setValue(this.amount.value);
        this.from.setValue(this.from.value);
        this.to.setValue(this.to.value);
        this.title = `${this.from.value} - ${response.symbols[this.from.value]}`
      }

    })


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
    this.currencySevice.getConversion(this.amount.value, this.from.value, this.to.value).subscribe((response: CurrencyConversionresponse) => {
      if (response && response.info && response.info.rate && response.result) {
        this.rate.setValue(`1.00 ${this.from.value} = ${response.info.rate} ${this.to.value}`);
        this.convertedCurrency.setValue(`${response.result} ${this.to.value}`);
        this.gethistoricalData();
      }

    })
  }

  /**
* For getting the historical data of the base currency
*/
  gethistoricalData() {
    this.currencySevice.requestDataForHistoricalDates(this.from.value, this.to.value, historicalDates).subscribe((response: any[]) => {
      if (response && response.length > 0) {
        this.historicaldata = response.map((x: any) => x.rates[this.to.value]);
      }
    })
  }
}
