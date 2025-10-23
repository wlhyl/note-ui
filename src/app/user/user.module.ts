import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// cdk
import { TextFieldModule } from '@angular/cdk/text-field';

import { MarkdownModule } from 'ngx-markdown';

import { UserRoutingModule } from './user-routing.module';

import { CommonModule as NoteCommonModule } from '../common/common.module';

import { EditComponent } from './edit/edit.component';
import { UserComponent } from './user/user.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { ArticlesComponent } from './articles/articles.component';
import { CategoriesComponent } from './categories/categories.component';
import { ConfigComponent } from './config/config.component';
import { TagsComponent } from './tags/tags.component';
import { ImagesComponent } from './images/images.component';
// import {MatChipsModule} from '@angular/material';
// code mirror 编辑器
import { CodeEditor } from '@acrodata/code-editor';

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
  ],
  imports: [
    CommonModule,
    TextFieldModule,
    MarkdownModule.forChild(),
    UserRoutingModule,
    NoteCommonModule,
    CodeEditor,
  ],
})
export class UserModule {}
