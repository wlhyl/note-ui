import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from '../../common/header/header.component';
import { TagCardComponent } from '../tag-card/tag-card.component';
import { CategoryCardComponent } from '../category-card/category-card.component';
import { ArchiveCardComponent } from '../archive-card/archive-card.component';

@Component({
  selector: 'app-home',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [HeaderComponent, RouterModule, TagCardComponent, CategoryCardComponent, ArchiveCardComponent],
})
export class BlogComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
