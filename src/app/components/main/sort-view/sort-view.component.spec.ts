import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortViewComponent } from './sort-view.component';

describe('SortViewComponent', () => {
  let component: SortViewComponent;
  let fixture: ComponentFixture<SortViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SortViewComponent]
    });
    fixture = TestBed.createComponent(SortViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
