import { LeadConversionReportQuery } from './../model/report/LeadConversionReportQuery';
import { LeadConversionReport } from './../model/report/LeadConversionReport';
import { FiscalYear } from './../model/report/FiscalYear';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ExperienceCenter } from '../model/lead/ExperienceCenter';
import { CommonUtilService } from '../service/common-util.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient, private commonUtilService: CommonUtilService) {}

  getFiscalYears(): Observable<FiscalYear[]> {
    return this.http
      .get<FiscalYear[]>(environment.apiURL + '/leadReport/getFiscalYears')
      .pipe(retry(1), catchError(this.handleError));
  }

  getExperienceCenters(): Observable<ExperienceCenter[]> {
    return this.http
      .get<ExperienceCenter[]>(environment.apiURL + '/leadReport/getExperienceCenters')
      .pipe(retry(1), catchError(this.handleError));
  }

  getLeadConversionData(leadConversionReportQuery: LeadConversionReportQuery): Observable<LeadConversionReport[]> {
    return this.http
    .get<LeadConversionReport[]>(environment.apiURL + '/leadReport/leadConversionData?' +
      this.commonUtilService.toQueryString(leadConversionReportQuery))
    .pipe(retry(1), catchError(this.handleError));
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
