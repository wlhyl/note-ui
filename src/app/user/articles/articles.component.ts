import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api/api.service';
import { Alert } from '../../types/alert';
import { ArticlePreview } from '../../types/article';
import { AlertName as AlterEnum } from '../../enum/alert';
import { lastValueFrom } from 'rxjs';

@Component({
    selector: 'app-articles',
    templateUrl: './articles.component.html',
    styleUrls: ['./articles.component.scss'],
    standalone: false
})
export class ArticlesComponent implements OnInit {
  articles: Array<ArticlePreview> = [];
  deletedArticles: Array<ArticlePreview> = [];
  filtedArticles: Array<{ article: ArticlePreview; checked: boolean }> = [];
  // 当前显示的是被删除的文章？
  showDeleted = false;
  // 正在执行删除或恢复文章
  deletingOrRecovering = false;
  //正在获取数据
  reloading = false;
  message: Array<Alert> = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.getAllArticles();
  }

  get checkAllArticles(): boolean {
    if (this.filtedArticles.length === 0) return false;
    let checkedArticles = this.filtedArticles.filter((a) => a.checked === true);
    return checkedArticles.length === this.filtedArticles.length;
  }

  set checkAllArticles(e: boolean) {
    if (e) this.filtedArticles.forEach((a) => (a.checked = true));
    else this.filtedArticles.forEach((a) => (a.checked = false));
  }

  private async getAllArticles() {
    try {
      this.articles = await lastValueFrom(this.api.article.getArticles());
    } catch (error: any) {
      let msg = error.error.error;
      let message = '获取文章失败！';

      if (msg) message = msg;

      this.message.push({
        type: AlterEnum.DANGER,
        message,
      });
    }
    try {
      this.deletedArticles = await lastValueFrom(
        this.api.article.getDeletedArticles()
      );
    } catch (error: any) {
      let msg = error.error.error;
      let message = '获取回收站中的文章失败！';

      if (msg) message = msg;

      this.message.push({
        type: AlterEnum.DANGER,
        message,
      });
    }

    this.filtedArticles = this.showDeleted
      ? this.deletedArticles.map((a) => {
          return { article: a, checked: false };
        })
      : this.articles.map((a) => {
          return {
            article: a,
            checked: false,
          };
        });

    // 此处有重复操作，赋值会引起this.filtedArticles重复修改
    // this.checkAllArticles = false;
  }

  async reload() {
    this.reloading = true;
    await this.getAllArticles();
    this.reloading = false;
  }

  showArticles(deleted: boolean) {
    this.showDeleted = deleted;
    if (deleted)
      this.filtedArticles = this.deletedArticles.map((a) => {
        return { article: a, checked: false };
      });
    else
      this.filtedArticles = this.articles.map((a) => {
        return { article: a, checked: false };
      });
  }

  filteArticlesByPrivate(isPrivate: boolean) {
    this.filtedArticles = this.filtedArticles.filter(
      (it) => it.article.private === isPrivate
    );
  }

  filteArticlesByCategoryId(id: number) {
    this.filtedArticles = this.filtedArticles.filter(
      (it) => it.article.category.id === id
    );
  }

  filteArticlesByTagId(id: number) {
    this.filtedArticles = this.filtedArticles.filter((it) =>
      it.article.tags.map((t) => t.id).includes(id)
    );
  }

  deleteArticles() {
    let articles = this.filtedArticles
      .filter((it) => it.checked)
      .map((it) => it.article.id);

    if (articles.length === 0) return;

    this.deletingOrRecovering = true;

    let res;
    if (this.showDeleted) {
      res = this.api.article.hardDeleteArticle(articles);
    } else {
      res = this.api.article.softDeleteArticle(articles);
    }

    res
      .subscribe({
        next: (response) => this.reload(),
        error: (error) => {
          let msg = error.error.error;
          let message = '删除文章失败！';

          if (msg) message = msg;

          this.message.push({
            type: AlterEnum.DANGER,
            message,
          });
        },
      })
      .add(() => (this.deletingOrRecovering = false));
  }

  recoveryArticles() {
    let articles = this.filtedArticles
      .filter((it) => it.checked)
      .map((it) => it.article.id);

    if (articles.length === 0) return;

    this.deletingOrRecovering = true;

    this.api.article
      .recoveryArticle(articles)
      .subscribe({
        next: (response) => this.reload(),
        error: (error) => {
          let msg = error.error.error;
          let message = '恢复文章失败！';

          if (msg) message = msg;

          this.message.push({
            type: AlterEnum.DANGER,
            message,
          });
        },
      })
      .add(() => (this.deletingOrRecovering = false));
  }
}
