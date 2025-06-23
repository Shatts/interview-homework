import { TestBed } from '@angular/core/testing';
import { DialogService } from './dialog.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { AddProductDialogComponent } from '../add-product-dialog/add-product-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ProductTableItem } from '../../product-table/product-table-datasource';

describe('DialogService', () => {
  let service: DialogService;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<MatDialog>>;

  beforeEach(() => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    TestBed.configureTestingModule({
      providers: [
        DialogService,
        { provide: MatDialog, useValue: matDialogSpy },
      ],
    });
    service = TestBed.inject(DialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('openAddProduct should open AddProductDialogComponent and return afterClosed observable', () => {
    const mockProduct: ProductTableItem = {
      id: 1,
      name: 'Test',
      imageUrl: '',
      description: 'desc',
      quantity: 1,
      unitPrice: 2,
    };
    dialogRefSpy.afterClosed.and.returnValue(of(mockProduct));
    matDialogSpy.open.and.returnValue(dialogRefSpy);

    let result: ProductTableItem | undefined;
    service.openAddProduct().subscribe(r => (result = r));

    expect(matDialogSpy.open).toHaveBeenCalledWith(AddProductDialogComponent);
    expect(result).toEqual(mockProduct);
  });

  it('confirm should open ConfirmDialogComponent with correct data and return afterClosed observable', () => {
    dialogRefSpy.afterClosed.and.returnValue(of(true));
    matDialogSpy.open.and.returnValue(dialogRefSpy);
    const title = 'My Title';
    const message = 'My Message';

    let result: boolean | undefined;
    service.confirm(title, message).subscribe(r => (result = r));

    expect(matDialogSpy.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
      data: { title, message },
    });
    expect(result).toBe(true);
  });
});
