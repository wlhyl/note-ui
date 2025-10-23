import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthenticationInfoService } from 'src/app/services/authentication/authentication-info.service';
import { ConfigService } from 'src/app/services/config/config.service';
import { Alert } from 'src/app/types/alert';
import { AlertName as AlterEnum } from 'src/app/enum/alert';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: false
})
export class HeaderComponent implements OnInit {
  message: Array<Alert> = [];

  constructor(
    private router: Router,
    public user: AuthenticationInfoService,
    private api: ApiService,
    public configService: ConfigService
  ) {}

  ngOnInit(): void {}

  login() {
    // this.router.navigate(['/login']);
    this.router.navigateByUrl('/login');
  }

  logout() {
    this.api.user.logout().subscribe({
      next: (respone) => {
        // if (respone.length > 5) this.tags = respone.slice(0, 5);
        // else
        this.user.token = '';
        this.user.user = { id: 0, account: '', avatar: null, nick: '' };
      },
      error: (error) => {
        this.message.push({
          type: AlterEnum.DANGER,
          message: '注销失败！',
        });
      },
    });
  }
}
