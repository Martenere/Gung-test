import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryDropdownFilterComponent } from './category-dropdown-filter.component';

describe('CategoryDropdownFilterComponent', () => {
  let component: CategoryDropdownFilterComponent;
  let fixture: ComponentFixture<CategoryDropdownFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategoryDropdownFilterComponent]
    });
    fixture = TestBed.createComponent(CategoryDropdownFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
