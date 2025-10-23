import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthenticationInfoService } from '../authentication/authentication-info.service';
// import { environment } from 'src/environments/environment';
import { ENV_CONFIG } from '../../tokens/app-config.token';
import { Observable } from 'rxjs';
import { PageResponser } from '../../types/page';
import { Archive, ArticlePreview } from '../../types/article';

@Injectable({
  providedIn: 'root',
})
export class ArchiveApiService {
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
   * 每月文章数统计
   * @param page 页数
   * @param size 页大小
   * @returns
   */
  public getArchives(
    page: number,
    size: number
  ): Observable<PageResponser<Array<Archive>>> {
    return this.http.get<PageResponser<Array<Archive>>>(
      `${this.url}/archives?page=${page}&size=${size}`
    );
  }

  /**
   * 获取给定年、月的文章
   * @param year
   * @param month
   * @returns
   */
  public getArticlesByYearAndMonth(
    year: number,
    month: number
  ): Observable<Array<ArticlePreview>> {
    if (this.user.isAuthenticated) {
      return this.http.get<Array<ArticlePreview>>(
        `${this.url}/articles/${year}/${month}`,
        { headers: { token: this.user.token } }
      );
    } else {
      return this.http.get<Array<ArticlePreview>>(
        `${this.url}/articles/${year}/${month}`
      );
    }
  }
}
