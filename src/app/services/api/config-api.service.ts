import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthenticationInfoService } from '../authentication/authentication-info.service';
// import { environment } from 'src/environments/environment';
import { ENV_CONFIG } from '../../tokens/app-config.token';
import { Observable } from 'rxjs';
import { ConfigResponse } from '../../types/config';

@Injectable({
  providedIn: 'root',
})
export class ConfigApiService {
  private env = inject(ENV_CONFIG);
  private readonly url = `${this.env.baseUrl}/api`;
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
