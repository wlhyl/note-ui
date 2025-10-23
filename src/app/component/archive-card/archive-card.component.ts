import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api/api.service';
import { Alert } from '../../types/alert';
import { AlertName as AlterEnum } from '../../enum/alert';
import { Archive } from '../../types/article';

import { RouterModule } from '@angular/router';

import { AlertComponent } from '../../common/alert/alert.component';

@Component({
  selector: 'app-archive-card',
  templateUrl: './archive-card.component.html',
  styleUrls: ['./archive-card.component.scss'],
  standalone: true,
  imports: [RouterModule, AlertComponent],
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
