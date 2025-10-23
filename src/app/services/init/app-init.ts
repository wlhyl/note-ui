import { lastValueFrom } from 'rxjs';
import { ApiService } from '../api/api.service';
import { AuthenticationInfoService } from '../authentication/authentication-info.service';
import { ConfigService } from '../config/config.service';
import { error } from 'console';

export async function appInit(
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

  // try {
  const res = await lastValueFrom(api.config.getConfig());
  configService.config.site_name = res.site_name;
  const auto_save_interval = Number(res.auto_save_interval);
  if (isNaN(auto_save_interval) || auto_save_interval < 3) {
    alert('应用初始化错误，请到控制台查看详情！');
    throw new Error(
      `auto_save_interval必需是>=3的整数，获取到值是：${res.auto_save_interval}`
    );
  }
  configService.config.auto_save_interval = auto_save_interval;

  // }
  // } catch (error) {
  //   throw error
  // }
}
