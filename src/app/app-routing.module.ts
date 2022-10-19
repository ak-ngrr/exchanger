import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/currency/currency.module').then((m) => m.CurrencyModule),

  },
  {
    path: 'currency',
    loadChildren: () => import('./features/currency/currency.module').then((m) => m.CurrencyModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
