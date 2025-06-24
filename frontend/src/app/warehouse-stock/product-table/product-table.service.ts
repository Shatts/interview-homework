import { inject, Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError, of } from 'rxjs';
import { ProductTableItem } from './product.model';
import { ApiConfig } from '../../core/config/api.config';

@Injectable({ providedIn: 'root' })
export class ProductTableService {
  private productsMap = new Map<number, FormGroup>();
  private http = inject(HttpClient);
  private apiConfig = inject(ApiConfig);

  createProductForm(product: ProductTableItem): FormGroup {
    return new FormGroup({
      id: new FormControl(product.id),
      name: new FormControl(product.name, [
        Validators.required,
        Validators.maxLength(50),
      ]),
      description: new FormControl(product.description, [
        Validators.required,
        Validators.maxLength(200),
      ]),
      quantity: new FormControl(product.quantity, [
        Validators.required,
        Validators.min(1),
      ]),
      unitPrice: new FormControl(product.unitPrice, [
        Validators.required,
        Validators.min(1),
      ]),
    });
  }

  initializeForms(data: ProductTableItem[]) {
    data.forEach(product => {
      if (!this.productsMap.has(product.id)) {
        this.productsMap.set(product.id, this.createProductForm(product));
      } else {
        this.productsMap.get(product.id)!.patchValue(product);
      }
    });
  }

  getForm(id: number): FormGroup | undefined {
    return this.productsMap.get(id);
  }

  setForm(id: number, form: FormGroup) {
    this.productsMap.set(id, form);
  }

  deleteForm(id: number) {
    this.productsMap.delete(id);
  }

  getFormControl<T = unknown>(
    form: FormGroup,
    controlName: string
  ): FormControl<T> {
    const control = form.get(controlName);
    if (!control || !(control instanceof FormControl)) {
      throw new Error(
        `Control "${controlName}" is missing or not a FormControl`
      );
    }
    return control;
  }

  getControl(productId: number, name: string): FormControl {
    const form = this.productsMap.get(productId);
    if (!form) throw new Error(`Form not found for id: ${productId}`);
    return this.getFormControl(form, name);
  }

  removeProduct(productId: number): Observable<boolean> {
    return this.http
      .delete(this.apiConfig.buildUrl(`products/${productId}`), {
        observe: 'response',
      })
      .pipe(
        map(response => response.status === 204),
        catchError(() => {
          return of(false);
        })
      );
  }

  getProducts(): Observable<ProductTableItem[]> {
    return this.http.get<ProductTableItem[]>(
      this.apiConfig.buildUrl('products')
    );
  }

  addProduct(product: Partial<ProductTableItem>): Observable<ProductTableItem> {
    return this.http.post<ProductTableItem>(
      this.apiConfig.buildUrl('products'),
      product
    );
  }

  updateProductPartial(
    productId: number,
    update: Partial<ProductTableItem>
  ): Observable<ProductTableItem> {
    return this.http.patch<ProductTableItem>(
      this.apiConfig.buildUrl(`products/${productId}`),
      update
    );
  }
}
