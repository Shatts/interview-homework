import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

if (environment.production) {
  enableProdMode();
}

const routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        './app/warehouse-stock/product-table/product-table.component'
      ).then(m => m.ProductTableComponent),
  },
];

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)],
}).catch(err => console.error(err));
