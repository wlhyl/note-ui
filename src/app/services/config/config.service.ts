import { Injectable } from '@angular/core';
import { Config } from '../../types/config';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  config: Config = {
    site_name: 'default',
    auto_save_interval: 3,
  };

  constructor() {}
}
