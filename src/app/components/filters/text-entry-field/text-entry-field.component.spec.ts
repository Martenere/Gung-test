import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextEntryFieldComponent } from './text-entry-field.component';

describe('TextEntryFieldComponent', () => {
  let component: TextEntryFieldComponent;
  let fixture: ComponentFixture<TextEntryFieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TextEntryFieldComponent]
    });
    fixture = TestBed.createComponent(TextEntryFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
