import { CustomPaginator } from './../../helper/custom-paginator';
import { Role } from './../../model/user/Role';
import { AuthService } from './../../auth/auth.service';
import { KeyValuePair } from './../../model/KeyValuePair';
import { CommonUtilService } from './../../service/common-util.service';
import { LeadMasterInfo } from './../../model/lead/LeadMasterInfo';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import { LeadListView } from './../../model/lead/LeadListView';
import { PageList } from './../../model/PageList';
import { LeadListQuery } from './../../model/lead/LeadListQuery';
import { LeadService } from './../lead.service';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lead-list',
  templateUrl: './lead-list.component.html',
  styleUrls: ['./lead-list.component.css'],
  providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginator}]
})


export class LeadListComponent implements OnInit, OnDestroy {

  @Input() isUpcomingLeadParam: boolean;

  private leadUpdatedSubscription: Subscription;
  leadListQuery: LeadListQuery;
  pageList: PageList;
  leadList: LeadListView[];
  selectedLeadId: string;
  leadFilterForm: FormGroup;
  leadMasterInfo: LeadMasterInfo;
  leadAttended: KeyValuePair[];
  leadStatuses: KeyValuePair[];
  leadSources: KeyValuePair[];
  isUpcomingLeads: boolean;
  userRole: string;
  selectedLead: LeadListView;

  constructor(
    private leadService: LeadService,
    private renderer2: Renderer2,
    private formbuilder: FormBuilder,
    private commonService: CommonUtilService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isUpcomingLeads = this.isUpcomingLeadParam;

    this.pageList = new PageList();
    this.leadListQuery = new LeadListQuery();

    this.pageList.pageIndex = 0;
    this.pageList.pageSizeOptions = [25, 50, 100];
    this.pageList.pageSize = this.pageList.pageSizeOptions[0];

    this.leadListQuery.pageSize = this.pageList.pageSize;
    this.leadListQuery.pageNo = this.pageList.pageIndex + 1;

    this.leadAttended = [{id: 1, value: 'Attended'}, {id: -1, value: 'Unattended'}];
    this.leadStatuses = [{id: 1, value: 'Open'}, {id: 2, value: 'Closed'}];

    this.leadMasterInfo = new LeadMasterInfo();
    this.getMasterDataAndBind();

    this.createLeadFilterForm();
    this.populateLeadListView();
    this.userRole = this.authService.getUserRole();

    this.leadUpdatedSubscription = this.leadService
      .getLeadUpdatedListener()
      .subscribe((data: string) => {
        if (this.leadList && this.leadList.length > 0) {
          if (this.authService.getUserRole() === Role.KPOAgent) {
            this.leadList.find(x => x.id === data).isLeadUpdated = 1;
          }
          else if (this.authService.getUserRole() === Role.ECManager) {
            this.leadList.find(x => x.id === data).isLeadUpdated = 2;
          }
        }
      });
  }

  createLeadFilterForm(): void {
    this.leadFilterForm = this.formbuilder.group({
      leadFromDate: [null],
      leadUptoDate: [null],
      leadCallingStatusId: [],
      leadSource: [],
      leadAttendedId: [],
      leadClassificationId: [],
      experienceCenterId: [],
      stateName: [],
      leadStatusId: [],
      contactPersonName: [],
      leadContactNo: [],
      leadECStatusId: []
    });
  }

  toggle(event: MatSlideToggleChange): void {
    this.isUpcomingLeads = event.checked;
  }

  populateLeadListView(): void {
    this.commonService.showOverlay();
    this.leadListQuery.isUpcomingLeads = this.isUpcomingLeads;
    this.leadService.getLeadList(this.leadListQuery).subscribe((data) => {
      this.leadList = data.leadListViewDto;
      this.pageList.totalCount = data.totalLeads;
      this.commonService.hideOverlay();
      if (this.leadList && this.leadList.length > 0) {
        this.selectedLeadId = this.leadList[0].id;
        this.selectedLead = this.leadList[0];
        this.leadService.getLeadDetail(this.selectedLeadId);
      } else {
        this.leadService.getLeadDetail('00000000-0000-0000-0000-000000000000');
      }
    }, (error) => {
      this.commonService.hideOverlay();
    });
  }

  onLeadClick(leadId: string): void {
    /* console.log('-->', leadId); */
    this.selectedLeadId = leadId;
    this.selectedLead = this.leadList.find(x => x.id === leadId);
    this.leadService.getLeadDetail(
      leadId
    ); /* .subscribe((data) => {
      console.log(data);
    }, (error) => {
      console.log(error);
    }); */
  }

  getMasterDataAndBind(): void {
    this.leadService.getLeadMasterInfo()
      .subscribe((data) => {
        this.leadMasterInfo = data;
        /* console.log(data); */
    }, (error) => {
      console.log(error);
    });
  }

  resetFilter(): void {
    this.pageList.pageIndex = 0;
    this.pageList.pageSizeOptions = [25, 50, 100];
    this.pageList.pageSize = this.pageList.pageSizeOptions[0];

    this.leadListQuery = new LeadListQuery();

    this.leadListQuery.pageSize = this.pageList.pageSize;
    this.leadListQuery.pageNo = this.pageList.pageIndex + 1;

    this.isUpcomingLeads = false;

    this.leadFilterForm.reset();
    this.isUpcomingLeads = null;
    this.leadListQuery.isUpcomingLeads = null;
    this.populateLeadListView();
  }

  applyFilter(): void {
    this.leadListQuery.pageNo = 1;
    this.leadListQuery.pageSize = this.pageList.pageSize;

    this.pageList.pageSize = this.pageList.pageSize;
    this.pageList.pageIndex = this.leadListQuery.pageNo - 1;

    Object.assign(this.leadListQuery, this.leadFilterForm.value);

    for (const attrib in this.leadListQuery) {
      if (this.leadListQuery[attrib] == null || this.leadListQuery[attrib] === '0') {
        delete this.leadListQuery[attrib];
      }
    }
    /* console.log(this.leadListQuery); */
    this.populateLeadListView();
  }

  onChangedPage(pageData: PageEvent): void {
    /* this.isLoading = true; */
    this.pageList.pageSize = pageData.pageSize;
    this.pageList.pageIndex = pageData.pageIndex;

    this.leadListQuery.pageNo = this.pageList.pageIndex + 1;
    this.leadListQuery.pageSize = this.pageList.pageSize;
    this.populateLeadListView();
  }

  mouseenter(event: any): void {
    this.renderer2.addClass(event.target, 'mat-elevation-z7');
  }
  mouseleave(event: any): void {
    this.renderer2.removeClass(event.target, 'mat-elevation-z7');
  }

  ngOnDestroy(): void {
    this.leadUpdatedSubscription.unsubscribe();
  }
}
