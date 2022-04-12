import { LeadService } from './lead.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.css']
})
export class LeadsComponent implements OnInit {
  isUpcomingLeadParam: boolean;
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      if (params.get('isUpcomingLeads') === 'true') {
        this.isUpcomingLeadParam = true;
      }
    });
  }

}
