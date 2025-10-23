import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthenticationInfoService } from '../authentication/authentication-info.service';
// import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { PageResponser } from '../../types/page';
import { ArticlePreview } from '../../types/article';
import { PatchTag, Tag } from '../../types/tag';
import { ENV_CONFIG } from '../../tokens/app-config.token';

@Injectable({
  providedIn: 'root',
})
export class TagApiService {
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
   * 获取给定tag name下的所有文章
   * @param name 文章标签名
   * @param page 页数
   * @param size 页大小
   * @returns
   */
  public getArticlesByTagName(
    name: string,
    page: number,
    size: number
  ): Observable<PageResponser<Array<ArticlePreview>>> {
    if (this.user.isAuthenticated) {
      return this.http.get<PageResponser<Array<ArticlePreview>>>(
        `${this.url}/tags/names/${name}/articles?page=${page}&size=${size}`,
        { headers: { token: this.user.token } }
      );
    } else {
      return this.http.get<PageResponser<Array<ArticlePreview>>>(
        `${this.url}/tags/names/${name}/articles?page=${page}&size=${size}`
      );
    }
  }

  /**
   * 获取tag 的name
   * @param page 页数
   * @param size 页大小
   * @returns
   */
  public getTagNames(
    page: number,
    size: number
  ): Observable<PageResponser<Array<string>>> {
    return this.http.get<PageResponser<Array<string>>>(
      `${this.url}/tags/names?page=${page}&size=${size}`
    );
  }

  /**
   * 获取给id的tag
   * @param id tag id
   * @returns
   */
  public getTagById(id: number): Observable<Tag> {
    return this.http.get<Tag>(`${this.url}/tags/${id}`);
  }

  /**
   * 获取给定tag id下的所有文章
   * @param id tag id
   * @returns 文章列表
   */
  public getArticlesByTagId(id: number): Observable<Array<ArticlePreview>> {
    return this.http.get<Array<ArticlePreview>>(
      `${this.url}/tags/${id}/articles`,
      { headers: { token: this.user.token } }
    );
  }

  /**
   * 获取给定tag id下所有已经删除的文章
   * @param id tag id
   * @returns 文章列表
   */
  public getDeletedArticlesByTagId(
    id: number
  ): Observable<Array<ArticlePreview>> {
    return this.http.get<Array<ArticlePreview>>(
      `${this.url}/tags/${id}/articles/deleted`,
      { headers: { token: this.user.token } }
    );
  }

  /**
   * 获取已经登录用户的所有tag
   * @returns
   */
  public getTagsByUser(): Observable<Array<Tag>> {
    return this.http.get<Array<Tag>>(`${this.url}/tags`, {
      headers: { token: this.user.token },
    });
  }

  // 新增tag
  public addTag(tag: PatchTag): Observable<Tag> {
    return this.http.post<Tag>(`${this.url}/tags`, tag, {
      headers: { token: this.user.token },
    });
  }

  // 更新tag
  public updateTag(tag: PatchTag): Observable<Tag> {
    return this.http.put<Tag>(`${this.url}/tags/${tag.id}`, tag, {
      headers: { token: this.user.token },
    });
  }

  // 删除tag
  public deleteTag(id: number): Observable<Tag> {
    return this.http.delete<Tag>(`${this.url}/tags/${id}`, {
      headers: { token: this.user.token },
    });
  }
}
