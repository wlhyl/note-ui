import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DocType } from '../../enum/doc-type';
import { ApiService } from '../../services/api/api.service';
import { AuthenticationInfoService } from '../../services/authentication/authentication-info.service';
import { Article } from '../../types/article';
import { Alert } from '../../types/alert';
import { AlertName as AlterEnum } from '../../enum/alert';

import { AlertComponent } from '../../common/alert/alert.component';
import { RouterModule } from '@angular/router';

import { MarkdownModule } from 'ngx-markdown';

@Component({
    selector: 'app-article',
    templateUrl: './article.component.html',
    styleUrls: ['./article.component.scss'],
    standalone: true,
    imports: [AlertComponent, RouterModule, MarkdownModule],
})
export class ArticleComponent implements OnInit {
  public article: Article = {
    body: { id: 0, content: '', doc_type: DocType.Markdown },
    id: 0,
    weight: 0,
    title: '',
    comment_counts: 0,
    view_counts: 0,
    summary: '',
    author: { id: 0, account: '', avatar: null, nick: '' },
    tags: [],
    create_date: '',
    category: {
      id: 0,
      avatar: null,
      name: '',
      description: null,
    },
    private: true,
    last_update_date: null,
  };

  message: Array<Alert> = [];

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    public user: AuthenticationInfoService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      let id = params.get('id');
      let articleId = Number(id);
      if (isNaN(articleId)) {
        this.message.push({
          type: AlterEnum.DANGER,
          message: `没有此文章id: ${id}`,
        });
        return;
      }
      this.getArticle(articleId);
    });
  }

  private getArticle(id: number) {
    this.api.article.getAnyArticleById(id).subscribe({
      next: (respone) => {
        this.article = respone;
      },
      error: (error) => {
        this.message.push({
          type: AlterEnum.DANGER,
          message: `文章id: ${id}, 文章加载失败！`,
        });
      },
    });
  }

  reloadArticle(id: number) {
    this.article.id = 0;
    this.getArticle(id);
  }
}
