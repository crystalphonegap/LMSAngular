/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LeadAttendedComponent } from './lead-attended.component';

describe('LeadAttendedComponent', () => {
  let component: LeadAttendedComponent;
  let fixture: ComponentFixture<LeadAttendedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadAttendedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadAttendedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
