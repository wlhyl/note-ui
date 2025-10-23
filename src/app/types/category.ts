import { User } from './user';

/**
 * 文章分类
 */
export interface Category {
  id: number;
  avatar: string | null;
  name: string;
  description: string | null;
  // user: User;
}

/**
 * insert/update 文章分类
 */
export interface PatchCategory {
  id: number;
  name: string;
  description: string | null;
  user: number;
}
