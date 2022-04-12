import { ToastrService } from 'ngx-toastr';
import { Result } from './../../model/Result';
import { CommonUtilService } from './../../service/common-util.service';
import { LeadListQuery } from './../../model/lead/LeadListQuery';
import { ReportService } from './../report.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lead-download',
  templateUrl: './lead-download.component.html',
  styleUrls: ['./lead-download.component.css'],
})
export class LeadDownloadComponent implements OnInit {
  leadDownloadFilterForm: FormGroup;
  leadListQuery: LeadListQuery;

  constructor(
    private formBuilder: FormBuilder,
    private reportService: ReportService,
    private commonService: CommonUtilService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.leadListQuery = new LeadListQuery();
    this.createFilterForm();
  }

  createFilterForm(): void {
    this.leadDownloadFilterForm = this.formBuilder.group({
      leadFromDate: [null],
      leadUptoDate: [null],
    });
  }

  downloadReport(): void {
    Object.assign(this.leadListQuery, this.leadDownloadFilterForm.value);
    /* console.log('->', this.leadListQuery); */
    this.commonService.showOverlay();
    this.reportService.downloadLeadReport(this.leadListQuery).subscribe(
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
