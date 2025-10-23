import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api/api.service';
import { Alert } from '../../types/alert';
import { AlertName as AlterEnum } from '../../enum/alert';

import { RouterModule } from '@angular/router';
import { AlertComponent } from '../../common/alert/alert.component';
 

@Component({
    selector: 'app-category-card',
    templateUrl: './category-card.component.html',
    styleUrls: ['./category-card.component.scss'],
    standalone: true,
    imports: [RouterModule, AlertComponent],
})
export class CategoryCardComponent implements OnInit {
  public categories: Array<string> = [];
  public total = 0;

  public page = 0;
  private size = 5;

  message: Array<Alert> = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this.api.category.getCategoryNames(this.page, this.size).subscribe({
      next: (respone) => {
        this.total = respone.total_pages;
        this.categories.push(...respone.data);
      },
      error: (error) => {
        this.message.push({
          type: AlterEnum.DANGER,
          message: '加载文章分类失败！',
        });
      },
    });
  }

  next(): void {
    if (this.page + 1 >= this.total) return;
    this.page += 1;
    this.getCategories();
  }
}
