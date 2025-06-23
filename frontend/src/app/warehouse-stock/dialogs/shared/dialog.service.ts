import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AddProductDialogComponent } from '../add-product-dialog/add-product-dialog.component';
import { ProductTableItem } from '../../product-table/product-table-datasource';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Injectable({ providedIn: 'root' })
export class DialogService {
  dialog = inject(MatDialog);

  openAddProduct(): Observable<ProductTableItem | undefined> {
    return this.dialog.open(AddProductDialogComponent).afterClosed();
  }

  confirm(title?: string, message?: string): Observable<boolean> {
    return this.dialog
      .open(ConfirmDialogComponent, {
        data: { title, message },
      })
      .afterClosed();
  }
}
