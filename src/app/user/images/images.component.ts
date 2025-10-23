import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { AlertName as AlterEnum } from '../../enum/alert';
import { ApiService } from '../../services/api/api.service';
import { Alert } from '../../types/alert';
import { ImageObject, ImagesList } from '../../types/image';

@Component({
    selector: 'app-images',
    templateUrl: './images.component.html',
    styleUrls: ['./images.component.scss'],
    standalone: false
})
export class ImagesComponent implements OnInit {
  message: Array<Alert> = [];
  maxKeys = 20;
  images: ImagesList = {
    objects: [],
    base_url: '',
    continuation_token: null,
  };

  imageObject: ImageObject = {
    key: '',
    last_modified: '',
    size: 0,
  };

  deletingImage = false;
  deleteImageMessage = '';

  imageModal: NgbModalRef | null = null;

  constructor(private api: ApiService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.getImages(this.maxKeys, this.images.continuation_token);
  }

  private getImages(maxKeys: number | null, continuation_token: string | null) {
    this.api.image.getImages(maxKeys, continuation_token).subscribe({
      next: (response) => (this.images = response),
      error: (error) => {
        let msg = error.error?.error;
        let message = '获取图片失败！';

        if (msg) message = msg;

        this.message.push({
          type: AlterEnum.DANGER,
          message,
        });
      },
    });
  }

  showImage(content: any, imageObject: ImageObject) {
    this.imageObject = imageObject;
    this.imageModal = this.modalService.open(content, {
      ariaLabelledBy: 'show-image',
      backdrop: 'static',
      scrollable: false,
      size: 'lg',
    });
  }

  deleteImage(key: string) {
    this.deleteImageMessage = '';
    this.deletingImage = true;
    let fileName = key.split('/').pop()!;
    this.api.image
      .deleteImages(fileName)
      .pipe(finalize(() => (this.deletingImage = false)))
      .subscribe({
        next: (response) => {
          this.getImages(this.maxKeys, null);

          this.imageModal?.dismiss();
        },
        error: (error) => {
          let msg = error.error?.error;
          let message = '删除图片失败！';

          if (msg) message = msg;

          this.deleteImageMessage = message;
        },
      });
  }
}
