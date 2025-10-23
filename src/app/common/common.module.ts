import { NgModule } from '@angular/core';
import { CommonModule as AngularCommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// 双向绑定
import { FormsModule } from '@angular/forms';

import {
  NgbToastModule,
  NgbDropdownModule,
  NgbAlertModule,
  NgbProgressbarModule,
} from '@ng-bootstrap/ng-bootstrap';

import { HeaderComponent } from './header/header.component';
// import { AlertComponent } from './alert/alert.component';
import { ChipsComponent } from './chips/chips.component';
import { UploadComponent } from './upload/upload.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    // HeaderComponent,
    // AlertComponent,
    // ChipsComponent,
    // UploadComponent,
  ],
  imports: [
    AngularCommonModule,
    RouterModule,
    FormsModule,
    NgbToastModule,
    NgbDropdownModule,
    NgbAlertModule,
    NgbProgressbarModule,
    NgbTooltipModule,
  ],
  exports: [
    FormsModule,
    // HeaderComponent,
    // AlertComponent,
    // ChipsComponent,
    // UploadComponent,
    NgbTooltipModule,
  ],
})
export class CommonModule {}
