import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map, shareReplay, tap } from 'rxjs/operators';
import { Observable, merge, of, Subject, BehaviorSubject } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { ProductTableItem } from './product.model';
import { inject } from '@angular/core';
import { ProductTableService } from './product-table.service';

export class ProductTableDataSource extends DataSource<ProductTableItem> {
  paginator?: MatPaginator;
  sort?: MatSort;
  total$ = new Subject<number>();
  refresh$ = new BehaviorSubject<void>(undefined);
  loading$ = new BehaviorSubject<boolean>(false);
  private dataSubject = new BehaviorSubject<ProductTableItem[]>([]);
  private localData: ProductTableItem[] = [];
  private productTableService = inject(ProductTableService);

  connect(): Observable<ProductTableItem[]> {
    merge(
      this.paginator ? this.paginator.page : of({}),
      this.sort ? this.sort.sortChange : of({}),
      this.refresh$
    )
      .pipe(
        tap(() => this.loading$.next(true)),
        switchMap(() =>
          this.productTableService.getProducts().pipe(catchError(() => of([])))
        ),
        tap(data => {
          this.setData(data);
          // initialize forms here, once per fetch:
          this.productTableService.initializeForms(data);
          this.loading$.next(false);
        }),
        shareReplay({ bufferSize: 1, refCount: true })
      )
      .subscribe();

    return this.dataSubject
      .asObservable()
      .pipe(map(d => this.getPagedData(this.getSortedData([...d]))));
  }

  disconnect(): void {
    this.dataSubject.complete();
    this.total$.complete();
    this.refresh$.complete();
    this.loading$.complete();
  }

  private getPagedData(data: ProductTableItem[]): ProductTableItem[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.slice(startIndex, startIndex + this.paginator.pageSize);
    }
    return data;
  }

  private getSortedData(data: ProductTableItem[]): ProductTableItem[] {
    if (!this.sort?.active || this.sort.direction === '') return data;
    const isAsc = this.sort.direction === 'asc';
    return data.sort((a, b) => {
      switch (this.sort!.active) {
        case 'name':
          return compare(a.name, b.name, isAsc);
        case 'id':
          return compare(+a.id, +b.id, isAsc);
        case 'quantity':
          return compare(+a.quantity, +b.quantity, isAsc);
        case 'unitPrice':
          return compare(+a.unitPrice, +b.unitPrice, isAsc);
        case 'description':
          return compare(a.description, b.description, isAsc);
        default:
          return 0;
      }
    });
  }

  private setData(data: ProductTableItem[]) {
    this.localData = data;
    this.dataSubject.next(this.localData);
    this.total$.next(this.localData.length);
  }

  optimisticUpdate(id: number, update: Partial<ProductTableItem>) {
    this.localData = this.localData.map(item =>
      item.id === id ? { ...item, ...update } : item
    );
    this.setData(this.localData);
  }

  optimisticAdd(newItem: ProductTableItem) {
    this.localData = [newItem, ...this.localData];
    this.setData(this.localData);
  }

  optimisticDelete(id: number) {
    this.localData = this.localData.filter(item => item.id !== id);
    this.setData(this.localData);
  }
}

function compare(
  a: string | number,
  b: string | number,
  isAsc: boolean
): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
