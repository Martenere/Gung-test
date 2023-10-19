import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RangeUpperLowerComponent } from './range-upper-lower.component';

describe('RangeUpperLowerComponent', () => {
  let component: RangeUpperLowerComponent;
  let fixture: ComponentFixture<RangeUpperLowerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RangeUpperLowerComponent]
    });
    fixture = TestBed.createComponent(RangeUpperLowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
