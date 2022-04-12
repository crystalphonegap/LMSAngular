import { LeadConversionReportQuery } from './../../model/report/LeadConversionReportQuery';
import { FiscalYear } from './../../model/report/FiscalYear';
import { DashboardService } from './../../dashboard/dashboard.service';
import { Result } from './../../model/Result';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonUtilService } from 'src/app/service/common-util.service';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-lead-conversion-report',
  templateUrl: './lead-conversion-report.component.html',
  styleUrls: ['./lead-conversion-report.component.css']
})
export class LeadConversionReportComponent implements OnInit {
  leadDownloadFilterForm: FormGroup;
  leadListQuery: LeadConversionReportQuery;
  fiscalYears: FiscalYear[];

  constructor(
    private formBuilder: FormBuilder,
    private reportService: ReportService,
    private commonService: CommonUtilService,
    private toastr: ToastrService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.leadListQuery = new LeadConversionReportQuery();
    this.createFilterForm();
    this.loadFiscalYears();
  }

  createFilterForm(): void {
    this.leadDownloadFilterForm = this.formBuilder.group({
      fiscalYearId: []
    });
  }

  loadFiscalYears(): void {
    this.dashboardService.getFiscalYears().subscribe(
      (data) => {
        this.fiscalYears = data;
      },
      (error) => {
        console.log(error);
      });
  }

  downloadReport(): void {
    Object.assign(this.leadListQuery, this.leadDownloadFilterForm.value);
    /* console.log('->', this.leadListQuery); */
    this.commonService.showOverlay();
    this.reportService.businessConversionLeadDownload(this.leadListQuery).subscribe(
      (data) => {
        const contentDispositionHeader = data.headers.get(
          'Content-Disposition'
        );
        const filename = contentDispositionHeader
          .split(';')[1]
          .trim()
          .split('=')[1]
          .replace(/"/g, '');
        /* console.log(contentDispositionHeader, '   ', filename); */
        this.downloadReportFile(data.body, filename);
        this.commonService.hideOverlay();
      },
      (error: Result) => {
        this.toastr.error(error.message);
        this.commonService.hideOverlay();
      }
    );
  }

  downloadReportFile(data: any, filename: string): void {
    const blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);

    const element = document.createElement('a');
    element.href = URL.createObjectURL(blob);
    element.download = filename;
    document.body.appendChild(element);
    element.click();

    /* window.open(url); */
  }

}
