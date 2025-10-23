import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// common
// import { CommonModule as NoteCommonModule } from './common/common.module';

// import { UserModule } from './user/user.module';

// import { BlogComponent } from './component/blog/blog.component';
// import { ArticlesComponent } from './component/articles/articles.component';
// import { ArticlePageComponent } from './component/article-page/article-page.component';
// import { ArticleCardComponent } from './component/article-card/article-card.component';
// import { TagCardComponent } from './component/tag-card/tag-card.component';
// import { TagArticlesComponent } from './component/tag-articles/tag-articles.component';
// import { CategoryCardComponent } from './component/category-card/category-card.component';
// import { CategoryArticlesComponent } from './component/category-articles/category-articles.component';
// import { ArchiveCardComponent } from './component/archive-card/archive-card.component';
// import { ArchiveArticlesComponent } from './component/archive-articles/archive-articles.component';
// import { ArticleComponent } from './component/article/article.component';
// import { LoginComponent } from './component/login/login.component';
// import { appInit } from './services/init/app-init';
// import { AuthenticationInfoService } from './services/authentication/authentication-info.service';
// import { ApiService } from './services/api/api.service';
// import { ConfigService } from './services/config/config.service';
// import { MarkdownComponent } from './component/markdown/markdown.component';
// import { StatusComponent } from 'src/app/component/status/status.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    // BlogComponent,
    // ArticlesComponent,
    // ArticlePageComponent,
    // ArticleCardComponent,
    // TagCardComponent,
    // TagArticlesComponent,
    // CategoryCardComponent,
    // CategoryArticlesComponent,
    // ArchiveCardComponent,
    // ArchiveArticlesComponent,
    // ArticleComponent,
    // LoginComponent,
    // NoteCommonModule,
    // UserModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('note');
}
