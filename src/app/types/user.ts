/**
 * 用户信息
 */
export interface User {
  id: number;
  account: string;
  avatar: string | null;
  nick: string;
}

export interface PatchUser {
  nick: string | null;
  avatar: string | null;
  password: string | null;
  old_password: string | null;
}
