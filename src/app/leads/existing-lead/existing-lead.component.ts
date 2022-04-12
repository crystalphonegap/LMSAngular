import { ExistingLead } from './../../model/lead/ExistingLead';
import { LeadService } from './../lead.service';
import { Component, ComponentFactoryResolver, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-existing-lead',
  templateUrl: './existing-lead.component.html',
  styleUrls: ['./existing-lead.component.css']
})
export class ExistingLeadComponent implements OnInit {
  existingLeads: ExistingLead[];
  constructor(private leadService: LeadService, private renderer2: Renderer2) { }

  ngOnInit(): void {

    this.leadService
      .getExistingLeadListener()
      .subscribe((data: ExistingLead[]) => {
        /* console.log('--->>>>', data); */
        /* console.log('-->>>>', data); */
        this.existingLeads = data;
      });
  }

  mouseenter(event: any): void {
    this.renderer2.addClass(event.target, 'mat-elevation-z7');
  }
  mouseleave(event: any): void {
    this.renderer2.removeClass(event.target, 'mat-elevation-z7');
  }

}
