import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent {

  constructor(private router: Router) { }

  /**
* For navigating to the Details page
*/
  redirectToDetails(from: string, to: string, amount: number) {
    const param = { from: from, to: to, amount: amount };
    this.router.navigate(['/details', param])
  }
}
