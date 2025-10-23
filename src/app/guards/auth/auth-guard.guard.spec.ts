import { TestBed } from '@angular/core/testing';

import { AuthGuardGuard } from './auth-guard.guard';

describe('UserInfoGuardGuard', () => {
  let guard: AuthGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
