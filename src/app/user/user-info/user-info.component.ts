import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api/api.service';
import { AuthenticationInfoService } from '../../services/authentication/authentication-info.service';
import { PatchUser, User } from '../../types/user';
import { AlertName as AlterEnum } from '../../enum/alert';
import { Alert } from '../../types/alert';

@Component({
    selector: 'app-user-info',
    templateUrl: './user-info.component.html',
    styleUrls: ['./user-info.component.scss'],
    standalone: false
})
export class UserInfoComponent implements OnInit {
  public user: User = {
    id: 0,
    account: '',
    avatar: null,
    nick: '',
  };
  public oldPassword = '';
  public password = '';
  public repeatPassword = '';
  // public errorMessage = '';
  public updating = false;
  public message: Array<Alert> = [];

  constructor(
    private authenticatedUser: AuthenticationInfoService,
    private api: ApiService
  ) {
    this.user.id = authenticatedUser.user.id;
    this.user.account = authenticatedUser.user.account;
    this.user.nick = authenticatedUser.user.nick;
    this.user.avatar = authenticatedUser.user.avatar;
  }

  ngOnInit(): void {}
  updateUser() {
    this.message = [];
    if (this.password !== this.repeatPassword) {
      this.message.push({
        type: AlterEnum.DANGER,
        message: '新密码两次输入不一致！',
      });

      return;
    }

    if (
      (this.user.nick === this.authenticatedUser.user.nick ||
        this.user.nick === '') &&
      this.password === ''
    )
      return;
    let user: PatchUser = {
      nick:
        this.user.nick === '' ||
        this.user.nick === this.authenticatedUser.user.nick
          ? null
          : this.user.nick,
      avatar: null,
      password: this.password === '' ? null : this.password,
      old_password: this.oldPassword === '' ? null : this.oldPassword,
    };

    if (user.password !== null && user.old_password === null) {
      this.message.push({
        type: AlterEnum.DANGER,
        message: '没有输入旧密码',
      });

      return;
    }

    this.updating = true;
    this.api.user
      .updateUser(this.user.id, user)
      .subscribe({
        next: (response) => {
          this.authenticatedUser.user = response;
          this.user.id = this.authenticatedUser.user.id;
          this.user.account = this.authenticatedUser.user.account;
          this.user.nick = this.authenticatedUser.user.nick;
          this.user.avatar = this.authenticatedUser.user.avatar;
        },
        error: (error) => {
          const msg = error.error.error;
          const message = msg ? msg : '新增用户失败';

          this.message.push({
            type: AlterEnum.DANGER,
            message,
          });
        },
      })
      .add(() => {
        this.updating = false;
        this.oldPassword = '';
        this.password = '';
        this.repeatPassword = '';
      });
  }
}
