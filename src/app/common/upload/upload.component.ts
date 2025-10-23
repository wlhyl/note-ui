import { HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { finalize, Subscription } from 'rxjs';
import { ApiService } from '../../services/api/api.service';
import {
  // NgbTooltipModule,
  NgbProgressbarModule,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
  standalone: true,
  imports: [
    // NgbTooltipModule,
    NgbProgressbarModule,
  ],
})
export class UploadComponent implements OnInit {
  @Input() name: string = '文件上传';
  @Input()
  requiredFileType: string = '*'; //= 'image/png, image/jpg';
  fileName = '';
  uploadProgress: number = 0;
  uploadSub: Subscription | null = null;

  message = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {}

  onFileSelected(event: Event) {
    // const file:File = event.target.files[0];

    const target = event.target as HTMLInputElement | null;
    if (!target) return;
    const files = target.files;
    if (!files) return;
    const file: File = files[0];

    // let files = (<HTMLInputElement>event.target!!).files;

    this.fileName = '';
    this.message = '';

    const formData = new FormData();
    formData.append('thumbnail', file);

    const upload = this.api.image.uploadImage(formData).pipe(finalize(() => this.reset()));

    this.uploadSub = upload.subscribe({
      next: (event) => {
        if (event.type == HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(100 * (event.loaded / event.total!!));
        }
        if (event.type === HttpEventType.Response) {
          const filenames = event.body as Array<string>;
          this.fileName = filenames[0];
        }
      },
      error: (error) => {
        const msg = error.error.error;
        if (error) this.message = msg;
        else this.message = '文件上传失败！';
      },
    });
  }

  cancelUpload() {
    this.uploadSub?.unsubscribe();
    this.reset();
  }
  reset() {
    this.uploadProgress = 0;
    this.uploadSub = null;
    // this.message = '';
  }
}

// https://blog.angular-university.io/angular-file-upload
