import { UserChangePassword } from './../../model/user/UserChangePassword';
import { CustomErrorStateMatcher } from './../../helper/custom-errorstate-matcher';
import { Result } from './../../model/Result';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { UserInfo } from './../../model/user/UserInfo';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm: FormGroup;
  userChangePwd: UserChangePassword;
  changePwdResult: Result;
  authStatusListenerSubs: any;
  matcher = new CustomErrorStateMatcher();

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.changePwdResult = new Result();
    this.userChangePwd = new UserChangePassword();
    this.createChangePasswordForm();

    console.log(this.changePwdResult);

    this.authService.getAuthStatusListener().subscribe((userInfo: UserInfo) => {
      this.setFormValue(userInfo?.userName);
    });
  }

  setFormValue(userName: string): void {
    this.changePasswordForm.patchValue({
      userName,
    });
  }

  createChangePasswordForm(): void {
    this.changePasswordForm = this.formBuilder.group(
      {
        userName: ['', [Validators.required]],
        currentPassword: ['', [Validators.required]],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(13),
          ],
        ],
        confirmPassword: [''],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(g: FormGroup): any {
    return g.get('newPassword').value === g.get('confirmPassword').value
      ? null
      : { mismatch: true };
  }

  onChangePassword(): void {
    if (!this.changePasswordForm.valid) {
      return;
    }

    this.userChangePwd = Object.assign({}, this.changePasswordForm.value);
    this.authService.changePassword(this.userChangePwd).subscribe(
      (result: Result) => {
        this.changePwdResult.message = result.message;
        this.changePwdResult.statusCode = result.statusCode;
        this.authService.logout();
        this.toastr.success(result.message);
      },
      (error: Result) => {
        this.changePwdResult.message = error.message;
        this.changePwdResult.statusCode = error.statusCode;
        this.toastr.error(error.message);
        /* console.log('errorr', error.message); */
      }
    );
  }

  onLoginClick(): void {
    this.router.navigate(['/login']);
  }

}
