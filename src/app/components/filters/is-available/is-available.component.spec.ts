import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsAvailableComponent } from './is-available.component';

describe('IsAvailableComponent', () => {
  let component: IsAvailableComponent;
  let fixture: ComponentFixture<IsAvailableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IsAvailableComponent]
    });
    fixture = TestBed.createComponent(IsAvailableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
