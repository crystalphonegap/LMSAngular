import { AuthService } from './auth.service';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';

import { UserInfo } from './../model/user/UserInfo';
import { RefreshTokenInfo } from './../model/user/RefreshTokenInfo';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    const authRequest = this.addToken(req, token);

    return next.handle(authRequest).pipe(catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return this.handle401Error(authRequest, next);
      } else if (error instanceof HttpErrorResponse && error.status === 406) {

        const refershTokenInfo = new RefreshTokenInfo();
        refershTokenInfo.invalidRefreshToken = true;
        refershTokenInfo.errorMessage = 'Session Expired: User logged in to different device';

        /* this.authService.setInvalidRefreshToken(refershTokenInfo);
        this.authService.logout(); */
        return throwError(error);
      } else {
        return throwError(error);
      }
    }));

  }

  private addToken(request: HttpRequest<any>, token: string): any {
    return request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + token),
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.setRefreshToken().pipe(
        switchMap((userInfo: UserInfo) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(userInfo.token);
          return next.handle(this.addToken(request, userInfo.token));
        }));

    } else {
      return this.refreshTokenSubject.pipe(
        filter(userInfo => userInfo != null),
        take(2),
        switchMap(userInfo => {
          return next.handle(this.addToken(request, userInfo.token));
        }));
    }
  }
}
