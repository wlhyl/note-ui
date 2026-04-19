import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

// cdk
import { TextFieldModule } from '@angular/cdk/text-field';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { MarkdownModule } from 'ngx-markdown';

import { UserRoutingModule } from './user-routing.module';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { EditComponent } from './edit/edit.component';
import { UserComponent } from './user/user.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { ArticlesComponent } from './articles/articles.component';
import { CategoriesComponent } from './categories/categories.component';
import { ConfigComponent } from './config/config.component';
import { TagsComponent } from './tags/tags.component';
import { ImagesComponent } from './images/images.component';
import { CategoryArticlesSortComponent } from './category-articles-sort/category-articles-sort.component';
// code mirror 编辑器
import { CodeEditor } from '@acrodata/code-editor';

import { AlertComponent } from '../common/alert/alert.component';
import { HeaderComponent } from '../common/header/header.component';
import { ChipsComponent } from '../common/chips/chips.component';
import { UploadComponent } from '../common/upload/upload.component';

@NgModule({
  declarations: [
    UserComponent,
    UserInfoComponent,
    ArticlesComponent,
    EditComponent,
    CategoriesComponent,
    ConfigComponent,
    TagsComponent,
    ImagesComponent,
    CategoryArticlesSortComponent,
  ],
  imports: [
    CommonModule,
    TextFieldModule,
    DragDropModule,
    MarkdownModule.forChild(),
    UserRoutingModule,
    FormsModule,
    NgbTooltipModule,
    AlertComponent,
    HeaderComponent,
    ChipsComponent,
    UploadComponent,
    CodeEditor,
  ],
})
export class UserModule {}
