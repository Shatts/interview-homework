import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ProductTableDataSource, ProductTableItem } from './product-table-datasource';
import { MatButtonModule } from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrl: './product-table.component.scss',
  standalone: true,
  imports: [
    MatButtonModule, 
    MatTableModule,
    MatPaginatorModule,
    MatSortModule, MatToolbarModule, CommonModule],
})
export class ProductTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<ProductTableItem>;
  dataSource = new ProductTableDataSource();

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name', 'imageUrl', 'description', 'quantity', 'unitPrice', 'addToShipment', 'actions'];
  editingRowId: number | null = null;
  editedRow: ProductTableItem | null = null;

startEdit(row: ProductTableItem) {
  this.editingRowId = row.id;
  this.editedRow = { ...row }; // clone to avoid direct mutation
}

cancelEdit() {
  this.editingRowId = null;
  this.editedRow = null;
}

saveRow() {
  // Replace with real backend call or emit output
  // const index = this.dataSource.getPagedData().findIndex(p => p.id === this.editedRow?.id);
  // if (index !== -1 && this.editedRow) {
  //   this.dataSource[index] = { ...this.editedRow };
  // }
  this.cancelEdit();
}

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  addToShipment(id: number) {
    console.log(id);
  }

  addData() {
    this.dataSource.data.push({id: 1, name: 'Hydrogen', imageUrl: 'assets/logo_black.svg', description: 'A gas', quantity: 100, unitPrice: 100});
  }
}
