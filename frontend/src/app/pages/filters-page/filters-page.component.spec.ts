import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersPageComponent } from './filters-page.component';

describe('FiltersPageComponent', () => {
  let component: FiltersPageComponent;
  let fixture: ComponentFixture<FiltersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltersPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
