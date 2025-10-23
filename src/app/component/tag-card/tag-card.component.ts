import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { Alert } from 'src/app/types/alert';
import { AlertName as AlterEnum } from 'src/app/enum/alert';
import { PageResponser } from 'src/app/types/page';

@Component({
    selector: 'app-tag-card',
    templateUrl: './tag-card.component.html',
    styleUrls: ['./tag-card.component.scss'],
    standalone: false
})
export class TagCardComponent implements OnInit {
  public tags: PageResponser<Array<string>> = {
    data: [],
    total_pages: 0,
  };
  public page = 0;
  public size = 5;

  message: Array<Alert> = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.getTags();
  }

  getTags(): void {
    this.api.tag.getTagNames(this.page, this.size).subscribe({
      next: (respone) => {
        // if (respone.length > 5) this.tags = respone.slice(0, 5);
        // else
        this.tags.total_pages = respone.total_pages;
        this.tags.data.push(...respone.data);
      },
      error: (error) => {
        this.message.push({
          type: AlterEnum.DANGER,
          message: '加载文章标签失败！',
        });
      },
    });
  }

  next(): void {
    if (this.page + 1 >= this.tags.total_pages) return;
    this.page += 1;
    this.getTags();
  }
}
