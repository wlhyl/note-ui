import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ApiService } from '../../services/api/api.service';
import { Alert } from '../../types/alert';
import { AlertName as AlterEnum } from '../../enum/alert';
import { ArticlePreview } from '../../types/article';

@Component({
  selector: 'app-category-articles-sort',
  templateUrl: './category-articles-sort.component.html',
  styleUrls: ['./category-articles-sort.component.scss'],
  standalone: false,
})
export class CategoryArticlesSortComponent implements OnInit {
  categoryId = 0;
  categoryName = '';
  articles: ArticlePreview[] = [];
  loading = false;
  saving = false;
  message: Alert[] = [];

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('排序文章');
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.categoryId = parseInt(id, 10);
        this.loadArticles();
      }
    });
  }

  private loadArticles() {
    this.loading = true;
    this.message = [];
    this.api.category.getArticlesByCategoryId(this.categoryId).subscribe({
      next: (articles) => {
        this.articles = articles;
        this.loading = false;
        if (articles.length > 0) {
          this.categoryName = articles[0].category.name;
        }
      },
      error: (error) => {
        this.loading = false;
        const msg = error.error?.error || '获取文章列表失败';
        this.message.push({ type: AlterEnum.DANGER, message: msg });
      },
    });
  }

  drop(event: CdkDragDrop<ArticlePreview[]>) {
    moveItemInArray(this.articles, event.previousIndex, event.currentIndex);
  }

  save() {
    if (this.articles.length === 0) return;

    this.saving = true;
    this.message = [];
    const items = this.articles.map((article, index) => ({
      article_id: article.id,
      sort_order: index + 1,
    }));

    this.api.category.updateArticlesSortOrder(this.categoryId, items).subscribe({
      next: () => {
        this.saving = false;
        this.message.push({ type: AlterEnum.SUCCESS, message: '排序保存成功' });
      },
      error: (error) => {
        this.saving = false;
        const msg = error.error?.error || '保存排序失败';
        this.message.push({ type: AlterEnum.DANGER, message: msg });
      },
    });
  }

  goBack() {
    this.router.navigate(['/user/categories']);
  }
}