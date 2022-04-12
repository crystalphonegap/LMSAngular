import { AuthService } from './../../auth/auth.service';
import { ECManagerLeadData } from './../../model/report/ECManagerLeadData';
import { LeadReportQuery } from './../../model/report/LeadReportQuery';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Result } from 'src/app/model/Result';
import { CommonUtilService } from 'src/app/service/common-util.service';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-lead-ec-report',
  templateUrl: './lead-ec-report.component.html',
  styleUrls: ['./lead-ec-report.component.css']
})
export class LeadEcReportComponent implements OnInit {

  ecLeadDownloadFilterForm: FormGroup;
  leadReportQuery: LeadReportQuery;
  ecManagerLeadData: ECManagerLeadData[];
  userRole: string;

  constructor(
    private formBuilder: FormBuilder,
    private reportService: ReportService,
    private commonService: CommonUtilService,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.leadReportQuery = new LeadReportQuery();
    this.createFilterForm();
    this.userRole = this.authService.getUserRole();
  }

  createFilterForm(): void {
    this.ecLeadDownloadFilterForm = this.formBuilder.group({
      leadFromDate: [null],
      leadUptoDate: [null],
    });
  }

  showReport(): void {
    this.leadReportQuery = new LeadReportQuery();
    // ECManagerLeadData
    Object.assign(
      this.leadReportQuery,
      this.ecLeadDownloadFilterForm.value
    );
    this.commonService.showOverlay();
    this.reportService
      .getECManagerLeadReport(this.leadReportQuery)
      .subscribe(
        (data: ECManagerLeadData[]) => {
          this.ecManagerLeadData = data;
          // console.log(this.ecManagerLeadData);
          this.commonService.hideOverlay();
        },
        (error: any) => {
          this.commonService.hideOverlay();
          console.log(error);
        }
      );
  }

  downloadReport(): void {
    Object.assign(this.leadReportQuery, this.ecLeadDownloadFilterForm.value);
   /*  console.log('->', this.leadListQuery); */
    this.commonService.showOverlay();
    this.reportService.downloadECManagerLeadReport(this.leadReportQuery).subscribe(
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
