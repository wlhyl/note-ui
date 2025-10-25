import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { TransferState, makeStateKey } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ApiService } from '../api/api.service';
import { AuthenticationInfoService } from '../authentication/authentication-info.service';
import { ConfigService } from '../config/config.service';

const CONFIG_KEY = makeStateKey<any>('app-config');
const USER_INFO_KEY = makeStateKey<any>('user-info');

@Injectable({
  providedIn: 'root'
})
export class SsrDataService {
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(TransferState) private transferState: TransferState,
    private apiService: ApiService,
    private authService: AuthenticationInfoService,
    private configService: ConfigService
  ) {}

  /**
   * 在SSR环境下预加载数据
   */
  async preloadData(): Promise<void> {
    if (isPlatformServer(this.platformId)) {
      try {
        // 预加载配置数据
        const config = await lastValueFrom(this.apiService.config.getConfig());
        this.transferState.set(CONFIG_KEY, config);
        
        // 如果用户已登录，预加载用户信息
        if (this.authService.token !== '') {
          try {
            const userInfo = await lastValueFrom(this.apiService.user.userInfo());
            this.transferState.set(USER_INFO_KEY, userInfo);
          } catch (error) {
            console.warn('SSR用户信息加载失败:', error);
          }
        }
      } catch (error) {
        console.warn('SSR配置数据加载失败:', error);
        // 设置默认配置
        this.transferState.set(CONFIG_KEY, {
          site_name: 'Note App',
          auto_save_interval: 5
        });
      }
    }
  }

  /**
   * 在浏览器环境下从TransferState获取预加载的数据
   */
  initializeFromTransferState(): void {
    const config = this.transferState.get(CONFIG_KEY, null);
    if (config) {
      this.configService.config.site_name = config.site_name;
      const auto_save_interval = Number(config.auto_save_interval);
      if (!isNaN(auto_save_interval) && auto_save_interval >= 3) {
        this.configService.config.auto_save_interval = auto_save_interval;
      } else {
        this.configService.config.auto_save_interval = 5;
      }
    }

    const userInfo = this.transferState.get(USER_INFO_KEY, null);
    if (userInfo && this.authService.token !== '') {
      this.authService.user = userInfo;
    }
  }
}