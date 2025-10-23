import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Article, ArticlePreview, PatchArticle } from '../../types/article';
import { PageResponser } from '../../types/page';
import { AuthenticationInfoService } from '../authentication/authentication-info.service';
import { ENV_CONFIG } from '../../tokens/app-config.token';
// import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ArticleApiService {
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
   * @param page 页数
   * @param size 每页大小
   * @returns
   */
  public getAnyArticles(
    page: number,
    size: number
  ): Observable<PageResponser<Array<ArticlePreview>>> {
    if (this.user.isAuthenticated) {
      return this.http.get<PageResponser<Array<ArticlePreview>>>(
        `${this.url}/any/articles?page=${page}&size=${size}`,
        { headers: { token: this.user.token } }
      );
    } else {
      return this.http.get<PageResponser<Array<ArticlePreview>>>(
        `${this.url}/any/articles?page=${page}&size=${size}`
      );
    }
  }

  /**
   * 获取文章，包含文章的内容
   * @param id 文章id
   * @returns
   */
  public getAnyArticleById(id: number): Observable<Article> {
    if (this.user.isAuthenticated) {
      return this.http.get<Article>(`${this.url}/any/articles/${id}`, {
        headers: { token: this.user.token },
      });
    } else {
      return this.http.get<Article>(`${this.url}/any/articles/${id}`);
    }
  }

  /**
   *
   * @returns 已经登录用户的所有文章
   */
  public getArticles(): Observable<Array<ArticlePreview>> {
    return this.http.get<Array<ArticlePreview>>(`${this.url}/articles`, {
      headers: { token: this.user.token },
    });
  }

  /**
   *
   * @returns 已经登录用户的所有删除文章
   */
  public getDeletedArticles(): Observable<Array<ArticlePreview>> {
    return this.http.get<Array<ArticlePreview>>(
      `${this.url}/articles/deleted`,
      {
        headers: { token: this.user.token },
      }
    );
  }

  // 新增article
  public addArticle(article: PatchArticle): Observable<Article> {
    return this.http.post<Article>(`${this.url}/articles`, article, {
      headers: { token: this.user.token },
    });
  }

  // 更新新article
  public updateArticle(article: PatchArticle): Observable<Article> {
    return this.http.put<Article>(
      `${this.url}/articles/${article.id}`,
      article,
      {
        headers: { token: this.user.token },
      }
    );
  }

  // 批量软删除article
  public softDeleteArticle(articles: Array<number>): Observable<any> {
    return this.http.delete<any>(`${this.url}/articles/soft/batch`, {
      headers: { token: this.user.token },
      body: articles,
    });
  }

  // 批量硬删除article
  public hardDeleteArticle(articles: Array<number>): Observable<any> {
    return this.http.delete<any>(`${this.url}/articles/hard/batch`, {
      headers: { token: this.user.token },
      body: articles,
    });
  }

  // 批量恢复article
  public recoveryArticle(articles: Array<number>): Observable<any> {
    return this.http.post<any>(
      `${this.url}/articles/recovery/batch`,
      articles,
      {
        headers: { token: this.user.token },
      }
    );
  }
}
