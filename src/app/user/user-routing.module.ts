import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user/user.component';

import { UserInfoComponent } from './user-info/user-info.component';
import { ArticlesComponent } from './articles/articles.component';
import { CategoriesComponent } from './categories/categories.component';
import { TagsComponent } from './tags/tags.component';
import { EditComponent } from './edit/edit.component';
import { ConfigComponent } from './config/config.component';
import { ImagesComponent } from './images/images.component';
import { editGuard } from '../guards/edit/edit.guard';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      { path: 'userinfo', component: UserInfoComponent },
      { path: 'articles', component: ArticlesComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'tags', component: TagsComponent },
      { path: 'images', component: ImagesComponent },
      { path: 'edit', component: EditComponent, canDeactivate: [editGuard] },
      {
        path: 'edit/:id',
        component: EditComponent,
        canDeactivate: [editGuard],
      },
      { path: 'config', component: ConfigComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
