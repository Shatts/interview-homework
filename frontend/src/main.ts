import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { ProductTableComponent } from './app/pages/product-table/product-table.component';

if (environment.production) {
  enableProdMode();
}

const routes = [
  { path: '', component: ProductTableComponent },
];

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)]
}).catch(err => console.error(err));
