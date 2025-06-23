import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {
  ProductTableDataSource,
  ProductTableItem,
} from './product-table-datasource';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { DialogService } from '../dialogs/shared/dialog.service';
import { ProductTableService } from './product-table.service';

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
  ],
})
export class ProductTableComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<ProductTableItem>;
  readonly dataSource = new ProductTableDataSource();
  protected readonly displayedColumns = [
    'id',
    'name',
    'imageUrl',
    'description',
    'quantity',
    'unitPrice',
    'actions',
  ];
  editingRowId: number | null = null;
  private readonly dialogService = inject(DialogService);
  private readonly productTableService = inject(ProductTableService);

  ngOnInit(): void {
    this.productTableService.initializeForms(this.dataSource.data);
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
    const saved = this.productTableService.saveProduct(
      this.dataSource,
      product
    );
    if (saved) {
      this.table.renderRows();
      this.cancelEdit();
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  addProduct(): void {
    this.dialogService.openAddProduct().subscribe(result => {
      if (result) {
        this.productTableService.addProduct(this.dataSource, result);
        this.table.renderRows(); // TODO: UPDATE THIS
      }
    });
  }

  removeProduct(product: ProductTableItem): void {
    this.dialogService.confirm().subscribe(confirmed => {
      if (confirmed) {
        const isDeleted = this.productTableService.removeProduct(
          this.dataSource,
          product.id
        );
        if (isDeleted) {
          this.table.renderRows();
        }
      }
    });
  }
}
