import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ApiService } from '../../services/api/api.service';
import { ArticlePreview } from '../../types/article';
import { PageResponser } from '../../types/page';
import { Alert } from '../../types/alert';
import { AlertName as AlterEnum } from '../../enum/alert';

import { AlertComponent } from '../../common/alert/alert.component';

import { ArticlePageComponent } from '../article-page/article-page.component';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
  standalone: true,
  imports: [AlertComponent, ArticlePageComponent],
})
export class ArticlesComponent implements OnInit {
  private title = '所有文章';
  public loading = false;
  public page = 0;
  public size = 10;
  public articleSummaries: PageResponser<Array<ArticlePreview>> = {
    data: [],
    total_pages: 0,
  };

  message: Array<Alert> = [];

  constructor(private api: ApiService, private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle(this.title);
    this.getArticles();
  }

  pageChange(page: number) {
    this.page = page;
    this.getArticles();
  }

  getArticles() {
    this.loading = true;
    this.api.article.getAnyArticles(this.page, this.size).subscribe({
      next: (respone) => {
        this.articleSummaries = respone;
      },
      error: (error) => {
        this.message.push({
          type: AlterEnum.DANGER,
          message: '加载文章失败！',
        });
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
