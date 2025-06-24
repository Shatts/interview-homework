import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ProductTableComponent } from './product-table.component';
import { ProductTableService } from './product-table.service';
import { DialogService } from '../dialogs/shared/dialog.service';
import { of, Subscription, throwError } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { ProductTableItem } from './product.model';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ProductTableComponent', () => {
  let component: ProductTableComponent;
  let fixture: ComponentFixture<ProductTableComponent>;
  let productTableServiceSpy: jasmine.SpyObj<ProductTableService>;
  let dialogServiceSpy: jasmine.SpyObj<DialogService>;
  const mockProduct: ProductTableItem = {
    id: 1,
    name: 'Test',
    imageUrl: '',
    description: '',
    quantity: 1,
    unitPrice: 10,
  };
  const mockProduct2: ProductTableItem = {
    id: 2,
    name: 'New',
    imageUrl: '',
    description: '',
    quantity: 2,
    unitPrice: 20,
  };

  beforeEach(waitForAsync(() => {
    productTableServiceSpy = jasmine.createSpyObj('ProductTableService', [
      'initializeForms',
      'getControl',
      'getForm',
      'setForm',
      'createProductForm',
      'deleteForm',
      'getFormControl',
      'updateProductPartial',
      'removeProduct',
      'addProduct',
      'getProducts',
    ]);
    productTableServiceSpy.getProducts.and.returnValue(of([]));
    dialogServiceSpy = jasmine.createSpyObj('DialogService', [
      'openAddProduct',
      'confirm',
    ]);

    TestBed.configureTestingModule({
      imports: [
        ProductTableComponent,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
      ],
      providers: [
        { provide: ProductTableService, useValue: productTableServiceSpy },
        { provide: DialogService, useValue: dialogServiceSpy },
        provideHttpClientTesting(),
      ],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductTableComponent);
    component = fixture.componentInstance;
  });

  it('should compile', () => {
    productTableServiceSpy.getProducts.and.returnValue(of([]));

    expect(component).toBeTruthy();
  });

  it('should track by id correctly', () => {
    expect(component.trackById(0, mockProduct)).toBe(1);
  });

  it('should start edit mode correctly', () => {
    component.startEdit(5);

    expect(component.editingRowId).toBe(5);
  });

  it('should cancel edit mode correctly', () => {
    component.editingRowId = 10;

    component.cancelEdit();

    expect(component.editingRowId).toBeNull();
  });

  it('should get form control', () => {
    const mockForm = new FormGroup({ name: new FormControl('test') });
    productTableServiceSpy.getControl.and.returnValue(
      mockForm.get('name') as FormControl
    );

    const control = component.getControl(1, 'name');

    expect(control.value).toBe('test');
  });

  describe('save()', () => {
    it('should call updateProductPartial and cancel edit on success', () => {
      const form = new FormGroup({
        name: new FormControl('test'),
        description: new FormControl('desc'),
        quantity: new FormControl(1),
        unitPrice: new FormControl(10),
        imageUrl: new FormControl(''),
        id: new FormControl(1),
      });
      form.markAsDirty();
      productTableServiceSpy.getForm.and.returnValue(form);
      productTableServiceSpy.updateProductPartial.and.returnValue(
        of(mockProduct)
      );
      spyOn(component, 'cancelEdit');

      component.save(mockProduct);

      expect(productTableServiceSpy.updateProductPartial).toHaveBeenCalled();
      expect(component.cancelEdit).toHaveBeenCalled();
    });

    it('should show snackbar and not call updateProductPartial if form is invalid', () => {
      const form = new FormGroup({
        name: new FormControl(''),
        description: new FormControl(''),
        quantity: new FormControl(0),
        unitPrice: new FormControl(0),
        imageUrl: new FormControl(''),
        id: new FormControl(1),
      });
      form.markAsDirty();
      form.setErrors({ fake: true });
      productTableServiceSpy.getForm.and.returnValue(form);
      const snackSpy = spyOn(component['snackBar'], 'open');

      component.save(mockProduct);

      expect(
        productTableServiceSpy.updateProductPartial
      ).not.toHaveBeenCalled();
      expect(snackSpy).toHaveBeenCalled();
    });
  });

  describe('addProduct()', () => {
    it('should call dialog and add new product', () => {
      dialogServiceSpy.openAddProduct.and.returnValue(of(mockProduct2));
      productTableServiceSpy.addProduct.and.returnValue(of(mockProduct2));
      const snackSpy = spyOn(component['snackBar'], 'open');

      component.addProduct();

      expect(productTableServiceSpy.addProduct).toHaveBeenCalledWith(
        mockProduct2
      );
      expect(snackSpy).toHaveBeenCalled();
    });

    it('should not add product if dialog returns undefined', () => {
      dialogServiceSpy.openAddProduct.and.returnValue(of(undefined));

      component.addProduct();

      expect(productTableServiceSpy.addProduct).not.toHaveBeenCalled();
    });
  });

  describe('removeProduct()', () => {
    it('should call dialog and remove product if confirmed', () => {
      dialogServiceSpy.confirm.and.returnValue(of(true));
      productTableServiceSpy.removeProduct.and.returnValue(of(true));
      spyOn(component.dataSource, 'optimisticDelete').and.returnValue();

      const snackSpy = spyOn(component['snackBar'], 'open');

      component.removeProduct(mockProduct);

      expect(productTableServiceSpy.removeProduct).toHaveBeenCalledWith(
        mockProduct.id
      );
      expect(snackSpy).not.toHaveBeenCalled();
    });

    it('should show snackbar when deletion fails', () => {
      dialogServiceSpy.confirm.and.returnValue(of(true));
      productTableServiceSpy.removeProduct.and.returnValue(of(false));
      spyOn(component.dataSource, 'optimisticDelete').and.returnValue();
      spyOn(component.dataSource.refresh$, 'next');

      const snackSpy = spyOn(component['snackBar'], 'open');

      component.removeProduct(mockProduct);

      expect(productTableServiceSpy.removeProduct).toHaveBeenCalledWith(
        mockProduct.id
      );
      expect(snackSpy).toHaveBeenCalledWith(
        'Failed to delete product.',
        'Close',
        {
          duration: 3000,
        }
      );
      expect(component.dataSource.refresh$.next).toHaveBeenCalled();
    });

    it('should show snackbar when deletion throws error', () => {
      dialogServiceSpy.confirm.and.returnValue(of(true));
      productTableServiceSpy.removeProduct.and.returnValue(
        throwError(() => new Error('Network error'))
      );
      spyOn(component.dataSource, 'optimisticDelete').and.returnValue();
      spyOn(component.dataSource.refresh$, 'next');

      const snackSpy = spyOn(component['snackBar'], 'open');

      component.removeProduct(mockProduct);

      expect(productTableServiceSpy.removeProduct).toHaveBeenCalledWith(
        mockProduct.id
      );
      expect(snackSpy).toHaveBeenCalledWith(
        'Error deleting product.',
        'Close',
        {
          duration: 3000,
        }
      );
      expect(component.dataSource.refresh$.next).toHaveBeenCalled();
    });

    it('should not remove product if dialog is cancelled', () => {
      dialogServiceSpy.confirm.and.returnValue(of(false));

      component.removeProduct(mockProduct);

      expect(productTableServiceSpy.removeProduct).not.toHaveBeenCalled();
    });
  });

  it('should bind data source, sort and paginator to table on AfterViewInit', () => {
    component.table = jasmine.createSpyObj('MatTable', ['dataSource']);
    component.paginator = jasmine.createSpyObj('MatPaginator', ['page']);
    component.sort = jasmine.createSpyObj('MatSort', ['sortChange']);
    spyOn(component.dataSource, 'connect').and.returnValue(of([]));
    spyOn(component.dataSource.total$, 'subscribe').and.returnValue(
      new Subscription()
    );
    spyOn(component.dataSource.loading$, 'subscribe').and.returnValue(
      new Subscription()
    );

    component.ngAfterViewInit();

    expect(component.table.dataSource).toBe(component.dataSource);
  });
});
