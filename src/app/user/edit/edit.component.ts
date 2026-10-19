import {
  Component,
  HostListener,
  inject,
  OnDestroy,
  // HostBinding,
  OnInit,
  TemplateRef,
  ViewChild,
  ChangeDetectionStrategy
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  asyncScheduler,
  debounceTime,
  lastValueFrom,
  merge,
  Subject,
  Subscription,
  switchMap,
  throttleTime,
  timer,
} from 'rxjs';
import { ApiService } from '../../services/api/api.service';
import { Article, PatchArticle } from '../../types/article';
import { Category, PatchCategory } from '../../types/category';
import { PatchTag } from '../../types/tag';
// import '@github/markdown-toolbar-element';

import { LanguageDescription } from '@codemirror/language';
import { languages } from '@codemirror/language-data'; // 🎯 包含几十种常见语言定义
import { markdown } from '@codemirror/lang-markdown';

import { Alert } from '../../types/alert';

import { AlertName as AlterEnum } from '../../enum/alert';
import { DocType } from '../../enum/doc-type';
import { deepCopy } from '../../utils/object_utils';
import { ConfigService } from '../../services/config/config.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ENV_CONFIG } from '../../tokens/app-config.token';
import { ArticleHistoryComponent } from './article-history/article-history.component';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class EditComponent implements OnInit, OnDestroy {
  // @HostBinding('class.focus')
  // public isFocus: boolean = false;
  private config = inject(ENV_CONFIG);
  public baseUrl = this.config.baseUrl;

   supportedLanguages = [
    LanguageDescription.of({
      name: 'Markdown',
      alias: ['md'],
      load: async () => markdown({ codeLanguages: languages })  // ✅ 支持内嵌语言高亮
    })
  ];

  // get codeMirrorOptions() {
  //   const mode = 'markdown';

  //   return {
  //     lineNumbers: true,
  //     theme: 'material',
  //     mode,
  //     lineWrapping: true,
  //   };
  // }

  public article: Article = {
    body: { id: 0, content: '', doc_type: DocType.Markdown },
    id: 0,
    weight: 0,
    title: '',
    comment_counts: 0,
    view_counts: 0,
    summary: '',
    author: { id: 0, account: '', nick: '', avatar: null },
    tags: [],
    create_date: '',
    category: {
      id: 0,
      name: '',
      description: '',
      avatar: '',
    },
    private: true,
    last_update_date: null,
  };

  public categories: Array<Category> = [];
  public tags: Array<string> = [];
  //  Array<{ id: number; name: string; checked: boolean }> = [];

  // 新增category
  public category: PatchCategory = {
    id: 0,
    name: '',
    description: null,
    user: 0,
  };

  // 新增tag
  public tag: PatchTag = {
    id: 0,
    name: '',
    user: 0,
  };

  // 预览markdown
  public preview = true;

  // 旧文章body
  oldArticle: Article = {
    body: { id: 0, content: '', doc_type: DocType.Markdown },
    id: 0,
    weight: 0,
    title: '',
    comment_counts: 0,
    view_counts: 0,
    summary: '',
    author: {
      id: 0,
      account: '',
      avatar: null,
      nick: '',
    },
    tags: [],
    create_date: '',
    last_update_date: null,
    category: {
      id: 0,
      avatar: null,
      name: '',
      description: null,
    },
    private: true,
  };

  // 保存文章
  public saving = false;

  // error
  public message: Array<Alert> = [];

  public titleError = '';
  public categoryError = '';
  public tagsError = '';
  public summaryError = '';

  // 已经保存
  get isSaved() {
    if (this.article.title !== this.oldArticle.title) {
      return false;
    }

    if (this.article.summary !== this.oldArticle.summary) {
      return false;
    }

    if (this.tags.length !== this.oldArticle.tags.length) {
      return false;
    }

    const oldTags = this.oldArticle.tags.map((t) => t.name);
    if (this.tags.filter((tag) => oldTags.includes(tag)).length != this.article.tags.length) {
      return false;
    }

    if (this.article.category.id !== this.oldArticle.category.id) {
      return false;
    }

    if (this.article.body.content !== this.oldArticle.body.content) {
      return false;
    }

    if (this.article.body.doc_type !== this.oldArticle.body.doc_type) {
      return false;
    }

    if (this.article.private !== this.oldArticle.private) {
      return false;
    }

    return true;

    // body: { id: 0, content: '', doc_type: DocType.Markdown },
    // id: 0,
    // weight: 0,
    // title: '',
    // comment_counts: 0,
    // view_counts: 0,
    // summary: '',
    // author: {
    // id: 0,
    // account: '',
    // avatar: null,
    // nick: '',
    // },
    // tags: [],
    // create_date: '',
    // last_update_date: null,
    // category: {
    // id: 0,
    // avatar: null,
    // name: '',
    // description: null,
    // },
    // private: false,
  }

  // 自动保存
  private autoSaveSub: Subscription;

  // 用户活动流：任何输入/选择/点击都会向其发送信号
  private userActivity$ = new Subject<void>();

  // 自动保存失败后的重试信号
  private retry$ = new Subject<void>();

  // 连续自动保存失败次数（用户一有输入即重置）
  private autoSaveRetryCount = 0;

  // 连续自动保存失败的最大重试次数，超过后停止自动重试，等待用户操作
  private readonly maxAutoSaveRetries = 5;

  // 上次保存成功的时间，用于界面提示
  public lastSavedAt: Date | null = null;

  constructor(
    private api: ApiService,
    // private toastService: ToastService,
    private route: ActivatedRoute,
    private configService: ConfigService,
    private modalService: NgbModal
  ) {
    // 输入停止 idle 秒后自动保存；持续输入时最长每 maxWait 秒强制保存一次，防止数据丢失
    const idleMs = Math.max(this.configService.config.auto_save_interval, 3) * 1000;
    const maxWaitMs = idleMs * 3;

    this.autoSaveSub = merge(
      // 输入停止检测：停止输入 idle 秒后触发一次
      this.userActivity$.pipe(debounceTime(idleMs)),
      // 最大等待上限：持续输入时每 maxWait 秒触发一次
      this.userActivity$.pipe(
        throttleTime(maxWaitMs, asyncScheduler, { leading: false, trailing: true })
      ),
      // 保存失败后延迟 idle 秒重试
      this.retry$.pipe(switchMap(() => timer(idleMs)))
    ).subscribe(() => this.tryAutoSave());
  }

  // 监听整个文档的输入/选择/点击事件（CodeMirror、select、checkbox、textarea 均会触发），
  // 不拆写 [(ngModel)]，避免 (ngModelChange) 覆盖香蕉框绑定的问题
  @HostListener('document:input')
  @HostListener('document:change')
  @HostListener('document:click')
  onUserActivity() {
    this.autoSaveRetryCount = 0;
    this.userActivity$.next();
  }

  ngOnDestroy(): void {
    this.autoSaveSub.unsubscribe();
  }

  private tryAutoSave(): void {
    // 已保存 / 保存中 / 校验不通过时跳过
    if (this.isSaved || this.saving || !this.validateArticle().validated()) {
      return;
    }
    this.save(true);
  }

  async ngOnInit() {
    // 获取文章分类
    await this.getCategories();
    // 获取文章标签
    // await this.getTags();

    let id = this.route.snapshot.paramMap.get('id');
    if (id === null) return;
    let articleId = Number(id);
    if (isNaN(articleId)) {
      this.message.push({
        type: AlterEnum.DANGER,
        message: `文章id: ${id}不正确！`,
      });
      return;
    }

    await this.getArticle(articleId);
    this.tags = this.article.tags.map((tag) => tag.name);
  }

  private async getArticle(id: number) {
    try {
      this.article = await lastValueFrom(this.api.article.getAnyArticleById(id));
      this.oldArticle = deepCopy(this.article);
    } catch (error) {
      this.message.push({
        type: AlterEnum.DANGER,
        message: `文章id: ${id}, 文章加载失败！`,
      });
    }
  }

  // focus() {
  //   this.isFocus = true;
  // }
  // blur() {
  //   this.isFocus = false;
  // }

  private async getCategories() {
    try {
      this.categories = await lastValueFrom(this.api.category.getCategoriesByUser());
    } catch (error) {
      this.message.push({
        type: AlterEnum.DANGER,
        message: '获取文章分类失败！',
      });
    }
  }

  // private async getTags() {
  //   try {
  //     let tags = await lastValueFrom(this.api.getTagsByUser());
  //     this.tags = tags.map((tag) => {
  //       return { id: tag.id, name: tag.name, checked: false };
  //     });
  //   } catch (error) {
  //     this.toastService.error('获取文章标签失败！');
  //   }
  // }
  addCategory() {
    this.category.id = this.category.id === 0 ? 1 : 0;

    if (this.category.name !== '') {
      this.api.category
        .addCategory(this.category)
        .subscribe({
          next: (response) => {
            this.getCategories();
            this.article.category = response;
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
        .add(() => (this.category.name = ''));
    }
  }

  // addTag() {
  //   this.tag.id = this.tag.id === 0 ? 1 : 0;

  //   if (this.tag.name !== '') {
  //     this.api
  //       .addTag(this.tag)
  //       .subscribe({
  //         next: (response) => this.getTags(),
  //         error: (error) => {
  //           let msg = error.error.error;
  //           if (msg) this.toastService.error(msg);
  //           else this.toastService.error('新增文章标签失败！');
  //         },
  //       })
  //       .add(() => (this.tag.name = ''));
  //   }
  // }

  save(autoSave = false) {
    const validated = this.validateArticle();

    if (!validated.validated()) {
      this.titleError = validated.titleError;
      this.categoryError = validated.categoryError;
      this.tagsError = validated.tagsError;
      this.summaryError = validated.summaryError;
      return;
    }

    this.message = [];

    // let content_html = this.markdownService.parse(this.article.body.content);
    let article: PatchArticle = {
      id: this.article.id,
      title: this.article.title,
      summary: this.article.summary,
      content: this.article.body.content,
      doc_type: this.article.body.doc_type,
      category_id: this.article.category.id,
      tags: this.tags,
      private: this.article.private,
    };
    this.saving = true;
    if (article.id !== 0) {
      // update article
      this.api.article
        .updateArticle(article)
        .subscribe({
          next: (response) => {
            this.article = response;
            this.oldArticle = deepCopy(this.article);
            this.lastSavedAt = new Date();
          },
          error: () => {
            this.message.push({
              type: AlterEnum.DANGER,
              message: '更新文章失败！',
            });
            this.scheduleAutoSaveRetry(autoSave);
          },
        })
        .add(() => (this.saving = false));
    } else {
      // insert article
      this.api.article
        .addArticle(article)
        .subscribe({
          next: (response) => {
            this.article = response;
            this.oldArticle = deepCopy(this.article);
            this.lastSavedAt = new Date();
          },
          error: () => {
            this.message.push({
              type: AlterEnum.DANGER,
              message: '新增文章失败！',
            });
            this.scheduleAutoSaveRetry(autoSave);
          },
        })
        .add(() => (this.saving = false));
    }
  }

  // 自动保存失败后安排重试；连续失败超过上限则停止，等用户下次输入再恢复
  private scheduleAutoSaveRetry(autoSave: boolean): void {
    if (!autoSave) return;
    this.autoSaveRetryCount++;
    if (this.autoSaveRetryCount <= this.maxAutoSaveRetries) {
      this.retry$.next();
    }
  }

  private validateArticle() {
    let error = {
      titleError: '',
      categoryError: '',
      tagsError: '',
      summaryError: '',
      validated() {
        return (
          this.titleError === '' &&
          this.categoryError === '' &&
          this.tagsError === '' &&
          this.summaryError === ''
        );
      },
    };

    if (this.article.title === '') {
      error.titleError = '请输入文章标题';
      return error;
    }

    if (this.article.category.id === 0) {
      error.categoryError = '请选择文章分类';
      return error;
    }
    // let tags = this.tags.filter((tag) => tag.checked).map((tag) => tag.id);
    if (this.tags.length === 0) {
      error.tagsError = '输入文章标签';
      return error;
    }
    if (this.article.summary === '') {
      error.summaryError = '请输入文章摘要';
      return error;
    }

    return error;
  }

  // 文章没有保存提示对话框
  @ViewChild('content') public templateref: TemplateRef<any> | undefined;
  showAlert() {
    console.log(this.templateref);

    this.modalService
      .open(this.templateref, {
        ariaLabelledBy: '文章没有保存',
        keyboard: false,
        backdrop: 'static',
      })
      .result.then(
        (result: any) => {
          // this.closeResult = `Closed with: ${result}`;
        },
        (reason: any) => {
          // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  // 打开文章历史弹窗，回滚成功后用返回的文章刷新编辑器
  showHistory() {
    const modalRef = this.modalService.open(ArticleHistoryComponent, {
      ariaLabelledBy: '文章历史',
      size: 'lg',
    });
    modalRef.componentInstance.articleId = this.article.id;
    modalRef.componentInstance.unsavedChanges = !this.isSaved;
    modalRef.result.then(
      (article: Article) => {
        if (!article) return;
        this.article = article;
        this.tags = this.article.tags.map((tag) => tag.name);
        this.oldArticle = deepCopy(this.article);
        this.message = [];
        this.message.push({
          type: AlterEnum.SUCCESS,
          message: '文章已回滚到指定历史版本！',
        });
      },
      () => {
        // 弹窗被关闭/取消，无需处理
      }
    );
  }
}

// console.log(this.markdownService.parse('I am using __markdown__.'));

// 参考
// https://blog.csdn.net/weixin_36691991/article/details/91984484
// 预览区div的设置
// overflow:auto; 启用div滚动条
//  position: relative; div的子元素采用相对位置，确保div中的元素内容限制在div内，否则，div中子元素虽然被隐藏，但会撑开div
