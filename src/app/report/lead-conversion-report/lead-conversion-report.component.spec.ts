/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LeadConversionReportComponent } from './lead-conversion-report.component';

describe('LeadConversionReportComponent', () => {
  let component: LeadConversionReportComponent;
  let fixture: ComponentFixture<LeadConversionReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadConversionReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadConversionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
