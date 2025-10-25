import { lastValueFrom } from 'rxjs';
import { ApiService } from '../api/api.service';
import { AuthenticationInfoService } from '../authentication/authentication-info.service';
import { ConfigService } from '../config/config.service';
import { SsrDataService } from '../ssr/ssr-data.service';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';

export async function appInit(
  user: AuthenticationInfoService,
  api: ApiService,
  configService: ConfigService,
  ssrDataService: SsrDataService
) {
  const platformId = inject(PLATFORM_ID);
  
  // 如果是浏览器环境，从TransferState获取预加载的数据
  if (isPlatformBrowser(platformId)) {
    ssrDataService.initializeFromTransferState();
    await initializeApp(user, api, configService);
  } else if (isPlatformServer(platformId)) {
    // SSR环境下预加载数据
    await ssrDataService.preloadData();
    
    // 同时尝试直接初始化应用
    try {
      await initializeApp(user, api, configService);
    } catch (error) {
      // SSR构建时API可能不可用，使用默认配置
      console.warn('SSR构建时API调用失败，使用默认配置');
      configService.config.site_name = 'Note App';
      configService.config.auto_save_interval = 5;
    }
  }
}

async function initializeApp(
  user: AuthenticationInfoService,
  api: ApiService,
  configService: ConfigService
) {
  if (user.token !== '') {
    try {
      let userInfo = await lastValueFrom(api.user.userInfo());
      user.user = userInfo;
    } catch (error) {
      user.token = '';
    }
  }

  try {
    const res = await lastValueFrom(api.config.getConfig());
    configService.config.site_name = res.site_name;
    const auto_save_interval = Number(res.auto_save_interval);
    if (isNaN(auto_save_interval) || auto_save_interval < 3) {
      console.error('应用初始化错误：auto_save_interval必需是>=3的整数，获取到值是：', res.auto_save_interval);
      configService.config.auto_save_interval = 5; // 使用默认值
    } else {
      configService.config.auto_save_interval = auto_save_interval;
    }
  } catch (error) {
    // API调用失败时使用默认值
    console.warn('配置API调用失败，使用默认配置');
    configService.config.site_name = 'Note App';
    configService.config.auto_save_interval = 5;
    throw error; // 重新抛出错误，让SSR知道API调用失败
  }
}
