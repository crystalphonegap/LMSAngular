import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Result } from './../model/Result';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  errorResult: Result;
  intercept(
    req: import('@angular/common/http').HttpRequest<any>,
    next: import('@angular/common/http').HttpHandler
  ): import('rxjs').Observable<import('@angular/common/http').HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error) => {
        this.errorResult = new Result();

        /* if (error.status === 401) {
          return throwError(error.statusText);
        } */
        if (error instanceof HttpErrorResponse) {
          const applicationError = error.headers.get('Application-Error');
          if (applicationError) {
            return throwError(applicationError);
          }
          const serverError = error.error;
          let modelStateErrors = '';
          if (serverError.errors && typeof serverError.errors === 'object') {
            for (const key in serverError.errors) {
              if (serverError.errors.hasOwnProperty(key) && (key !== 'errorMessage' && key !== 'errorModel')) {
                modelStateErrors += serverError.errors[key] + '<br/>';
              } else if  (serverError.errors.hasOwnProperty(key) && key === 'errorMessage') {
                this.errorResult.errorMessage = serverError.errors[key];
              } else if  (serverError.errors.hasOwnProperty(key) && key === 'errorModel') {
                this.errorResult.errorModel = serverError.errors[key];
              }
            }
          }
          this.errorResult.message = modelStateErrors || serverError || 'Server Error';
          this.errorResult.statusCode = error.status;
          if (this.errorResult.message && typeof this.errorResult.message === 'string') {
            this.errorResult.message = this.errorResult.message.substring(0, this.errorResult.message.lastIndexOf('<br/>'));
          }
          /* return throwError(modelStateErrors || serverError || 'Server Error');
          return throwError(error.error); */
          return throwError(this.errorResult);
        }
      })
    );
  }
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
}