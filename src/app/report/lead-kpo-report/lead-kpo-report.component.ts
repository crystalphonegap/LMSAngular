import { KPOAgentLeadData } from './../../model/report/KPOAgentLeadData';
import { Result } from './../../model/Result';
import { ToastrService } from 'ngx-toastr';
import { ReportService } from './../report.service';
import { LeadReportQuery } from './../../model/report/LeadReportQuery';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CommonUtilService } from '../../service/common-util.service';

@Component({
  selector: 'app-lead-kpo-report',
  templateUrl: './lead-kpo-report.component.html',
  styleUrls: ['./lead-kpo-report.component.css']
})
export class LeadKpoReportComponent implements OnInit {

  kpoLeadDownloadFilterForm: FormGroup;
  leadReportQuery: LeadReportQuery;
  kpoAgentLeadData: KPOAgentLeadData[];

  constructor(
    private formBuilder: FormBuilder,
    private reportService: ReportService,
    private commonService: CommonUtilService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.leadReportQuery = new LeadReportQuery();
    this.createFilterForm();
  }

  createFilterForm(): void {
    this.kpoLeadDownloadFilterForm = this.formBuilder.group({
      leadFromDate: [null],
      leadUptoDate: [null],
    });
  }

  showReport(): void {
    this.leadReportQuery = new LeadReportQuery();
    // ECManagerLeadData
    Object.assign(
      this.leadReportQuery,
      this.kpoLeadDownloadFilterForm.value
    );
    this.commonService.showOverlay();
    this.reportService
      .getKPOAgentLeadReport(this.leadReportQuery)
      .subscribe(
        (data: KPOAgentLeadData[]) => {
          this.kpoAgentLeadData = data;
          // console.log(this.kpoAgentLeadData);
          this.commonService.hideOverlay();
        },
        (error: any) => {
          this.commonService.hideOverlay();
          console.log(error);
        }
      );
  }

  downloadReport(): void {
    Object.assign(this.leadReportQuery, this.kpoLeadDownloadFilterForm.value);
   /*  console.log('->', this.leadListQuery); */
    this.commonService.showOverlay();
    this.reportService.downloadKPOAgentLeadReport(this.leadReportQuery).subscribe(
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
