import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { Alert } from 'src/app/types/alert';
import { AlertName as AlterEnum } from 'src/app/enum/alert';
import { Archive } from 'src/app/types/article';

@Component({
    selector: 'app-archive-card',
    templateUrl: './archive-card.component.html',
    styleUrls: ['./archive-card.component.scss'],
    standalone: false
})
export class ArchiveCardComponent implements OnInit {
  public archives: Array<Archive> = [];
  public total = 0;

  public page = 0;
  private size = 5;

  message: Array<Alert> = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.getArchives();
  }

  getArchives() {
    this.api.archive.getArchives(this.page, this.size).subscribe({
      next: (respone) => {
        this.total = respone.total_pages;
        this.archives = respone.data;
      },
      error: (error) => {
        this.message.push({
          type: AlterEnum.DANGER,
          message: '加载文章归档失败！',
        });
      },
    });
  }

  previous() {
    // page最少到0
    if (this.page <= 0) return;
    this.page -= 1;
    this.getArchives();
  }

  next() {
    // page 最多到total-1
    if (this.page >= this.total - 1) return;
    this.page += 1;
    this.getArchives();
  }
}
