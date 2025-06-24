import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ProductTableDataSource } from './product-table-datasource';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { DialogService } from '../dialogs/shared/dialog.service';
import { ProductTableService } from './product-table.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductTableItem } from './product.model';

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrl: './product-table.component.scss',
  standalone: true,
  imports: [
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatToolbarModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
})
export class ProductTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<ProductTableItem>;
  readonly dataSource = new ProductTableDataSource();
  readonly displayedColumns = [
    'id',
    'name',
    'imageUrl',
    'description',
    'quantity',
    'unitPrice',
    'actions',
  ];
  editingRowId: number | null = null;
  loading = true;
  totalProducts = 0;
  private readonly dialogService = inject(DialogService);
  private readonly productTableService = inject(ProductTableService);
  private readonly snackBar = inject(MatSnackBar);

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.table.dataSource = this.dataSource;
    this.dataSource.total$.subscribe(total => (this.totalProducts = total));
    this.dataSource.loading$.subscribe(isLoading => {
      this.loading = isLoading;
    });
  }

  getControl(productId: number, name: keyof ProductTableItem): FormControl {
    return this.productTableService.getControl(productId, name);
  }

  trackById(_index: number, item: ProductTableItem): number {
    return item.id;
  }

  startEdit(productId: number): void {
    this.editingRowId = productId;
  }

  cancelEdit(): void {
    this.editingRowId = null;
  }

  save(product: ProductTableItem): void {
    const form = this.productTableService.getForm(product.id);
    if (!form || !form.dirty) {
      this.cancelEdit();
      return;
    }

    if (!form.valid) {
      this.snackBar.open('Please correct the form before saving.', 'Close', {
        duration: 3000,
      });
      return;
    }

    const update: Partial<ProductTableItem> = {};
    for (const key in form.controls) {
      const control = form.get(key);
      if (control?.dirty) {
        update[key as keyof ProductTableItem] = control.value;
      }
    }

    this.dataSource.optimisticUpdate(product.id, update);
    form.patchValue(update);

    this.productTableService
      .updateProductPartial(product.id, update)
      .subscribe({
        next: () => {
          this.snackBar.open('Product updated.', 'Close', { duration: 3000 });
          this.cancelEdit();
        },
        error: () => {
          this.snackBar.open('Failed to update product.', 'Close', {
            duration: 3000,
          });
          this.dataSource.refresh$.next();
        },
      });
  }

  addProduct(): void {
    this.dialogService.openAddProduct().subscribe(result => {
      if (result) {
        const tempId = Math.random() * -1000000;
        this.dataSource.optimisticAdd({ ...result, id: tempId });

        this.productTableService.addProduct(result).subscribe({
          next: newProduct => {
            this.snackBar.open('Product added.', 'Close', { duration: 3000 });
            this.dataSource.optimisticDelete(tempId);
            this.dataSource.optimisticAdd(newProduct);
          },
          error: () => {
            this.snackBar.open('Failed to add product.', 'Close', {
              duration: 3000,
            });
            this.dataSource.optimisticDelete(tempId);
          },
        });
      }
    });
  }

  removeProduct(product: ProductTableItem): void {
    this.dialogService
      .confirm(
        'Product Deletion',
        'Are you sure you want to delete this product?'
      )
      .subscribe(confirmed => {
        if (!confirmed) return;

        this.dataSource.optimisticDelete(product.id);

        this.productTableService.removeProduct(product.id).subscribe({
          next: success => {
            if (!success) {
              this.snackBar.open('Failed to delete product.', 'Close', {
                duration: 3000,
              });
              this.dataSource.refresh$.next();
            }
          },
          error: () => {
            this.snackBar.open('Error deleting product.', 'Close', {
              duration: 3000,
            });
            this.dataSource.refresh$.next();
          },
        });
      });
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/logo_black.svg';
  }
}
