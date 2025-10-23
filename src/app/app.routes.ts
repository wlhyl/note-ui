import { Routes } from '@angular/router';
import { authGuard } from './guards/auth/auth-guard.guard';
import { StatusComponent } from './component/status/status.component';
import { LoginComponent } from './component/login/login.component';
import { ArchiveArticlesComponent } from './component/archive-articles/archive-articles.component';
import { CategoryArticlesComponent } from './component/category-articles/category-articles.component';
import { ArticleComponent } from './component/article/article.component';
import { TagArticlesComponent } from './component/tag-articles/tag-articles.component';
import { ArticlesComponent } from './component/articles/articles.component';
import { BlogComponent } from './component/blog/blog.component';

export const routes: Routes = [
  {
    path: 'blog',
    component: BlogComponent,
    children: [
      {
        path: 'articles',
        component: ArticlesComponent,
      },
      {
        path: 'articles/:id',
        component: ArticleComponent,
      },
      {
        path: 'tags/names/:name',
        component: TagArticlesComponent,
      },
      {
        path: 'categories/names/:name',
        component: CategoryArticlesComponent,
      },
      {
        path: 'archives/:year/:month',
        component: ArchiveArticlesComponent,
      },
    ],
  },

  {
    path: 'login',
    component: LoginComponent,
  },

  {
    path: 'status',
    component: StatusComponent,
  },

  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
    canMatch: [authGuard],
  },

  { path: '**', redirectTo: 'blog/articles' }, //没有配置到的路由全部重定向到/blog/articles
];
