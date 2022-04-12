import { CommonUtilService } from './../../service/common-util.service';
import { LeadConversionReportQuery } from './../../model/report/LeadConversionReportQuery';
import { ExperienceCenter } from './../../model/lead/ExperienceCenter';
import { FiscalYear } from './../../model/report/FiscalYear';
import { DashboardService } from './../dashboard.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LeadConversionReport } from '../../model/report/LeadConversionReport';

@Component({
  selector: 'app-lead-conversion',
  templateUrl: './lead-conversion.component.html',
  styleUrls: ['./lead-conversion.component.css'],
})
export class LeadConversionComponent implements OnInit {
  leadConversionForm: FormGroup;
  fiscalYears: FiscalYear[];
  experienceCenters: ExperienceCenter[];
  leadConversionReportQuery: LeadConversionReportQuery;
  leadConversionData: LeadConversionReport[];

  constructor(
    private dashboardService: DashboardService,
    private formbuilder: FormBuilder,
    private commonService: CommonUtilService
  ) {}

  ngOnInit(): void {
    this.createLeadConversionForm();
    this.loadFiscalYears();
  }

  createLeadConversionForm(): void {
    this.leadConversionForm = this.formbuilder.group({
      fiscalYearId: [],
      experienceCenterId: [],
    });
  }

  loadFiscalYears(): void {
    this.dashboardService.getFiscalYears().subscribe(
      (data) => {
        this.fiscalYears = data;
      },
      (error) => {
        console.log(error);
      },
      () => {
        if (this.fiscalYears) {
          this.leadConversionForm.patchValue({
            fiscalYearId: this.fiscalYears[0].id,
          });
          this.loadExperienceCenter();
        }
      }
    );
  }

  loadExperienceCenter(): void {
    this.dashboardService.getExperienceCenters().subscribe(
      (data) => {
        this.experienceCenters = data;
        console.log(data)
      },
      (error) => {
        console.log(error);
      },
      () => {
        if (this.experienceCenters) {
          this.leadConversionForm.patchValue({
            experienceCenterId: this.experienceCenters[0].experienceCenterId,
          });
          this.showLeadConversion();
        }
      }
    );
  }

  showLeadConversion(): void {
    this.leadConversionReportQuery = new LeadConversionReportQuery();
    Object.assign(
      this.leadConversionReportQuery,
      this.leadConversionForm.value
    );
    this.commonService.showOverlay();
    this.dashboardService
      .getLeadConversionData(this.leadConversionReportQuery)
      .subscribe(
        (data) => {
          this.leadConversionData = data;
          this.commonService.hideOverlay();
        },
        (error) => {
          this.commonService.hideOverlay();
          console.log(error);
        }
      );
  }
}
