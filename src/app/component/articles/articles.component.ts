import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ApiService } from 'src/app/services/api/api.service';
import { ArticlePreview } from 'src/app/types/article';
import { PageResponser } from 'src/app/types/page';
import { Alert } from 'src/app/types/alert';
import { AlertName as AlterEnum } from 'src/app/enum/alert';

@Component({
    selector: 'app-articles',
    templateUrl: './articles.component.html',
    styleUrls: ['./articles.component.scss'],
    standalone: false
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
