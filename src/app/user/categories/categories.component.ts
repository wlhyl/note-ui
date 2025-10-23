import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Alert } from '../../types/alert';
import { AlertName as AlterEnum } from '../../enum/alert';
import { ApiService } from '../../services/api/api.service';
import { Category, PatchCategory } from '../../types/category';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.scss'],
    standalone: false
})
export class CategoriesComponent implements OnInit {
  public categories: Array<{
    category: Category;
    total: number | string | null;
    deletedTotal: number | string | null;
  }> = [];

  // 新增category
  public category: PatchCategory = {
    id: 0,
    name: '',
    user: 0,
    description: null,
  };

  public message: Array<Alert> = [];

  public saving = false;
  public deleting = 0;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.getCategories();
  }

  private async getCategories() {
    this.message = [];

    try {
      let categories = await lastValueFrom(
        this.api.category.getCategoriesByUser()
      );
      this.categories = categories.map((c) => {
        return {
          category: c,
          total: null,
          deletedTotal: null,
        };
      });
    } catch (error: any) {
      let msg = error.error.error;
      let message = '获取文章分类失败！';

      if (msg) message = msg;

      this.message.push({
        type: AlterEnum.DANGER,
        message,
      });
    }

    for (const c of this.categories) {
      this.api.category.getArticlesByCategoryId(c.category.id).subscribe({
        next: (article) => (c.total = article.length),
        error: (error) => (c.total = '-'),
      });

      this.api.category
        .getDeletedArticlesByCategoryId(c.category.id)
        .subscribe({
          next: (article) => (c.deletedTotal = article.length),
          error: (error) => (c.deletedTotal = '-'),
        });
    }
  }

  edit(id: number) {
    let c = this.categories.find((c) => c.category.id === id);
    if (c) {
      this.category.id = c.category.id;
      this.category.name = c.category.name;
      this.category.description = c.category.description;
    }
  }
  cancel() {
    this.category.id = 0;
    this.category.name = '';
    this.category.user = 0;
    this.category.description = null;
  }

  save() {
    this.message = [];

    if (this.category.name === '') return;

    this.saving = true;

    if (this.category.description === '') this.category.description = null;

    if (this.category.id === 0) {
      this.api.category
        .addCategory(this.category)
        .subscribe({
          next: (response) => {
            this.getCategories();
          },
          error: (error) => {
            let msg = error.error.error;
            let message = '新增文章分类失败！';

            if (msg) message = msg;

            this.message.push({
              type: AlterEnum.DANGER,
              message,
            });
          },
        })
        .add(() => {
          this.category.id = 0;
          this.category.name = '';
          this.category.description = null;
          this.saving = false;
        });
    } else {
      this.api.category
        .updateCategory(this.category)
        .subscribe({
          next: (response) => {
            this.getCategories();
          },
          error: (error) => {
            let msg = error.error.error;
            let message = '更新文章分类失败！';

            if (msg) message = msg;

            this.message.push({
              type: AlterEnum.DANGER,
              message,
            });
          },
        })
        .add(() => {
          this.category.id = 0;
          this.category.name = '';
          this.category.description = null;
          this.saving = false;
        });
    }
  }

  delete(id: number) {
    this.message = [];
    this.deleting = id;
    this.api.category
      .deleteCategory(id)
      .subscribe({
        next: (response) => {
          this.getCategories();
        },
        error: (error) => {
          let msg = error.error.error;
          let message = '删除文章分类失败！';

          if (msg) message = msg;

          this.message.push({
            type: AlterEnum.DANGER,
            message,
          });
        },
      })
      .add(() => (this.deleting = 0));
  }
}
