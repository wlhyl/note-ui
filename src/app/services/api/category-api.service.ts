import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthenticationInfoService } from '../authentication/authentication-info.service';
// import { environment } from 'src/environments/environment';
import { ENV_CONFIG } from '../../tokens/app-config.token';
import { Observable } from 'rxjs';
import { PageResponser } from '../../types/page';
import { ArticlePreview } from '../../types/article';
import { Category, PatchCategory } from '../../types/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryApiService {
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
   * 获取category的name
   * @param page 页数
   * @param size 页大小
   * @returns
   */
  public getCategoryNames(
    page: number,
    size: number
  ): Observable<PageResponser<Array<string>>> {
    return this.http.get<PageResponser<Array<string>>>(
      `${this.url}/categories/names?page=${page}&size=${size}`
    );
  }

  /**
   * 获取给定category name下的所有文章
   * @param name category nam
   * @param page
   * @param size
   * @returns 文章列表
   */
  public getArticlesByCategoryName(
    name: string,
    page: number,
    size: number
  ): Observable<PageResponser<Array<ArticlePreview>>> {
    if (this.user.isAuthenticated) {
      return this.http.get<PageResponser<Array<ArticlePreview>>>(
        `${this.url}/categories/names/${name}/articles?page=${page}&size=${size}`,
        { headers: { token: this.user.token } }
      );
    } else {
      return this.http.get<PageResponser<Array<ArticlePreview>>>(
        `${this.url}/categories/names/${name}/articles?page=${page}&size=${size}`
      );
    }
  }

  // public getCategoryById(id: number): Observable<Category> {
  //   return this.http.get<Category>(`${this.url}/categories/${id}`);
  // }

  /**
   * 获取给定category id下的所有文章
   * @param id category id
   * @returns 文章列表
   */
  public getArticlesByCategoryId(
    id: number
  ): Observable<Array<ArticlePreview>> {
    return this.http.get<Array<ArticlePreview>>(
      `${this.url}/categories/${id}/articles`,
      { headers: { token: this.user.token } }
    );
  }

  /**
   * 获取给定category id下所有已经删除的文章
   * @param id category id
   * @returns 文章列表
   */
  public getDeletedArticlesByCategoryId(
    id: number
  ): Observable<Array<ArticlePreview>> {
    return this.http.get<Array<ArticlePreview>>(
      `${this.url}/categories/${id}/articles/deleted`,
      { headers: { token: this.user.token } }
    );
  }

  /**
   * 获取已经登录用户的所有category
   * @returns
   */
  public getCategoriesByUser(): Observable<Array<Category>> {
    return this.http.get<Array<Category>>(`${this.url}/categories`, {
      headers: { token: this.user.token },
    });
  }

  // 新增category
  public addCategory(category: PatchCategory): Observable<Category> {
    return this.http.post<Category>(`${this.url}/categories`, category, {
      headers: { token: this.user.token },
    });
  }

  // 更新category
  public updateCategory(category: PatchCategory): Observable<Category> {
    return this.http.put<Category>(
      `${this.url}/categories/${category.id}`,
      category,
      {
        headers: { token: this.user.token },
      }
    );
  }

  // 删除category
  public deleteCategory(id: number): Observable<Category> {
    return this.http.delete<Category>(`${this.url}/categories/${id}`, {
      headers: { token: this.user.token },
    });
  }
}
