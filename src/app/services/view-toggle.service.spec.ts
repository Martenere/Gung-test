import { TestBed } from '@angular/core/testing';

import { ViewToggleService } from './view-toggle.service';

describe('ViewToggleService', () => {
  let service: ViewToggleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewToggleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
