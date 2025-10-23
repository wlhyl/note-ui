import { DocType } from '../enum/doc-type';
import { Category } from './category';
import { Tag } from './tag';
import { User } from './user';

/**
 * 从rest接收到的文章model
 */
export interface ArticlePreview {
  id: number;
  weight: number;
  title: string;
  comment_counts: number;
  view_counts: number;
  summary: string;
  author: User;
  tags: Array<Tag>;
  create_date: string;
  last_update_date: string | null;
  category: Category;
  private: boolean;
}

export interface ArticleBody {
  id: number;
  content: string;
  doc_type: DocType;
}
export interface Article extends ArticlePreview {
  body: ArticleBody;
}

/**
 * 每月文章数统计
 */
export interface Archive {
  year: number;
  month: number;
  count: number;
}

/**
 * insert/update article
 */
export interface PatchArticle {
  id: number;
  title: string;
  summary: string;
  content: string;
  doc_type: DocType;
  category_id: number;
  tags: Array<string>;
  private: boolean;
}
