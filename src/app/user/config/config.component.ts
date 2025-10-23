import { Component, OnInit } from '@angular/core';
import { AlertName as AlterEnum } from 'src/app/enum/alert';
import { ApiService } from 'src/app/services/api/api.service';
import { ConfigService } from 'src/app/services/config/config.service';
import { Alert } from 'src/app/types/alert';
import { Config, ConfigResponse } from 'src/app/types/config';

@Component({
    selector: 'app-config',
    templateUrl: './config.component.html',
    styleUrls: ['./config.component.scss'],
    standalone: false
})
export class ConfigComponent implements OnInit {
  config: Config = {
    site_name: '',
    auto_save_interval: 0,
  };

  message: Array<Alert> = [];
  saving = false;

  constructor(private configService: ConfigService, private api: ApiService) {
    Object.assign(this.config, this.configService.config);
  }

  ngOnInit(): void {}

  save() {
    this.message = [];

    if (this.config.auto_save_interval < 3) {
      const message = 'auto_save_interval最小值是:：3';

      this.message.push({
        type: AlterEnum.DANGER,
        message,
      });
      return;
    }

    this.saving = true;
    this.api.config
      .updateConfig({
        site_name: this.config.site_name,
        auto_save_interval: `${this.config.auto_save_interval}`,
      })
      .subscribe({
        next: (response) =>
          // Object.assign(this.configService.config, this.config),
          (this.configService.config = { ...this.config }),
        error: (error) => {
          const msg = error.error.error;
          const message = msg ? msg : '更新站点配置失败！';

          this.message.push({
            type: AlterEnum.DANGER,
            message,
          });
        },
      })
      .add(() => (this.saving = false));
  }
}
