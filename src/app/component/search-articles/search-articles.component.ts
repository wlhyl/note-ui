import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ApiService } from '../../services/api/api.service';
import { ArticlePreview } from '../../types/article';
import { PageResponser } from '../../types/page';
import { Alert } from '../../types/alert';
import { AlertName as AlterEnum } from '../../enum/alert';
import { AlertComponent } from '../../common/alert/alert.component';
import { ArticlePageComponent } from '../article-page/article-page.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-articles',
  templateUrl: './search-articles.component.html',
  styleUrls: ['./search-articles.component.scss'],
  standalone: true,
  imports: [AlertComponent, ArticlePageComponent, CommonModule],
})
export class SearchArticlesComponent implements OnInit {
  public loading = false;
  public page = 0;
  public size = 10;
  public keyword = '';
  public articleSummaries: PageResponser<Array<ArticlePreview>> = {
    data: [],
    total_pages: 0,
  };
  message: Array<Alert> = [];

  constructor(
    private api: ApiService,
    private titleService: Title,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      this.keyword = params['keyword'] || '';
      this.page = 0;
      if (this.keyword) {
        this.titleService.setTitle(`搜索: ${this.keyword}`);
        this.searchArticles();
      } else {
        this.router.navigate(['/blog/articles']);
      }
    });
  }

  pageChange(page: number) {
    this.page = page;
    this.searchArticles();
  }

  searchArticles() {
    if (!this.keyword.trim()) {
      this.message.push({
        type: AlterEnum.WARNING,
        message: '请输入搜索关键词！',
      });
      return;
    }

    this.loading = true;
    this.api.article.searchArticles(this.page, this.size, this.keyword).subscribe({
      next: (respone) => {
        this.articleSummaries = respone;
      },
      error: (error) => {
        this.message.push({
          type: AlterEnum.DANGER,
          message: '搜索文章失败！',
        });
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
