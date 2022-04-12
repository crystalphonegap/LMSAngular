import { ProgressContainerComponent } from './../progress-container/progress-container.component';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import * as moment from 'moment';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root',
})
export class CommonUtilService {
  overlayRef: OverlayRef;

  constructor(private overlay: Overlay) {}

  handleError(error): Observable<any> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

  toQueryString(query): string {
    const parts = [];
    for (const key in query) {
      if (query.hasOwnProperty(key)) {
        const value = query[key];
        if (value != null && value !== undefined) {
          if (moment.isMoment(value)) {
            const datevalue = value.format('YYYY-MM-DD');
            parts.push(
              encodeURIComponent(key) + '=' + encodeURIComponent(datevalue)
            );
          } else {
            parts.push(
              encodeURIComponent(key) + '=' + encodeURIComponent(value)
            );
          }
        }
      }
    }

    return parts.join('&');
  }

  showOverlay(): void {
    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically(),
      hasBackdrop: true,
    });
    this.overlayRef.attach(new ComponentPortal(ProgressContainerComponent));
  }

  hideOverlay(): void {
    if (this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef.dispose();
    }
  }
}
