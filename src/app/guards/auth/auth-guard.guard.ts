import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthenticationInfoService } from '../../services/authentication/authentication-info.service';

export const authGuard: CanMatchFn = () => {
  const user = inject(AuthenticationInfoService);
  const router = inject(Router);

  if (user.isAuthenticated) return true;
  else return router.parseUrl('/login');
};
