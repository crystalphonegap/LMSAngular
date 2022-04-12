import { UserChangePassword } from './../model/user/UserChangePassword';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserLogin } from './../model/user/UserLogin';
import { environment } from './../../environments/environment';
import { UserInfo } from '../model/user/UserInfo';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Result } from '../model/Result';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authStatusListener = new BehaviorSubject<UserInfo>(null);
  jwtHelper: JwtHelperService;
  decodedToken: any;

  constructor(private http: HttpClient, private router: Router) {
    this.jwtHelper = new JwtHelperService();
  }

  login(userLogin: UserLogin): any {
    return this.http.post<UserInfo>(environment.apiURL + '/user/signIn/', userLogin);
  }

  setUserTokenInfo(userInfo: UserInfo): void {
    this.decodedToken = this.jwtHelper.decodeToken(userInfo.token);
    /* console.log(userInfo); */
    this.setTokenData(userInfo);
    this.authStatusListener.next(userInfo);
    /* //this.setTokenTimer(this.jwtHelper.getTokenExpirationDate(userInfo.token)); */
  }

  getToken(): string {
    const userInfo = this.getTokenData();
    if (userInfo) {
      return userInfo.token;
    }
  }

  setRefreshToken(): any {
    return this.http.post<any>(environment.apiURL + '/user/refreshToken/', {
      refreshToken: this.getRefreshToken(), token: this.getToken()
    }).pipe(tap((userInfo: UserInfo) => {
      this.setTokenData(userInfo);
    }));
  }

  getRefreshToken(): any {
    const userInfo = this.getTokenData();
    if (userInfo) {
      return userInfo.refreshToken;
    }
    return null;
  }

  getUserRole(): any {
    const userInfo = this.getTokenData();
    if (userInfo) {
      return this.jwtHelper.decodeToken(userInfo.token).role;
    }
  }

  getAuthStatusListener(): Observable<UserInfo> {
    return this.authStatusListener.asObservable();
  }

  logout(): void {
    /* //clearTimeout(this.tokenTimer); */
    this.clearTokenData();
    this.router.navigate(['/login']);
    const userInfo = this.getTokenData();
    this.authStatusListener.next(null);
  }

  autoLoginUser(): void {
    const userInfo = this.getTokenData();
    if (userInfo) {
      if (!this.jwtHelper.isTokenExpired(userInfo.token)) {
        /* //this.setTokenTimer(this.jwtHelper.getTokenExpirationDate(userInfo.token)); */
        this.decodedToken = this.jwtHelper.decodeToken(userInfo.token);
        this.authStatusListener.next(userInfo);
      } else {
        this.logout();
      }
    } else {
      this.logout();
    }
  }

  changePassword(userChangePwd: UserChangePassword): Observable<Result> {
    return this.http.put<Result>(environment.apiURL + '/user/changePassword/' + userChangePwd.userName, userChangePwd);
  }

  private setTokenData(userInfo: UserInfo): void {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  }

  private getTokenData(): UserInfo {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (!userInfo || !userInfo?.token) {
      return;
    }

    return userInfo;
  }

  private clearTokenData(): void {
    localStorage.removeItem('userInfo');
  }
}
