import {
  Component,
  Input,
  OnInit,
  ViewChild,
  TemplateRef,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { lastValueFrom } from 'rxjs';

import { ApiService } from '../../../services/api/api.service';
import {
  Article,
  ArticleHistoryDetail,
  ArticleHistoryPreview,
} from '../../../types/article';
import { Alert } from '../../../types/alert';
import { AlertName as AlterEnum } from '../../../enum/alert';

@Component({
  selector: 'app-article-history',
  templateUrl: './article-history.component.html',
  styleUrls: ['./article-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ArticleHistoryComponent implements OnInit {
  // 归属文章id
  @Input() articleId = 0;
  // 编辑器当前是否有未保存修改，用于回滚确认提示
  @Input() unsavedChanges = false;

  public activeModal = inject(NgbActiveModal);
  private api = inject(ApiService);
  private modalService = inject(NgbModal);

  // 历史列表
  public histories: Array<ArticleHistoryPreview> = [];
  public loading = false;

  // 历史详情
  public detail: ArticleHistoryDetail | null = null;
  public detailLoading = false;

  // 回滚中
  public rolling = false;

  public message: Array<Alert> = [];

  async ngOnInit() {
    await this.loadHistories();
  }

  private async loadHistories() {
    this.loading = true;
    this.message = [];
    try {
      this.histories = await lastValueFrom(
        this.api.article.listArticleHistories(this.articleId)
      );
    } catch (error: any) {
      this.message.push({
        type: AlterEnum.DANGER,
        message: this.errorMessage(error, '加载文章历史失败！'),
      });
    } finally {
      this.loading = false;
    }
  }

  public async openDetail(history: ArticleHistoryPreview) {
    this.detailLoading = true;
    this.message = [];
    try {
      this.detail = await lastValueFrom(
        this.api.article.getArticleHistoryDetail(this.articleId, history.id)
      );
    } catch (error: any) {
      this.message.push({
        type: AlterEnum.DANGER,
        message: this.errorMessage(error, '加载历史详情失败！'),
      });
    } finally {
      this.detailLoading = false;
    }
  }

  public backToList() {
    this.detail = null;
  }

  // 回滚确认对话框
  @ViewChild('confirmRollback') public confirmRef: TemplateRef<any> | undefined;
  public showConfirm() {
    this.modalService.open(this.confirmRef, {
      ariaLabelledBy: '回滚确认',
      backdrop: 'static',
      keyboard: false,
    });
  }

  public async rollback(modal: any) {
    if (!this.detail) return;
    this.rolling = true;
    try {
      const article: Article = await lastValueFrom(
        this.api.article.rollbackArticle(this.articleId, this.detail.id)
      );
      modal.close('rollback ok');
      this.activeModal.close(article);
    } catch (error: any) {
      modal.close('rollback error');
      this.message.push({
        type: AlterEnum.DANGER,
        message: this.errorMessage(error, '回滚文章失败！'),
      });
    } finally {
      this.rolling = false;
    }
  }

  private errorMessage(error: any, fallback: string): string {
    const msg = error?.error?.error;
    return msg ? msg : fallback;
  }
}
