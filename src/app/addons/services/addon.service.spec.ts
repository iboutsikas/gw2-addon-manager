import { TestBed } from '@angular/core/testing';

import { AddonService } from './addon.service';

describe('AddonService', () => {
  let service: AddonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
