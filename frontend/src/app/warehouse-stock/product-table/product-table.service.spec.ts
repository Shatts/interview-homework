import { TestBed } from '@angular/core/testing';
import { ProductTableService } from './product-table.service';
import { FormGroup } from '@angular/forms';
import {
  ProductTableDataSource,
  ProductTableItem,
} from './product-table-datasource';

// class MockDataSource extends ProductTableDataSource {
//   private _data: ProductTableItem[] = [];
//   override get data() {
//     return this._data;
//   }
//   override setData(data: ProductTableItem[]) {
//     this._data = data;
//   }
// }

describe('ProductTableService', () => {
  let service: ProductTableService;
  let dataSource: ProductTableDataSource;
  let product: ProductTableItem;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductTableService);
    dataSource = new ProductTableDataSource();
    product = {
      id: 1,
      name: 'Test',
      imageUrl: 'img',
      description: 'desc',
      quantity: 2,
      unitPrice: 3,
    };
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

  it('should update datasource and productMap if new product was added', () => {
    dataSource.setData([]);

    service.addProduct(dataSource, {
      name: 'New',
      description: 'desc',
      quantity: 1,
      unitPrice: 1,
    });

    expect(dataSource.data.length).toBe(1);
    expect(service.getForm(1)).toBeTruthy();
  });

  describe('removeProduct()', () => {
    it('should return false if product not found', () => {
      dataSource.setData([]);
      expect(service.removeProduct(dataSource, 999)).toBeFalse();
    });

    it('should remove product from datasource and productMap', () => {
      dataSource.setData([product]);
      service.initializeForms([product]);

      const removed = service.removeProduct(dataSource, product.id);

      expect(removed).toBeTrue();
      expect(dataSource.data.length).toBe(0);
      expect(service.getForm(product.id)).toBeUndefined();
    });
  });

  describe('saveProduct()', () => {
    it('should update data and form when valid', () => {
      dataSource.setData([product]);
      service.initializeForms([product]);
      const form = service.getForm(product.id)!;
      form.patchValue({ name: 'Saved' });

      expect(service.saveProduct(dataSource, product)).toBeTrue();
      expect(dataSource.data[0].name).toBe('Saved');
      expect(form.get('name')?.value).toBe('Saved');
    });

    it('should return false if form invalid', () => {
      dataSource.setData([product]);
      service.initializeForms([product]);
      const form = service.getForm(product.id)!;
      form.get('name')?.setValue('');

      expect(service.saveProduct(dataSource, product)).toBeFalse();
    });

    it('should return false if product not found', () => {
      dataSource.setData([]);

      expect(service.saveProduct(dataSource, product)).toBeFalse();
    });
  });
});
