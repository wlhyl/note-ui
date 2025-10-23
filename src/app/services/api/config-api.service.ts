import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationInfoService } from '../authentication/authentication-info.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ConfigResponse } from 'src/app/types/config';

@Injectable({
  providedIn: 'root',
})
export class ConfigApiService {
  private readonly url = `${environment.base_url}/api`;
  private readonly http_options = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(
    private http: HttpClient,
    private user: AuthenticationInfoService
  ) {}

  /**
   *
   * @returns 获取配置信息
   */
  public getConfig(): Observable<ConfigResponse> {
    return this.http.get<ConfigResponse>(`${this.url}/config`);
  }

  /**
   *
   * @returns 更新配置信息
   */

  // [indexer: string] : string 有任意数量的键
  // interface HashMap{
  //   [indexer: string] : string
  // }
  public updateConfig(config: { [indexer: string]: string }): Observable<void> {
    return this.http.put<void>(`${this.url}/config`, config, {
      headers: { token: this.user.token },
    });
  }
}
