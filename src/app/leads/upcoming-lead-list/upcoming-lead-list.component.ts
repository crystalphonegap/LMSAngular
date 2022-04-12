import { LeadListView } from './../../model/lead/LeadListView';
import { PageList } from './../../model/PageList';
import { LeadService } from './../lead.service';
import { CommonUtilService } from './../../service/common-util.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-upcoming-lead-list',
  templateUrl: './upcoming-lead-list.component.html',
  styleUrls: ['./upcoming-lead-list.component.css']
})
export class UpcomingLeadListComponent implements OnInit {

  pageList: PageList;
  leadList: LeadListView[];

  constructor(private commonService: CommonUtilService, private leadService: LeadService) { }

  ngOnInit(): void {
    this.pageList = new PageList();
    this.populateLeadListView();
  }


  populateLeadListView(): void {
    //  this.commonService.showOverlay();
    this.leadService.getUpcomingLeadList().subscribe((data) => {
      this.leadList = data.leadListViewDto;
      this.pageList.totalCount = data.totalLeads;
      this.commonService.hideOverlay();
    }, (error) => {
      this.commonService.hideOverlay();
    });
  }
}
