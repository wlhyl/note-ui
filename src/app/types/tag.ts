import { User } from './user';

/**
 * 文章标签
 */
export interface Tag {
  id: number;
  avatar: string | null;
  name: string;
  // user: User;
}


/**
 * insert/update 文章标签
 */
export interface PatchTag {
  id: number;
  name: string;
  user: number;
}
