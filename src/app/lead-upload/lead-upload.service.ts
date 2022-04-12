import { CommonUtilService } from './../service/common-util.service';
import { UploadLeadLogQuery } from './../model/lead/UploadLeadLogQuery';
import { UploadLogEnvelope } from './../model/lead/UploadLogEnvelope';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Result } from '../model/Result';
import { catchError, finalize, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LeadUploadService {
  constructor(private http: HttpClient, private commonUtilService: CommonUtilService) {}

  uploadLeadFromExcel(formData: FormData): Observable<any> {
    return this.http.post(environment.apiURL + '/Lead/UploadLead', formData, {
      reportProgress: true,
      observe: 'events',
      })
      .pipe(retry(1), catchError(this.handleError));
  }

  getUploadExcelLogList(uploadLeadLogQuery: UploadLeadLogQuery): Observable<UploadLogEnvelope> {
    return this.http.get<UploadLogEnvelope>(environment.apiURL + '/Lead/getUploadExcelLogs?'
          + this.commonUtilService.toQueryString(uploadLeadLogQuery))
      .pipe(retry(1), catchError(this.handleError));
  }

  handleError(error: any): Observable<any> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.statusCode}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
