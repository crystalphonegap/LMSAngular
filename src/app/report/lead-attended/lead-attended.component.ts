import { LeadAttended } from './../../model/report/LeadAttended';
import { Component, OnInit } from '@angular/core';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-lead-attended',
  templateUrl: './lead-attended.component.html',
  styleUrls: ['./lead-attended.component.css']
})
export class LeadAttendedComponent implements OnInit {

  leadAttendedList: LeadAttended[];

  constructor(private reportService: ReportService) { }

  ngOnInit(): void {
    this.reportService.getLeadAttended(null).subscribe((data) => {
      this.leadAttendedList = data;
    });
  }

}
