import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyApiService } from '../../api/currency-api.service';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent {

  constructor(private router: Router, private currencyApiService: CurrencyApiService) { }

  /**
  * For navigating to the Details page
  */
  redirectToDetails(from: string, to: string, amount: string) {
    const param = { from: from, to: to, amount: amount, rate: '', convertedCurrency: '' };
    this.currencyApiService.setCUrrencyValues.next(param);
    this.router.navigate(['/details'])
  }
}
