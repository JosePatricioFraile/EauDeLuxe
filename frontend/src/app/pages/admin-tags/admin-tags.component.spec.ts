import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTagsComponent } from './admin-tags.component';

describe('AdminTagsComponent', () => {
  let component: AdminTagsComponent;
  let fixture: ComponentFixture<AdminTagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTagsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
