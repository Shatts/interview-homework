import { TestBed } from '@angular/core/testing';
import { ProductTableDataSource } from './product-table-datasource';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ProductTableService } from './product-table.service';
import { ProductTableItem } from './product.model';
import { of, Subject } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ProductTableDataSource', () => {
  let dataSource: ProductTableDataSource;
  let productTableService: jasmine.SpyObj<ProductTableService>;
  let mockPaginator: jasmine.SpyObj<MatPaginator>;
  let mockSort: jasmine.SpyObj<MatSort>;

  const mockProducts: ProductTableItem[] = [
    {
      id: 1,
      name: 'Product A',
      description: 'Description A',
      quantity: 10,
      unitPrice: 100,
      imageUrl: 'image1.jpg',
    },
    {
      id: 2,
      name: 'Product B',
      description: 'Description B',
      quantity: 5,
      unitPrice: 200,
      imageUrl: 'image2.jpg',
    },
    {
      id: 3,
      name: 'Product C',
      description: 'Description C',
      quantity: 15,
      unitPrice: 50,
      imageUrl: 'image3.jpg',
    },
  ];

  beforeEach(() => {
    productTableService = jasmine.createSpyObj('ProductTableService', [
      'getProducts',
      'initializeForms',
    ]);

    const pageSubject = new Subject();
    mockPaginator = jasmine.createSpyObj('MatPaginator', [], {
      page: pageSubject,
      pageIndex: 0,
      pageSize: 10,
    });

    mockSort = jasmine.createSpyObj('MatSort', [], {
      sortChange: new Subject(),
      active: '',
      direction: '',
    });

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ProductTableService, useValue: productTableService },
      ],
    });

    dataSource = TestBed.runInInjectionContext(
      () => new ProductTableDataSource()
    );
  });

  afterEach(() => {
    dataSource.disconnect();
  });

  it('should create an instance', () => {
    expect(dataSource).toBeTruthy();
  });

  describe('connect()', () => {
    it('should return an observable of data', done => {
      productTableService.getProducts.and.returnValue(of(mockProducts));
      productTableService.initializeForms.and.stub();

      dataSource.paginator = mockPaginator;
      dataSource.sort = mockSort;

      const result$ = dataSource.connect();
      result$.subscribe(data => {
        expect(data).toEqual(mockProducts);
        expect(productTableService.getProducts).toHaveBeenCalled();
        expect(productTableService.initializeForms).toHaveBeenCalledWith(
          mockProducts
        );
        done();
      });
    });

    it('should handle errors gracefully', done => {
      productTableService.getProducts.and.returnValue(of([]));
      productTableService.initializeForms.and.stub();

      dataSource.paginator = mockPaginator;
      dataSource.sort = mockSort;

      const result$ = dataSource.connect();
      result$.subscribe(data => {
        expect(data).toEqual([]);
        done();
      });
    });
  });

  describe('disconnect()', () => {
    it('should complete all subjects', () => {
      spyOn(dataSource.total$, 'complete');
      spyOn(dataSource.refresh$, 'complete');
      spyOn(dataSource.loading$, 'complete');

      dataSource.disconnect();

      expect(dataSource.total$.complete).toHaveBeenCalled();
      expect(dataSource.refresh$.complete).toHaveBeenCalled();
      expect(dataSource.loading$.complete).toHaveBeenCalled();
    });
  });

  describe('optimisticUpdate()', () => {
    beforeEach(() => {
      dataSource['localData'] = [...mockProducts];
      dataSource['dataSubject'].next(mockProducts);
    });

    it('should update an item optimistically', () => {
      const update = { name: 'Updated Product A', quantity: 20 };

      dataSource.optimisticUpdate(1, update);

      const updatedData = dataSource['localData'];
      const updatedItem = updatedData.find(item => item.id === 1);

      expect(updatedItem?.name).toBe('Updated Product A');
      expect(updatedItem?.quantity).toBe(20);
      expect(updatedItem?.unitPrice).toBe(100); // unchanged
    });

    it('should not update items with different id', () => {
      const update = { name: 'Updated Product A' };

      dataSource.optimisticUpdate(1, update);

      const updatedData = dataSource['localData'];
      const unchangedItem = updatedData.find(item => item.id === 2);

      expect(unchangedItem?.name).toBe('Product B');
    });
  });

  describe('optimisticAdd()', () => {
    beforeEach(() => {
      dataSource['localData'] = [...mockProducts];
      dataSource['dataSubject'].next(mockProducts);
    });

    it('should add a new item to the beginning of the list', () => {
      const newItem: ProductTableItem = {
        id: 4,
        name: 'New Product',
        description: 'New Description',
        quantity: 25,
        unitPrice: 75,
        imageUrl: 'new-image.jpg',
      };

      dataSource.optimisticAdd(newItem);

      const updatedData = dataSource['localData'];
      expect(updatedData[0]).toEqual(newItem);
      expect(updatedData.length).toBe(4);
    });
  });

  describe('optimisticDelete()', () => {
    beforeEach(() => {
      dataSource['localData'] = [...mockProducts];
      dataSource['dataSubject'].next(mockProducts);
    });

    it('should remove an item by id', () => {
      dataSource.optimisticDelete(2);

      const updatedData = dataSource['localData'];
      expect(updatedData.length).toBe(2);
      expect(updatedData.find(item => item.id === 2)).toBeUndefined();
    });

    it('should not remove items with different id', () => {
      dataSource.optimisticDelete(999);

      const updatedData = dataSource['localData'];
      expect(updatedData.length).toBe(3);
    });
  });

  describe('sorting', () => {
    beforeEach(() => {
      dataSource['localData'] = [...mockProducts];
      dataSource['dataSubject'].next(mockProducts);
    });

    it('should apply sorting through connect observable', done => {
      productTableService.getProducts.and.returnValue(of(mockProducts));
      productTableService.initializeForms.and.stub();

      dataSource.paginator = mockPaginator;
      dataSource.sort = mockSort;
      mockSort.active = 'name';
      mockSort.direction = 'asc';

      const result$ = dataSource.connect();
      result$.subscribe(data => {
        expect(data[0].name).toBe('Product A');
        expect(data[1].name).toBe('Product B');
        expect(data[2].name).toBe('Product C');
        done();
      });
    });
  });

  describe('total$ observable', () => {
    it('should emit the correct total count through connect', done => {
      productTableService.getProducts.and.returnValue(of(mockProducts));
      productTableService.initializeForms.and.stub();

      dataSource.paginator = mockPaginator;
      dataSource.sort = mockSort;

      dataSource.total$.subscribe(total => {
        expect(total).toBe(3);
        done();
      });

      dataSource.connect().subscribe();
    });
  });

  describe('refresh$ observable', () => {
    it('should trigger data refresh when next is called', () => {
      productTableService.getProducts.and.returnValue(of(mockProducts));
      productTableService.initializeForms.and.stub();

      dataSource.paginator = mockPaginator;
      dataSource.sort = mockSort;

      dataSource.connect().subscribe();

      productTableService.getProducts.calls.reset();

      dataSource.refresh$.next();

      expect(productTableService.getProducts).toHaveBeenCalled();
    });
  });
});
