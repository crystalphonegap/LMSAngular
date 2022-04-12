import { LeadAttendedComponent } from './report/lead-attended/lead-attended.component';
import { LeadSourceReportComponent } from './report/lead-source-report/lead-source-report.component';
import { LeadEcReportComponent } from './report/lead-ec-report/lead-ec-report.component';
import { LeadConversionComponent } from './dashboard/lead-conversion/lead-conversion.component';

import { ErrorInterceptorProvider } from './helper/error.interceptor';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainComponent } from './main/main.component';
import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AngularMaterialModule } from './angular.material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { AvatarModule } from 'ngx-avatar';

import { AuthInterceptor } from './auth/auth.interceptor';
import { LoginComponent } from './auth/login/login.component';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LeadsComponent } from './leads/leads.component';
import { LeadListComponent } from './leads/lead-list/lead-list.component';
import { ExistingLeadComponent } from './leads/existing-lead/existing-lead.component';
import { LeadDetailComponent } from './leads/lead-detail/lead-detail.component';
import { LeadActivityComponent } from './leads/lead-activity/lead-activity.component';
import { ProgressContainerComponent } from './progress-container/progress-container.component';
import { UpcomingLeadListComponent } from './leads/upcoming-lead-list/upcoming-lead-list.component';
import { LeadUploadComponent } from './lead-upload/lead-upload.component';
import { ReportComponent } from './report/report.component';
import { LeadDownloadComponent } from './report/lead-download/lead-download.component';
import { LeadKpoReportComponent } from './report/lead-kpo-report/lead-kpo-report.component';
import { LeadConversionReportComponent } from './report/lead-conversion-report/lead-conversion-report.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LoginComponent,
    ChangePasswordComponent,
      DashboardComponent,
      LeadsComponent,
      LeadListComponent,
      LeadDetailComponent,
      ProgressContainerComponent,
      UpcomingLeadListComponent,
      LeadUploadComponent,
      ReportComponent,
      LeadDownloadComponent,
      ExistingLeadComponent,
      LeadActivityComponent,
      LeadConversionComponent,
      LeadEcReportComponent,
      LeadKpoReportComponent,
      LeadSourceReportComponent,
      LeadConversionReportComponent,
      LeadAttendedComponent
   ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    LayoutModule,
    AngularMaterialModule,
    HttpClientModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      timeOut: 5000,
      enableHtml: true
    }),
    AvatarModule
  ],
  providers: [
    ErrorInterceptorProvider,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
