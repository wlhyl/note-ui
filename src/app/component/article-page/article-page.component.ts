import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ArticlePreview } from '../../types/article';

import { ArticleCardComponent } from '..//article-card/article-card.component';

@Component({
    selector: 'app-article-page',
    templateUrl: './article-page.component.html',
    styleUrls: ['./article-page.component.scss'],
    standalone: true,
    imports: [ArticleCardComponent],
})
export class ArticlePageComponent implements OnInit, OnChanges {
  @Input()
  public articles: Array<ArticlePreview> = [];
  @Input()
  public total = 0;
  @Input()
  public page = 0;

  @Output()
  public pageChange = new EventEmitter<number>();

  // 翻页参数，start：开始页籹，end:结束页数，per: 一次显示最大页数
  // start从1开始
  public start = 1;
  public end = 1;
  private readonly per = 5;
  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['page']) {
      if (this.page >= this.total) return;

      // let currentPage: number = changes['page'].currentValue;
      this.start = Math.floor(this.page / this.per) * this.per + 1;
      this.end = this.start + this.per - 1;
      if (this.end > this.total) this.end = this.total;
    }
    if (changes['total']) {
      this.end = this.start + this.per;
      if (this.end > this.total) this.end = this.total;
    }
  }

  ngOnInit(): void {}

  previous(): void {
    // page最少到0
    if (this.page <= 0) return;
    this.page -= 1;
    this.pageChange.emit(this.page);
  }
  next(): void {
    // page 最多到total-1
    if (this.page >= this.total - 1) return;
    this.page += 1;
    this.pageChange.emit(this.page);
  }
  toPage(n: number): void {
    // 0<=page<total
    if (n >= this.total || n < 0) return;
    if (this.page === n) return;
    this.page = n;

    this.pageChange.emit(this.page);
  }
}
