import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ConfirmDialogComponent>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {},
        },
      ],
    }).compileComponents();
  });

  function createComponent() {
    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should render default title and message', () => {
    createComponent();

    const title = fixture.nativeElement.querySelector('h2');
    const content = fixture.nativeElement.querySelector('mat-dialog-content');

    expect(title.textContent).toContain('Confirm');
    expect(content.textContent).toContain('Are you sure?');
  });

  it('should render custom title and message', () => {
    TestBed.overrideProvider(MAT_DIALOG_DATA, {
      useValue: { title: 'Delete', message: 'Really delete?' },
    });
    createComponent();
    const title = fixture.nativeElement.querySelector('h2');
    const content = fixture.nativeElement.querySelector('mat-dialog-content');

    expect(title.textContent).toContain('Delete');
    expect(content.textContent).toContain('Really delete?');
  });

  it('should close dialog with false when No is clicked', () => {
    createComponent();
    const noButton = fixture.debugElement.query(
      By.css('button[aria-label="Cancel"]')
    );

    noButton.nativeElement.click();

    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('should close dialog with true when Yes is clicked', () => {
    createComponent();
    const yesButton = fixture.debugElement.query(
      By.css('button[aria-label="Confirm"]')
    );

    yesButton.nativeElement.click();

    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });
});
