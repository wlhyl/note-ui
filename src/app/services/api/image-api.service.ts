import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationInfoService } from '../authentication/authentication-info.service';
import { environment } from 'src/environments/environment';
import { ImagesList } from 'src/app/types/image';

@Injectable({
  providedIn: 'root',
})
export class ImageApiService {
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
   * @param formData 上传的文件
   * @returns
   */
  public uploadImage(formData: FormData) {
    return this.http.post(
      `${this.url}/images`,
      formData,

      {
        headers: { token: this.user.token },
        reportProgress: true,
        observe: 'events',
      }
    );
  }

  /**
   * 分页获取图片
   * @param maxKeys 分页大小
   * @param continuationToken 请求下一页的token
   * @returns
   */
  public getImages(
    maxKeys: number | null,
    continuationToken: string | null
  ): Observable<ImagesList> {
    let url = `${this.url}/images`;
    if (maxKeys !== null && continuationToken !== null)
      url = `${url}?max_keys=${maxKeys}&continuation_token=${continuationToken}`;
    else if (maxKeys !== null) url = `${url}?max_keys=${maxKeys}`;
    else if (continuationToken !== null)
      url = `${url}?continuation_token=${continuationToken}`;
    else url = url;

    return this.http.get<ImagesList>(url, {
      headers: { token: this.user.token },
    });
  }

  public deleteImages(img: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.url}/images/${img}`, {
      headers: { token: this.user.token },
    });
  }
}
