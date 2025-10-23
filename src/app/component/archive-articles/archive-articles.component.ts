import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';
import { Alert } from 'src/app/types/alert';
import { AlertName as AlterEnum } from 'src/app/enum/alert';
import { ArticlePreview } from 'src/app/types/article';

@Component({
    selector: 'app-archive-articles',
    templateUrl: './archive-articles.component.html',
    styleUrls: ['./archive-articles.component.scss'],
    standalone: false
})
export class ArchiveArticlesComponent implements OnInit {
  public articles: Array<ArticlePreview> = [];
  public year = 0;
  public month = 0;

  message: Array<Alert> = [];

  constructor(
    private api: ApiService,

    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      let yearParam = params.get('year');
      let year = Number(yearParam);
      if (isNaN(year) || year < 1980) {
        this.message.push({
          type: AlterEnum.DANGER,
          message: `year: ${yearParam}，year不能小于1980 `,
        });
        return;
      }
      let monthParam = params.get('month');
      let month = Number(monthParam);
      if (isNaN(month) || month <= 0 || month > 12) {
        this.message.push({
          type: AlterEnum.DANGER,
          message: `month: ${monthParam}，month只能在1到12之间 `,
        });
        return;
      }

      this.year = year;
      this.month = month;
      this.getArticles(year, month);
    });
  }

  getArticles(year: number, month: number) {
    this.api.archive.getArticlesByYearAndMonth(year, month).subscribe({
      next: (respone) => {
        this.articles = respone;
      },
      error: (error) => {
        this.message.push({
          type: AlterEnum.DANGER,
          message: '加载文章归档失败！',
        });
      },
    });
  }
}
