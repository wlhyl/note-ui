import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ApiService } from '../../services/api/api.service';
import { Alert } from '../../types/alert';
import { AlertName as AlterEnum } from '../../enum/alert';
import { ArticlePreview } from '../../types/article';
import { AlertComponent } from '../../common/alert/alert.component';
import { ArticlePageComponent } from '../article-page/article-page.component';

@Component({
    selector: 'app-category-articles',
    templateUrl: './category-articles.component.html',
    styleUrls: ['./category-articles.component.scss'],
    standalone: true,
    imports:[AlertComponent,ArticlePageComponent]
})
export class CategoryArticlesComponent implements OnInit {
  public page = 0;
  private size = 10;
  public categoryName = '';
  public articles: Array<ArticlePreview> = [];
  public total = 0;

  message: Array<Alert> = [];

  constructor(private api: ApiService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      // 重新设置this.page
      this.page = 0;

      const categoryName = params.get('name');
      if (categoryName === null || categoryName === '') {
        this.message.push({
          type: AlterEnum.DANGER,
          message: `没有此文章分类: ${categoryName}`,
        });
        return;
      }
      // 加上此行，避免getArticles先执行完成，getCategory执行完成前，点击换页，使用旧的category id
      this.categoryName = categoryName;
      // this.getCategory(categoryId);
      this.getArticles(this.categoryName, this.page, this.size);
    });
  }

  private getArticles(name: string, page: number, size: number) {
    this.api.category.getArticlesByCategoryName(name, page, size).subscribe({
      next: (respone) => {
        this.articles = respone.data;
        this.total = respone.total_pages;
      },
      error: (error) => {
        this.message.push({
          type: AlterEnum.DANGER,
          message: `文章分类:${this.categoryName}的文章加载失败！`,
        });
      },
    });
  }

  // private getCategory(id: number) {
  //   this.api.getCategoryById(id).subscribe({
  //     next: (respone) => {
  //       this.category = respone;
  //     },
  //     error: (error) => {
  //       this.toastService.error(`文章分类id: ${id}, 文章分类加载失败！`);
  //     },
  //   });
  // }

  pageChange(page: number) {
    this.page = page;
    this.getArticles(this.categoryName, page, this.size);
  }
}
