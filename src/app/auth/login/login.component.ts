import { CommonUtilService } from './../../service/common-util.service';
import { Result } from './../../model/Result';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserLogin } from 'src/app/model/user/UserLogin';
import { UserInfo } from 'src/app/model/user/UserInfo';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  userLogin: UserLogin;
  userInfo: UserInfo;
  loginResult: Result;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private commonService: CommonUtilService
  ) {}

  ngOnInit(): void {
    this.createLoginForm();
    this.loginResult = new Result();
  }

  createLoginForm(): void {
    this.loginForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onLoginSubmit(): void {
    if (!this.loginForm.valid) {
      return;
    }

    /* property assignment */
    this.userLogin = Object.assign({}, this.loginForm.value);
    this.commonService.showOverlay();
    this.authService.login(this.userLogin).subscribe((userInfo: UserInfo) => {
      this.userInfo = userInfo;
      this.authService.setUserTokenInfo(this.userInfo);
      if (this.userInfo.changePassword) {
        this.router.navigate(['changePassword']);
      } else {
        this.router.navigate(['/lms/dashboard']);
        this.toastr.success('Logged In Successfully');
      }
      this.commonService.hideOverlay();
    }, (error: any) => {
        this.loginResult.message = error.message;
        this.loginResult.statusCode = error.statusCode;
        /* this.hideOverlay(); */
        this.commonService.hideOverlay();
        this.toastr.error(error.message);
    });
  }
}
