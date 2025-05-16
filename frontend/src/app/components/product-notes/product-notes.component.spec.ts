import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductNotesComponent } from './product-notes.component';

describe('ProductNotesComponent', () => {
  let component: ProductNotesComponent;
  let fixture: ComponentFixture<ProductNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductNotesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
