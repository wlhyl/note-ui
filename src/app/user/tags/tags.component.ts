import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { Alert } from 'src/app/types/alert';
import { AlertName as AlterEnum } from 'src/app/enum/alert';
import { PatchTag, Tag } from 'src/app/types/tag';

@Component({
    selector: 'app-tags',
    templateUrl: './tags.component.html',
    styleUrls: ['./tags.component.scss'],
    standalone: false
})
export class TagsComponent implements OnInit {
  public message: Array<Alert> = [];

  // 新增tag
  public tag: PatchTag = {
    id: 0,
    name: '',
    user: 0,
  };

  public tags: Array<{
    tag: Tag;
    total: number | string | null;
    deletedTotal: number | string | null;
  }> = [];

  public saving = false;
  public deleting = 0;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.getTags();
  }

  private async getTags() {
    this.message = [];

    try {
      let tags = await lastValueFrom(this.api.tag.getTagsByUser());
      this.tags = tags.map((c) => {
        return {
          tag: c,
          total: null,
          deletedTotal: null,
        };
      });
    } catch (error: any) {
      let msg = error.error.error;
      let message = '获取文章标签失败！';

      if (msg) message = msg;

      this.message.push({
        type: AlterEnum.DANGER,
        message,
      });

      // 应该在这里return
      return;
    }

    for (const c of this.tags) {
      this.api.tag.getArticlesByTagId(c.tag.id).subscribe({
        next: (article) => (c.total = article.length),
        error: (error) => (c.total = '-'),
      });

      this.api.tag.getDeletedArticlesByTagId(c.tag.id).subscribe({
        next: (article) => (c.deletedTotal = article.length),
        error: (error) => (c.deletedTotal = '-'),
      });
    }
  }

  edit(id: number) {
    let c = this.tags.find((c) => c.tag.id === id);
    if (c) {
      this.tag.id = c.tag.id;
      this.tag.name = c.tag.name;
    }
  }

  cancel() {
    this.tag.id = 0;
    this.tag.name = '';
    this.tag.user = 0;
  }

  save() {
    this.message = [];

    if (this.tag.name === '') return;

    this.saving = true;

    if (this.tag.id === 0) {
      this.api.tag
        .addTag(this.tag)
        .subscribe({
          next: (response) => {
            this.getTags();
          },
          error: (error) => {
            let msg = error.error.error;
            let message = '新增文章标签失败！';

            if (msg) message = msg;

            this.message.push({
              type: AlterEnum.DANGER,
              message,
            });
          },
        })
        .add(() => {
          this.tag.id = 0;
          this.tag.name = '';
          this.saving = false;
        });
    } else {
      this.api.tag
        .updateTag(this.tag)
        .subscribe({
          next: (response) => {
            this.getTags();
          },
          error: (error) => {
            let msg = error.error.error;
            let message = '更新文章标签失败！';

            if (msg) message = msg;

            this.message.push({
              type: AlterEnum.DANGER,
              message,
            });
          },
        })
        .add(() => {
          this.tag.id = 0;
          this.tag.name = '';
          this.saving = false;
        });
    }
  }

  delete(id: number) {
    this.message = [];
    this.deleting = id;
    this.api.tag
      .deleteTag(id)
      .subscribe({
        next: (response) => {
          this.getTags();
        },
        error: (error) => {
          let msg = error.error.error;
          let message = '删除文章标签失败！';
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
