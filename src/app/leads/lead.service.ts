import { LeadActivity } from './../model/lead/LeadActivity';
import { LeadDetailSave } from './../model/lead/LeadDetailSave';
import { ExistingLead } from './../model/lead/ExistingLead';
import { Result } from './../model/Result';
import { LeadMasterInfo } from './../model/lead/LeadMasterInfo';
import { LeadDetail } from './../model/lead/LeadDetail';
import { LeadListQuery } from './../model/lead/LeadListQuery';
import { CommonUtilService } from './../service/common-util.service';
import { LeadListEnvelope } from './../model/lead/LeadListEnvelope';
import { environment } from './../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, retry } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeadService {

  private leadDetailListener = new BehaviorSubject<LeadDetail>(null);
  private existingLeadListener = new BehaviorSubject<ExistingLead[]>(null);
  private leadUpdatedListener = new BehaviorSubject<string>(null);
  private leadActivityListener = new BehaviorSubject<LeadActivity[]>(null);
  backButtonClicked: boolean;
  leadListQuery: LeadListQuery;

  constructor(private http: HttpClient, private commonUtilService: CommonUtilService) { }

  getLeadList(leadListQuery: LeadListQuery): Observable<LeadListEnvelope> {
    this.leadListQuery = leadListQuery;
    return this.http.get<LeadListEnvelope>(environment.apiURL + '/Lead/getLeadList?' + this.commonUtilService.toQueryString(leadListQuery))
    .pipe(retry(1), catchError(this.handleError));
  }

  getUpcomingLeadList(): Observable<LeadListEnvelope> {
    return this.http.get<LeadListEnvelope>(environment.apiURL + '/Lead/getUpcomingLeadList')
    .pipe(retry(1), catchError(this.handleError));
  }

  getLeadDetail(leadId: string): void {
    this.commonUtilService.showOverlay();
    this.http.get<LeadDetail>(environment.apiURL + '/Lead/getLeadDetail/' + leadId)
      .pipe(retry(0), catchError(this.handleError))
      .subscribe((data: LeadDetail) => {
        this.leadDetailListener.next(data);
        this.commonUtilService.hideOverlay();
      }, (error: any) => {
        console.log(error);
        this.leadDetailListener.next(null);
        this.commonUtilService.hideOverlay();
      });
  }

  getExistingLeads(leadIds: string[]): void {
    this.commonUtilService.showOverlay();
    this.http.post<ExistingLead[]>(environment.apiURL + '/Lead/getExistingLeads', leadIds)
      .pipe(retry(1), catchError(this.handleError))
      .subscribe((data: ExistingLead[]) => {
        this.existingLeadListener.next(data);
        this.commonUtilService.hideOverlay();
      }, (error: any) => {
        console.log(error);
        this.existingLeadListener.next(null);
        this.commonUtilService.hideOverlay();
      });
  }

  setLeadActivities(leadActivities: LeadActivity[]): void {
    this.leadActivityListener.next(leadActivities);
  }

  setLeadUpdated(leadId: string): void {
    this.leadUpdatedListener.next(leadId);
  }

  getLeadMasterInfo(): Observable<LeadMasterInfo> {
    return this.http.get<LeadMasterInfo>(environment.apiURL + '/Lead/getLeadMasterData?')
    .pipe(retry(1), catchError(this.handleError));
  }

  saveLeadDetail(leadDetail: LeadDetailSave): Observable<Result> {
    return this.http.put<Result>(environment.apiURL + '/Lead/saveLeadDetail/' + leadDetail.id, leadDetail)
    .pipe(retry(0), catchError(this.handleError));
  }

  uploadInvoiceFile(leadDetailId: string, invoiceFile: FormData): Observable<any> {
    return this.http.post<Result>(environment.apiURL + '/Lead/uploadInvoiceFile/' + leadDetailId, invoiceFile, {
      reportProgress: true,
      observe: 'events',
    })
    .pipe(retry(0), catchError(this.handleError));
  }

  downloadInvoiceFile(leadInvoiceFileId: string): Observable<any> {
    const cheaders = {
      'Content-Type': 'application/pdf',
      Accept: 'application/pdf'
    };

    return this.http
      .get(environment.apiURL + '/Lead/downloadInvoiceFile/' + leadInvoiceFileId,
        {responseType: 'arraybuffer', headers: cheaders, observe: 'response'})
      .pipe(retry(0), catchError(this.commonUtilService.handleError));
  }

  getLeadDetailListener(): Observable<LeadDetail> {
    return this.leadDetailListener;
  }

  getExistingLeadListener(): Observable<ExistingLead[]> {
    return this.existingLeadListener;
  }

  getLeadUpdatedListener(): Observable<string>{
    return this.leadUpdatedListener;
  }

  getleadActivityListener(): Observable<LeadActivity[]> {
    return this.leadActivityListener;
  }

  getLeadListQuery(): LeadListQuery {
    return this.leadListQuery;
  }

  setBackButtonClicked(value: boolean): void {
    this.backButtonClicked = value;
  }

  getBackButtonClicked(): boolean {
    return this.backButtonClicked;
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
