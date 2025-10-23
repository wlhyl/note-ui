import { Injectable } from '@angular/core';
import { User } from '../../types/user';

// cookie
import { SsrCookieService } from 'ngx-cookie-service-ssr';


@Injectable({
  providedIn: 'root',
})
export class AuthenticationInfoService {
  public user: User = {
    id: 0,
    account: '',
    avatar: null,
    nick: '',
  };
  // public id = 0;
  // public account: string = '';
  // public nick: string = '';
  // public avatar: string | null = null;

  constructor(private cookieService: SsrCookieService) { }

  public get token(): string {
    return this.cookieService.check('token') ? this.cookieService.get('token') : "";
  }

  public set token(token: string) {
    //  if("") 等同于if(false)
    if (token !== '') this.cookieService.set('token', token, { expires: 1 });
    else this.cookieService.delete('token');
  }

  public get isAuthenticated(): boolean {
    return this.user.account !== '' && this.token !== '';
  }
}
