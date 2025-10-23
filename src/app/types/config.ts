export interface ConfigResponse {
  site_name: string;
  auto_save_interval: string; /// 自动保存文章的时间间隔，单位：秒
}

export interface Config {
  site_name: string;
  auto_save_interval: number; /// 自动保存文章的时间间隔，单位：秒
}
