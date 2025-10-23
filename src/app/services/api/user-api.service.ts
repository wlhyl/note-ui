import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationInfoService } from '../authentication/authentication-info.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { PatchUser, User } from 'src/app/types/user';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private readonly url = `${environment.base_url}/api`;
  private readonly http_options = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(
    private http: HttpClient,
    private user: AuthenticationInfoService
  ) {}

  public login(
    account: string,
    password: string
  ): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(
      `${this.url}/login`,
      { account, password },
      this.http_options
    );
  }

  public logout(): Observable<string> {
    return this.http.get<string>(`${this.url}/logout`, {
      headers: { token: this.user.token },
    });
  }

  /**
   * 获取已经登录的用户信息
   * @returns
   */
  public userInfo(): Observable<User> {
    // let token = this.user.token ? this.user.token : '';
    // let token = this.user.token;
    // if (token === '') this.router.navigateByUrl('/login');

    return this.http.get<User>(`${this.url}/user/info`, {
      headers: { token: this.user.token },
    });
  }

  // 更新新user
  public updateUser(id: number, user: PatchUser): Observable<User> {
    return this.http.put<User>(`${this.url}/user/${id}`, user, {
      headers: { token: this.user.token },
    });
  }
}
