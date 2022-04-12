import { LeadService } from './../lead.service';
import { LeadActivity } from './../../model/lead/LeadActivity';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lead-activity',
  templateUrl: './lead-activity.component.html',
  styleUrls: ['./lead-activity.component.css']
})
export class LeadActivityComponent implements OnInit {

  leadActivities: LeadActivity[];

  constructor(private leadService: LeadService) { }

  ngOnInit(): void {
    this.leadService.getleadActivityListener().subscribe((data) => {
      this.leadActivities = data;
      /* console.log('child->', this.leadActivities); */
    });
  }

}
