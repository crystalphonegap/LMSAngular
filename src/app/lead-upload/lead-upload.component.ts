import { UploadExcelLog } from './../model/lead/UploadExcelLog';
import { UploadLeadLogQuery } from './../model/lead/UploadLeadLogQuery';
import { CommonUtilService } from './../service/common-util.service';
import { LeadUploadService } from './lead-upload.service';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { HttpEventType } from '@angular/common/http';
import { Result } from '../model/Result';
import { ToastrService } from 'ngx-toastr';
import { PageList } from '../model/PageList';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-lead-upload',
  templateUrl: './lead-upload.component.html',
  styleUrls: ['./lead-upload.component.css'],
})
export class LeadUploadComponent implements OnInit {
  fileName = '';
  uploadProgress: number;
  uploadSub: Subscription;
  pageList: PageList;
  uploadLeadLogQuery: UploadLeadLogQuery;
  uploadExcelLogs: UploadExcelLog[];

  constructor(
    private leadUploadService: LeadUploadService,
    private toastr: ToastrService,
    private renderer2: Renderer2,
    private commonService: CommonUtilService
  ) {}

  ngOnInit(): void {
    this.uploadProgress = 0;
    this.pageList = new PageList();
    this.uploadLeadLogQuery = new UploadLeadLogQuery();

    this.pageList.pageIndex = 0;
    this.pageList.pageSizeOptions = [5, 10, 15];
    this.pageList.pageSize = this.pageList.pageSizeOptions[0];

    this.uploadLeadLogQuery.pageSize = this.pageList.pageSize;
    this.uploadLeadLogQuery.pageNo = this.pageList.pageIndex + 1;

    this.populateUploadLogView();
  }

  onFileSelected(event): void {
    const file: File = event.files[0];

    if (file) {
      this.fileName = file.name;

      this.commonService.showOverlay();

      const formData = new FormData();
      formData.append('excelFile', file);
      const upload = this.leadUploadService.uploadLeadFromExcel(formData);

      this.uploadSub = upload.subscribe(
        (e) => {
          if (e.type === HttpEventType.UploadProgress) {
            this.uploadProgress = Math.round(100 * (e.loaded / e.total));
            /* if (this.uploadProgress === 100) {
              this.commonService.hideOverlay();
            } */
          } else if (e.type === HttpEventType.Response) {
            /* console.log('-->', e.body); */
            this.commonService.hideOverlay();
            this.populateUploadLogView();
            this.toastr.success(e.body.message);
          }
        },
        (error) => {
          this.commonService.hideOverlay();
          console.log(error);
          this.toastr.error(error);
        }
      );

      /* const upload$ = this.http.post("/api/thumbnail-upload", formData);

        upload$.subscribe(); */
    }
  }

  onFileUpload(event): void {
    const file: File = event.target.files[0];

    if (file) {
      this.fileName = file.name;
    }
  }

  cancelUpload(): void {
    if (this.uploadSub) {
      this.uploadSub.unsubscribe();
    }
    this.reset();
  }

  reset(): void {
    this.uploadProgress = 0;
    this.fileName = '';
    this.uploadSub = null;
  }

  populateUploadLogView(): void {
    this.commonService.showOverlay();
    this.leadUploadService.getUploadExcelLogList(this.uploadLeadLogQuery).subscribe((data) => {
      this.uploadExcelLogs = data.uploadExcelLogs;
      this.pageList.totalCount = data.totalLeadLogs;
      this.commonService.hideOverlay();
    }, (error) => {
      this.commonService.hideOverlay();
    });
  }

  onChangedPage(pageData: PageEvent): void {
    /* this.isLoading = true; */
    this.pageList.pageSize = pageData.pageSize;
    this.pageList.pageIndex = pageData.pageIndex;

    this.uploadLeadLogQuery.pageNo = this.pageList.pageIndex + 1;
    this.uploadLeadLogQuery.pageSize = this.pageList.pageSize;
    this.populateUploadLogView();
  }

  mouseenter(event: any): void {
    this.renderer2.addClass(event.target, 'mat-elevation-z7');
  }
  mouseleave(event: any): void {
    this.renderer2.removeClass(event.target, 'mat-elevation-z7');
  }
}
