import { CanDeactivateFn } from '@angular/router';
import { EditComponent } from '../../user/edit/edit.component';

export const editGuard: CanDeactivateFn<EditComponent> = (
  component,
  // currentRoute,
  // currentState,
  // nextState
) => {
  if (component.isSaved) return true;
  component.showAlert();
  return false;
};
