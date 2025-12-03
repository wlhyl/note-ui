import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api/api.service';
import { AuthenticationInfoService } from '../../services/authentication/authentication-info.service';
import { ConfigService } from '../../services/config/config.service';
import { Alert } from '../../types/alert';
import { AlertName as AlterEnum } from '../../enum/alert';
import { AlertComponent } from '../alert/alert.component';
import {
  // NgbToastModule,
  NgbDropdownModule,
  // NgbTooltipModule,
  // NgbAlertModule,
  // NgbProgressbarModule,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [RouterModule, AlertComponent, NgbDropdownModule, FormsModule],
})
export class HeaderComponent implements OnInit {
  message: Array<Alert> = [];
  searchKeyword = '';

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

  onSearch() {
    if (this.searchKeyword.trim()) {
      this.router.navigate(['/blog/search'], {
        queryParams: { keyword: this.searchKeyword },
      });
      this.searchKeyword = '';
    }
  }

  onSearchKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }
}
