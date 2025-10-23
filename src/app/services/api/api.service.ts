import { Injectable } from '@angular/core';

import { ConfigApiService } from './config-api.service';
import { ArticleApiService } from './article-api.service';
import { ArchiveApiService } from './archive-api.service';
import { TagApiService } from './tag-api.service';
import { CategoryApiService } from './category-api.service';
import { UserApiService } from './user-api.service';
import { ImageApiService } from './image-api.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    public readonly config: ConfigApiService,
    public readonly article: ArticleApiService,
    public readonly archive: ArchiveApiService,
    public readonly tag: TagApiService,
    public readonly category: CategoryApiService,
    public readonly user: UserApiService,
    public readonly image: ImageApiService
  ) {}
}
