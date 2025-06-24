import { TestBed } from '@angular/core/testing';
import { ProductTableService } from './product-table.service';
import { FormGroup } from '@angular/forms';
import { ProductTableItem } from './product.model';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('ProductTableService', () => {
  let service: ProductTableService;
  let httpMock: HttpTestingController;
  let product: ProductTableItem;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProductTableService);
    httpMock = TestBed.inject(HttpTestingController);
    product = {
      id: 1,
      name: 'Test',
      imageUrl: 'img',
      description: 'desc',
      quantity: 2,
      unitPrice: 3,
    };
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create a valid product form', () => {
    const form = service.createProductForm(product);

    expect(form instanceof FormGroup).toBeTrue();
    expect(form.valid).toBeTrue();
    expect(form.get('name')?.value).toBe('Test');
  });

  it('should initialize forms properly', () => {
    service.initializeForms([product]);

    const form = service.getForm(product.id);

    expect(form).toBeInstanceOf(FormGroup);
  });

  it('should set a form', () => {
    const form = service.createProductForm(product);

    service.setForm(product.id, form);

    expect(service.getForm(product.id)).toBe(form);
  });

  it('should get a form', () => {
    const form = service.createProductForm(product);
    service.setForm(product.id, form);

    const retrieved = service.getForm(product.id);

    expect(retrieved).toBe(form);
  });

  it('should delete a form', () => {
    const form = service.createProductForm(product);
    service.setForm(product.id, form);

    service.deleteForm(product.id);

    expect(service.getForm(product.id)).toBeUndefined();
  });

  it('should throw an error if form missing', () => {
    const form = service.createProductForm(product);

    expect(() => service.getFormControl(form, 'notAControl')).toThrow();
  });

  it('should throw if control missing', () => {
    expect(() => service.getControl(999, 'name')).toThrow();
  });

  it('should add a product via POST', () => {
    const newProduct = {
      name: 'New',
      description: 'desc',
      quantity: 1,
      unitPrice: 1,
    };
    const returnedProduct = { ...newProduct, id: 2, imageUrl: '' };
    service.addProduct(newProduct).subscribe(result => {
      expect(result).toEqual(returnedProduct);
    });
    const req = httpMock.expectOne('http://localhost:3000/products');
    expect(req.request.method).toBe('POST');
    req.flush(returnedProduct);
  });

  it('should get products via GET', () => {
    const products = [product];
    service.getProducts().subscribe(result => {
      expect(result).toEqual(products);
    });
    const req = httpMock.expectOne('http://localhost:3000/products');
    expect(req.request.method).toBe('GET');
    req.flush(products);
  });

  it('should update a product via PATCH', () => {
    const update = { name: 'Updated' };
    service.updateProductPartial(product.id, update).subscribe(result => {
      expect(result).toEqual({ ...product, ...update });
    });
    const req = httpMock.expectOne(
      `http://localhost:3000/products/${product.id}`
    );
    expect(req.request.method).toBe('PATCH');
    req.flush({ ...product, ...update });
  });

  it('should remove a product via DELETE', () => {
    service.removeProduct(product.id).subscribe(result => {
      expect(result).toBeTrue();
    });
    const req = httpMock.expectOne(
      `http://localhost:3000/products/${product.id}`
    );
    expect(req.request.method).toBe('DELETE');
    req.flush({}, { status: 204, statusText: 'No Content' });
  });

  it('should return false if removeProduct fails', () => {
    service.removeProduct(product.id).subscribe(result => {
      expect(result).toBeFalse();
    });
    const req = httpMock.expectOne(
      `http://localhost:3000/products/${product.id}`
    );
    expect(req.request.method).toBe('DELETE');
    req.flush({}, { status: 500, statusText: 'Server Error' });
  });
});
