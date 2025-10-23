import { AlertName as AlterEnum } from '../enum/alert';
export interface Alert {
  type: AlterEnum;
  message: string;
}
