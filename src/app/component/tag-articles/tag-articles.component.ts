import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ApiService } from '../../services/api/api.service';
import { ArticlePreview } from '../../types/article';
import { Alert } from '../../types/alert';
import { AlertName as AlterEnum } from '../../enum/alert';

import { AlertComponent } from '../../common/alert/alert.component'

import { ArticlePageComponent } from '../article-page/article-page.component';

@Component({
    selector: 'app-tag',
    templateUrl: './tag-articles.component.html',
    styleUrls: ['./tag-articles.component.scss'],
    standalone: true,
    imports: [AlertComponent,ArticlePageComponent]
})
export class TagArticlesComponent implements OnInit {
  public page = 0;
  public size = 10;
  public tagName = '';
  public articles: Array<ArticlePreview> = [];
  public total = 0;

  message: Array<Alert> = [];

  constructor(private api: ApiService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // let id = this.route.snapshot.paramMap.get('id')
    this.route.paramMap.subscribe((params: ParamMap) => {
      // 重新设置this.page，因为点击tag加载文章后，再点击别的tag，此组件不会重新构造
      // 因此constructor,ngOnInit都不会再执行
      // 因此this.page仍是上一次的值
      // 在此subscribe中重新设置this.page
      this.page = 0;

      const tagName = params.get('name');
      if (tagName === null || tagName === '') {
        this.message.push({
          type: AlterEnum.DANGER,
          message: `没有此标签: ${tagName}`,
        });
        return;
      }
      this.tagName = tagName;

      this.getArticles(this.tagName, this.page, this.size);
    });
  }

  private getArticles(tagName: string, page: number, size: number) {
    this.api.tag.getArticlesByTagName(tagName, page, size).subscribe({
      next: (respone) => {
        this.articles = respone.data;
        this.total = respone.total_pages;
      },
      error: (error) => {
        this.message.push({
          type: AlterEnum.DANGER,
          message: `tag :${tagName}的文章加载失败！`,
        });
      },
    });
  }

  // private getTag(id: number) {
  //   this.api.getTagById(id).subscribe({
  //     next: (respone) => {
  //       this.tag = respone;
  //     },
  //     error: (error) => {
  //       this.toastService.error(`tag id: ${id}, 文章标签加载失败！`);
  //     },
  //   });
  // }

  pageChange(page: number) {
    this.page = page;
    this.getArticles(this.tagName, page, this.size);
  }
}
