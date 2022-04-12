import { LeadAttendedQuery } from './../model/report/LeadAttendedQuery';
import { LeadAttended } from './../model/report/LeadAttended';
import { LeadConversionReportQuery } from './../model/report/LeadConversionReportQuery';
import { LeadReportQuery } from './../model/report/LeadReportQuery';
import { environment } from './../../environments/environment';
import { CommonUtilService } from './../service/common-util.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, retry } from 'rxjs/operators';
import { LeadListQuery } from '../model/lead/LeadListQuery';
import { Observable } from 'rxjs/internal/Observable';
import { ECManagerLeadData } from '../model/report/ECManagerLeadData';
import { throwError } from 'rxjs';
import { KPOAgentLeadData } from '../model/report/KPOAgentLeadData';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

constructor(private http: HttpClient, private commonService: CommonUtilService) { }

  downloadLeadReport(leadListQuery: LeadListQuery): Observable<any> {
    const cheaders = {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    };

    return this.http
      .get(environment.apiURL + '/LeadReport/downloadLeadReport?' + this.commonService.toQueryString(leadListQuery),
        {responseType: 'arraybuffer', headers: cheaders, observe: 'response'})
      .pipe(retry(0), catchError(this.commonService.handleError));
  }

  // stateSourceConversionDownload
  stateSourceConversionDownload(leadListQuery: LeadListQuery): Observable<any> {
    const cheaders = {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    };

    return this.http
      .get(environment.apiURL + '/LeadReport/stateSourceConversionDownload?' + this.commonService.toQueryString(leadListQuery),
        {responseType: 'arraybuffer', headers: cheaders, observe: 'response'})
      .pipe(retry(0), catchError(this.commonService.handleError));
  }

  businessConversionLeadDownload(leadListQuery: LeadConversionReportQuery): Observable<any> {
    const cheaders = {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    };

    return this.http
      .get(environment.apiURL + '/LeadReport/businessConversionDownload?' + this.commonService.toQueryString(leadListQuery),
        {responseType: 'arraybuffer', headers: cheaders, observe: 'response'})
      .pipe(retry(0), catchError(this.commonService.handleError));
  }

  getECManagerLeadReport(leadReportQuery: LeadReportQuery): Observable<ECManagerLeadData[]> {
    return this.http
    .get<ECManagerLeadData[]>(environment.apiURL + '/leadReport/ecManagerLeadReport?' +
      this.commonService.toQueryString(leadReportQuery))
    .pipe(retry(1), catchError(this.handleError));
  }

  downloadECManagerLeadReport(leadReportQuery: LeadReportQuery): Observable<any> {
    const cheaders = {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    };

    return this.http
      .get(environment.apiURL + '/LeadReport/ecManagerLeadDownload?' + this.commonService.toQueryString(leadReportQuery),
        {responseType: 'arraybuffer', headers: cheaders, observe: 'response'})
      .pipe(retry(0), catchError(this.commonService.handleError));
  }

  getKPOAgentLeadReport(leadReportQuery: LeadReportQuery): Observable<KPOAgentLeadData[]> {
    return this.http
    .get<KPOAgentLeadData[]>(environment.apiURL + '/leadReport/kpoAgentLeadReport?' +
      this.commonService.toQueryString(leadReportQuery))
    .pipe(retry(1), catchError(this.handleError));
  }


  getLeadAttended(leadAttendedQuery: LeadAttendedQuery): Observable<LeadAttended[]> {
    return this.http
    .get<LeadAttended[]>(environment.apiURL + '/leadReport/getLeadAttended?' +
      this.commonService.toQueryString(leadAttendedQuery))
    .pipe(retry(1), catchError(this.handleError));
  }

  downloadKPOAgentLeadReport(leadReportQuery: LeadReportQuery): Observable<any> {
    const cheaders = {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    };

    return this.http
      .get(environment.apiURL + '/LeadReport/kpoAgentLeadDownload?' + this.commonService.toQueryString(leadReportQuery),
        {responseType: 'arraybuffer', headers: cheaders, observe: 'response'})
      .pipe(retry(0), catchError(this.commonService.handleError));
  }

  handleError(error: any): Observable<any> {
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

}
