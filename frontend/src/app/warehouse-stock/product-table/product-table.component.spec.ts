import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ProductTableComponent } from './product-table.component';
import { ProductTableService } from './product-table.service';
import { DialogService } from '../dialogs/shared/dialog.service';
import { ProductTableItem } from './product-table-datasource';
import { of } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';

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
      'saveProduct',
      'removeProduct',
      'addProduct',
    ]);
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
      ],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductTableComponent);
    component = fixture.componentInstance;
    component.dataSource.setData([mockProduct]);
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize forms on ngOnInit', () => {
    component.ngOnInit();

    expect(productTableServiceSpy.initializeForms).toHaveBeenCalledWith(
      component.dataSource.data
    );
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
    beforeEach(() => {
      spyOn(component.table, 'renderRows');
    });

    it('should save valid product and call renderRows', () => {
      productTableServiceSpy.saveProduct.and.returnValue(true);

      component.save(mockProduct);

      expect(component.table.renderRows).toHaveBeenCalled();
      expect(component.editingRowId).toBeNull();
    });

    it('should not save rerender table if product was not saved', () => {
      productTableServiceSpy.saveProduct.and.returnValue(false);

      component.save(mockProduct);

      expect(component.table.renderRows).not.toHaveBeenCalled();
    });
  });

  describe('addProduct()', () => {
    beforeEach(() => {
      spyOn(component.table, 'renderRows');
    });

    it('should call dialog and add new product', () => {
      dialogServiceSpy.openAddProduct.and.returnValue(of(mockProduct2));
      productTableServiceSpy.addProduct.and.returnValue();

      component.addProduct();

      expect(productTableServiceSpy.addProduct).toHaveBeenCalledWith(
        component.dataSource,
        mockProduct2
      );
      expect(component.table.renderRows).toHaveBeenCalled();
    });

    it('should not add product if dialog returns undefined', () => {
      dialogServiceSpy.openAddProduct.and.returnValue(of(undefined));

      component.addProduct();

      expect(productTableServiceSpy.addProduct).not.toHaveBeenCalled();
      expect(component.table.renderRows).not.toHaveBeenCalled();
    });
  });

  describe('removeProduct()', () => {
    beforeEach(() => {
      spyOn(component.table, 'renderRows');
    });

    it('should call dialog and remove product if confirmed', () => {
      dialogServiceSpy.confirm.and.returnValue(of(true));
      productTableServiceSpy.removeProduct.and.returnValue(true);

      component.removeProduct(mockProduct);

      expect(productTableServiceSpy.removeProduct).toHaveBeenCalledWith(
        component.dataSource,
        mockProduct.id
      );
      expect(component.table.renderRows).toHaveBeenCalled();
    });

    it('should not remove product if dialog is cancelled', () => {
      dialogServiceSpy.confirm.and.returnValue(of(false));
      productTableServiceSpy.removeProduct.and.returnValue(false);

      component.removeProduct(mockProduct);

      expect(productTableServiceSpy.removeProduct).not.toHaveBeenCalled();
      expect(component.table.renderRows).not.toHaveBeenCalled();
    });

    it('should not rerender rows if product was not deleted', () => {
      dialogServiceSpy.confirm.and.returnValue(of(true));
      productTableServiceSpy.removeProduct.and.returnValue(false);

      component.removeProduct(mockProduct);

      expect(productTableServiceSpy.removeProduct).toHaveBeenCalledWith(
        component.dataSource,
        mockProduct.id
      );
      expect(component.table.renderRows).not.toHaveBeenCalled();
    });
  });

  it('should bind data source, sort and paginator to table on AfterViewInit', () => {
    component.ngAfterViewInit();

    expect(component.table.dataSource).toBe(component.dataSource);
  });

  it('should have aria-labels on icon buttons', () => {
    fixture.detectChanges();
    const editBtn = fixture.nativeElement.querySelector(
      'button[aria-label="Edit product"]'
    );
    const deleteBtn = fixture.nativeElement.querySelector(
      'button[aria-label="Delete product"]'
    );

    expect(editBtn).toBeTruthy();
    expect(deleteBtn).toBeTruthy();
  });
});
