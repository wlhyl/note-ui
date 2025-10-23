import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { editGuard } from './edit.guard';

describe('editGuard', () => {
  const executeGuard: CanDeactivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => editGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
