import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPerfumeFormComponent } from './admin-perfume-form.component';

describe('AdminPerfumeFormComponent', () => {
  let component: AdminPerfumeFormComponent;
  let fixture: ComponentFixture<AdminPerfumeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPerfumeFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPerfumeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
