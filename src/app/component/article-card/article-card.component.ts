import { Component, Input, OnInit } from '@angular/core';
import { AuthenticationInfoService } from '../..//services/authentication/authentication-info.service';
import { ArticlePreview } from '../../types/article';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss'],
  standalone: true,
  imports: [RouterModule],
})
export class ArticleCardComponent implements OnInit {
  @Input()
  public article: ArticlePreview = {
    id: 0,
    weight: 0,
    title: '',
    comment_counts: 0,
    view_counts: 0,
    summary: '',
    author: { id: 0, account: '', avatar: '', nick: '' },
    tags: [],
    create_date: '',
    category: {
      id: 0,
      name: '',
      avatar: '',
      description: '',
    },
    private: true,
    last_update_date: null,
  };
  constructor(public user: AuthenticationInfoService) {}

  ngOnInit(): void {}
}
