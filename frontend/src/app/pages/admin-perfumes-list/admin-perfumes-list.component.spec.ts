import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPerfumesListComponent } from './admin-perfumes-list.component';

describe('AdminPerfumesListComponent', () => {
  let component: AdminPerfumesListComponent;
  let fixture: ComponentFixture<AdminPerfumesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPerfumesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPerfumesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
