import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class CustomErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const invalidCtrl = !!(control && control.invalid);
    const invalidParent = !!(
      (control.touched && control) &&
      control.parent &&
      control.parent.invalid
    );

    return invalidCtrl || invalidParent;
  }
}
