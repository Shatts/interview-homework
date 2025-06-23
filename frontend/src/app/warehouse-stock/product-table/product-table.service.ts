import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  ProductTableDataSource,
  ProductTableItem,
} from './product-table-datasource';

@Injectable({ providedIn: 'root' })
export class ProductTableService {
  private productsMap = new Map<number, FormGroup>();

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

  getControl(productId: number, name: keyof ProductTableItem): FormControl {
    const form = this.productsMap.get(productId);
    if (!form) throw new Error(`Form not found for id: ${productId}`);
    return this.getFormControl(form, name);
  }

  removeProduct(
    dataSource: ProductTableDataSource,
    productId: number
  ): boolean {
    const index = dataSource.data.findIndex(p => p.id === productId);
    if (index > -1) {
      const newData = [...dataSource.data];
      newData.splice(index, 1);
      dataSource.setData(newData);
      this.productsMap.delete(productId);
      return true;
    }
    return false;
  }

  generateNextId(data: ProductTableItem[]): number {
    return data.length ? Math.max(...data.map(p => p.id)) + 1 : 1;
  }

  addProduct(
    dataSource: ProductTableDataSource,
    newProductData: Partial<ProductTableItem>
  ): void {
    const newProduct: ProductTableItem = {
      ...newProductData,
      id: this.generateNextId(dataSource.data),
      imageUrl: 'assets/logo_black.svg',
    } as ProductTableItem;

    const updatedData = [...dataSource.data, newProduct];
    dataSource.setData(updatedData);
    this.productsMap.set(newProduct.id, this.createProductForm(newProduct));
  }

  saveProduct(
    dataSource: ProductTableDataSource,
    product: ProductTableItem
  ): boolean {
    const form = this.productsMap.get(product.id);
    if (!form || !form.valid) return false;

    const updatedProduct: ProductTableItem = {
      ...product,
      ...form.getRawValue(),
    };

    const index = dataSource.data.findIndex(p => p.id === product.id);
    if (index === -1) return false;

    const updatedData = [...dataSource.data];
    updatedData[index] = updatedProduct;

    dataSource.setData(updatedData);
    this.productsMap.get(product.id)?.patchValue(updatedProduct);

    return true;
  }
}
