import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthenticationInfoService } from 'src/app/services/authentication/authentication-info.service';
import { Alert } from 'src/app/types/alert';
import { AlertName as AlterEnum } from 'src/app/enum/alert';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: false
})
export class LoginComponent implements OnInit {
  public account = '';
  public password = '';
  public accountError: string | null = null;
  public passwordError: string | null = null;
  private canGoBack: boolean;

  message: Array<Alert> = [];

  constructor(
    private api: ApiService,
    private authenticationInfo: AuthenticationInfoService,
    private readonly router: Router,
    private readonly location: Location
  ) {
    this.canGoBack = !!this.router.currentNavigation()?.previousNavigation;
  }

  ngOnInit(): void {}

  async login() {
    this.accountError = null;
    this.passwordError = null;
    if (this.account.length === 0) this.accountError = '请输入用户名';
    // if (this.account.length >= 10) this.accountError = '不能大于10个字符';

    if (this.password.length === 0) this.passwordError = '请输入密码';
    // if (this.password.length >= 10) this.passwordError = '不能大于10个字符';

    try {
      let token = await lastValueFrom(
        this.api.user.login(this.account, this.password)
      );
      this.authenticationInfo.token = token.token;
    } catch (error) {
      this.message.push({
        type: AlterEnum.DANGER,
        message: '登录失败！',
      });
      return;
    }

    try {
      let user = await lastValueFrom(this.api.user.userInfo());
      this.authenticationInfo.user = user;
    } catch (error) {
      this.message.push({
        type: AlterEnum.DANGER,
        message: '获取用户信息失败！',
      });
      return;
    }

    if (this.canGoBack) this.location.back();
    else this.router.navigateByUrl('/');
  }
}
