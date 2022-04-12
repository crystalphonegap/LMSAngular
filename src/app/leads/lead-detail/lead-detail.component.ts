import { Role } from './../../model/user/Role';
import { LeadDetailSave } from './../../model/lead/LeadDetailSave';
import { ExistingLeadComponent } from './../existing-lead/existing-lead.component';
import { AuthService } from './../../auth/auth.service';
import { CommonUtilService } from './../../service/common-util.service';
import { Result } from './../../model/Result';
import { ExperienceCenterState } from './../../model/lead/ExperienceCenterState';
import { LeadMasterInfo } from './../../model/lead/LeadMasterInfo';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LeadDetail } from './../../model/lead/LeadDetail';
import { LeadService } from '../lead.service';
import { ToastrService } from 'ngx-toastr';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSelectChange } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { formatDate } from '@angular/common';
import * as moment from 'moment';
import { LeadContactDetail } from 'src/app/model/lead/LeadContactDetail';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-lead-detail',
  templateUrl: './lead-detail.component.html',
  styleUrls: ['./lead-detail.component.css'],
})
export class LeadDetailComponent implements OnInit, OnDestroy {

  @ViewChild('invoiceFile') invoiceFile: ElementRef;

  private leadDetailSubscription: Subscription;
  leadDetail: LeadDetail;
  leadDetailSave: LeadDetailSave;
  leadDetailForm: FormGroup;
  leadMasterInfo: LeadMasterInfo;
  experienceCenterStates: ExperienceCenterState[];
  isCallerReminderOn: boolean;
  isECReminderOn: boolean;
  isReadOnly: boolean;
  existingLeads: number;
  isToShowConvertedLeadsValue: boolean;
  isLeadConverted: boolean;
  isToShowLeadInvoiceFiles: boolean;
  fileName: string;
  invoiceFormData: FormData;
  uploadSub: Subscription;

  constructor(
    private leadService: LeadService,
    private formbuilder: FormBuilder,
    private toastr: ToastrService,
    private commonService: CommonUtilService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.leadMasterInfo = new LeadMasterInfo();
    this.leadDetail = new LeadDetail();
    this.leadDetailSave = new LeadDetailSave();

    /* console.log('-->', this.authService.getUserRole()); */
    if (this.authService.getUserRole() === 'ECManager') {
      this.isReadOnly = true;
    }

    this.createLeadDetailForm();
    this.getMasterDataAndBind();

    /* this.leadDetailForm.get('ecLeadReminder').setValue(new Date()); */
    this.leadDetailSubscription = this.leadService
      .getLeadDetailListener()
      .subscribe((data: LeadDetail) => {
        /* console.log('--->>>>', data); */
        this.existingLeads = 0;
        if (data) {
          console.log(data);
          this.leadDetail = data;
          this.loadLeadActivities();
          if (this.leadDetail.existingLeadIds) {
            this.existingLeads = this.leadDetail.existingLeadIds.length;
            if (this.existingLeads > 0) {
              this.commonService.hideOverlay();
              this.loadExistingleads();
            }
          }
          this.patchValueToForm();
          this.resetFileUploader();
          /* this.setExperienceCenter(this.leadDetail.state); */
        } else {
          this.leadDetail = new LeadDetail();
          this.patchValueToForm();
        }
      });
  }

  callerRemindertoggle(event: MatSlideToggleChange): void {
    /* console.log('toggle', event.checked); */
    if (event.checked === false) {
      this.leadDetailSave.callerRemindAt = null;
      this.leadDetailForm.markAsDirty();
    }
    this.isCallerReminderOn = event.checked;
  }

  ecRemindertoggle(event: MatSlideToggleChange): void {
    /* console.log('toggle', event.checked); */
    if (event.checked === false) {
      this.leadDetailSave.ecRemindAt = null;
      this.leadDetailForm.markAsDirty();
    }
    this.isECReminderOn = event.checked;
  }

  callerReminderChange(event: MatSelectChange): void {
    if (moment.isMoment(event)) {
      this.isCallerReminderOn = true;
      this.leadDetailSave.callerRemindAt = event.toDate();
    } else {
      this.isCallerReminderOn = false;
      this.leadDetailSave.callerRemindAt = null;
    }
  }

  ecReminderChange(event: MatSelectChange): void {
    if (moment.isMoment(event)) {
      this.isECReminderOn = true;
      this.leadDetailSave.ecRemindAt = event.toDate();
    } else {
      this.isECReminderOn = false;
      this.leadDetailSave.ecRemindAt = null;
    }
  }

  callerReminderTextChange(event): void {
    if (moment.isMoment(event.target.value)) {
      this.isCallerReminderOn = true;
    } else {
      this.isCallerReminderOn = false;
    }
  }

  ecReminderTextChange(event): void {
    if (moment.isMoment(event.target.value)) {
      this.isECReminderOn = true;
    } else {
      this.isECReminderOn = false;
    }
  }


  patchValueToForm(): void {
    let primaryLeadContact;
    let secondaryLeadContact;
    this.leadDetailForm.markAsPristine();
    this.leadDetailForm.patchValue({
      /* emailAddressPrimary: this.leadDetail.leadContactDetails[0].emailAddress,
      mobileNumberPrimary: this.leadDetail.leadContactDetails[0].mobileNumber, */
      contactPersonName: this.leadDetail.contactPersonName,
      city: this.leadDetail.city,
      state: this.leadDetail.state,
      address: this.leadDetail.address,
      subject: this.leadDetail.subject,
      description: this.leadDetail.description,
      leadCallingStatusId: this.leadDetail.leadCallingStatusId,
      leadClassificationId: this.leadDetail.leadClassificationId,
      leadEnquiryTypeId: this.leadDetail.leadEnquiryTypeId,
      leadStatusId: this.leadDetail.leadStatusId,
      leadSpaceTypeId: this.leadDetail.leadSpaceTypeId,
      company: this.leadDetail.company,
      assignedToECId: this.leadDetail.assignedToECId,
      callerRemarks: this.leadDetail.callerRemarks,
      ecRemarks: this.leadDetail.ecRemarks,
      /* leadReminderOptionId: this.leadDetail.leadReminder?.leadReminderOptionId, */
      leadValueINR: this.leadDetail.leadValueINR,
      volumeInSquareFeet: this.leadDetail.volumeInSquareFeet,
      dealerCode: this.leadDetail.dealerCode,
      dealerName: this.leadDetail.dealerName,
      leadConversion: this.leadDetail.leadConversion,
      futureRequirement: this.leadDetail.futureRequirement,
      futureRequirementTileSegment: this.leadDetail.futureRequirementTileSegment,
      futureRequirementVolume: this.leadDetail.futureRequirementVolume,
      quantityInSquareFeet: this.leadDetail.quantityInSquareFeet,
      callerLeadReminder: this.leadDetail.callerLeadReminder?.remindAt,
      ecLeadReminder: this.leadDetail.ecLeadReminder?.remindAt
      /*  */
    });

    if (this.leadDetail.assignedAtToEC) {
      this.leadDetailForm.patchValue({
        assignedAtToEC: formatDate(this.leadDetail.assignedAtToEC, 'd/M/yyyy HH:mm:ss', 'en')
      });
    } else {
      this.leadDetailForm.patchValue({
        assignedAtToEC: [null]
      });
    }

    if (this.leadDetail.callerLeadReminder) {
      this.isCallerReminderOn = true;
    } else {
      this.isCallerReminderOn = false;
    }

    if (this.leadDetail.ecLeadReminder) {
      this.isECReminderOn = true;
    } else {
      this.isECReminderOn = false;
    }

    if (this.leadDetail.leadStatusId === 5) {
      this.isToShowConvertedLeadsValue = true;
    } else {
      this.isToShowConvertedLeadsValue = false;
    }

    this.isToShowLeadInvoiceFiles = false;
    if (this.leadDetail.leadInvoiceFileDetails && this.leadDetail.leadInvoiceFileDetails.length > 0) {
      this.isToShowLeadInvoiceFiles = true;
    }

    if (this.leadDetail.leadContactDetails) {
      primaryLeadContact = this.leadDetail.leadContactDetails.filter(x => x.contactType === 'Primary');
      secondaryLeadContact = this.leadDetail.leadContactDetails.filter(x => x.contactType === 'Secondary');
    }
    if (primaryLeadContact  && primaryLeadContact.length > 0) {
      this.leadDetailForm.patchValue({
        emailAddressPrimary: primaryLeadContact[0].emailAddress,
        mobileNumberPrimary: primaryLeadContact[0].mobileNumber,
      });
    } else {
      this.leadDetailForm.patchValue({
        emailAddressPrimary: null,
        mobileNumberPrimary: null,
      });
    }

    if (secondaryLeadContact && secondaryLeadContact.length > 0) {
      this.leadDetailForm.patchValue({
        emailAddressSecondary: secondaryLeadContact[0].emailAddress,
        mobileNumberSecondary: secondaryLeadContact[0].mobileNumber,
      });
    } else {
      this.leadDetailForm.patchValue({
        emailAddressSecondary: null,
        mobileNumberSecondary: null,
      });
    }

    this.isLeadConverted = false;
    if (this.leadDetail.leadStatusId === 5) {
      this.isLeadConverted = true;
    }

    if (this.authService.getUserRole() === Role.Admin) {
      this.isLeadConverted = false;
    }
  }

  onFileUpload(event): void {
    const file: File = event.target.files[0];
    this.leadDetailForm.markAsDirty();
    if (this.uploadSub) {
      this.uploadSub.unsubscribe();
    }

    if (file) {
      this.fileName = file.name;
      this.invoiceFormData = new FormData();
      this.invoiceFormData.append('invoiceFile', file);
    } else {
      event.target.files = null;
    }
  }

  resetFileUploader(): void {
    this.fileName = null;
    // this.invoiceFile.nativeElement.value = null;
    this.invoiceFormData = new FormData();
    if (this.uploadSub) {
      this.uploadSub.unsubscribe();
    }
  }


  setExperienceCenter(stateName: string): void {
    /*  this.experienceCenterStates = this.leadMasterInfo.experienceCenterStates; */
    /* .filter(x => x.stateName === stateName); */
    /* this.leadDetailForm.patchValue({
      assignedToECId: this.leadDetail.assignedToECId
    }); */
  }

  onLeadFileClick(leadFileId: string): void {
    this.leadService.downloadInvoiceFile(leadFileId).subscribe(
      (data) => {
        const contentDispositionHeader = data.headers.get(
          'Content-Disposition'
        );
        const filename = contentDispositionHeader
          .split(';')[1]
          .trim()
          .split('=')[1]
          .replace(/"/g, '');
        /* console.log(contentDispositionHeader, '   ', filename); */
        this.downloadReportFile(data.body, filename);
        this.commonService.hideOverlay();
      },
      (error: Result) => {
        this.toastr.error(error.message);
        this.commonService.hideOverlay();
      }
    );
  }

  createLeadDetailForm(): void {
    this.leadDetailForm = this.formbuilder.group({
      contactPersonName: ['', [Validators.required]],
      emailAddressPrimary: [''],
      mobileNumberPrimary: [''],
      emailAddressSecondary: [''],
      mobileNumberSecondary: [''],
      city: [''],
      state: [null],
      address: [''],
      company: [''],
      subject: [''],
      description: [''],
      leadCallingStatusId: [null],
      leadClassificationId: [null],
      leadEnquiryTypeId: [null],
      leadSpaceTypeId: [null],
      leadStatusId: [null],
      assignedToECId: [null],
      calledById: [null],
      quantityInSquareFeet: [null],
      callerRemarks: [null],
      ecRemarks: [null],
      leadConversion: [null],
      dealerName: [null],
      dealerCode: [null],
      leadValueINR: [null],
      volumeInSquareFeet: [null],
      futureRequirement: [null],
      futureRequirementTileSegment: [null],
      futureRequirementVolume: [null],
      assignToSalesPersonId: [null],
      /* leadReminderOptionId: [{disabled: true}], */
      assignedAtToEC: [null],
      ecLeadReminder: [{disabled: true}],
      callerLeadReminder: [{disabled: true}],
      invoiceFile: [null]
    });
  }

  getMasterDataAndBind(): void {
    this.leadService.getLeadMasterInfo().subscribe(
      (data) => {
        this.leadMasterInfo = data;
        /* console.log(data); */
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ngOnDestroy(): void {
    this.leadDetailSubscription.unsubscribe();
  }

  onStateChange(event: any): void {
    this.setExperienceCenter(event.value);
  }

  loadExistingleads(): void {
    this.leadService.getExistingLeads(this.leadDetail.existingLeadIds);
  }

  loadLeadActivities(): void {
    this.leadService.setLeadActivities(this.leadDetail.leadActivities);
  }

  onLeadStatusChange(event): void {
    this.isToShowConvertedLeadsValue = false;
    if (event.value === 5) {
      this.isToShowConvertedLeadsValue = true;
    }
  }

  saveLeadInfo(): void {
    /* console.log(this.leadDetailForm.value); */

    this.leadDetailSave = Object.assign(
      this.leadDetailSave,
      this.leadDetailForm.getRawValue()
    );

    if (this.leadDetailForm.get('leadStatusId').dirty && this.leadDetailSave.leadStatusId === 5) {
      let isValidateError = false;
      if (this.leadDetailSave.leadConversion == null) {
        this.leadDetailForm.get('leadConversion').setErrors({required: true});
        isValidateError = true;
      }
      if (this.leadDetailSave.dealerName == null) {
        this.leadDetailForm.get('dealerName').setErrors({required: true});
        isValidateError = true;
      }
      if (this.leadDetailSave.leadValueINR == null) {
        this.leadDetailForm.get('leadValueINR').setErrors({required: true});
        isValidateError = true;
      }
      if (!this.leadDetailSave.ecRemarks || this.leadDetailSave.ecRemarks.trim().length === 0) {
          this.leadDetailForm.get('ecRemarks').setErrors({required: true});
          isValidateError = true;
      }

      if (isValidateError) {
        return;
      }
    } else {
      this.leadDetailForm.get('leadConversion').setErrors(null);
      this.leadDetailForm.get('dealerName').setErrors(null);
      this.leadDetailForm.get('leadValueINR').setErrors(null);
    }

    console.log(this.leadDetailSave.leadClassificationId);

    if (this.leadDetailForm.get('leadCallingStatusId').dirty && this.leadDetailSave.leadCallingStatusId === 2
    && !this.leadDetailSave.leadClassificationId) {
      this.leadDetailForm.get('leadClassificationId').setErrors({required: true});
    } else {
      this.leadDetailForm.get('leadClassificationId').setErrors(null);
    }

    /* if (this.leadDetailForm.get('leadClassificationId').dirty && this.leadDetailSave.leadCallingStatusId === 2
    && !this.leadDetailSave.leadClassificationId) {
      this.leadDetailForm.get('leadClassificationId').setErrors({required: true});
    } else {
      this.leadDetailForm.get('leadClassificationId').setErrors(null);
    } */

    if (this.leadDetailForm.get('leadCallingStatusId').dirty && this.leadDetailSave.leadCallingStatusId > 0
    && (!this.leadDetailSave.callerRemarks || this.leadDetailSave.callerRemarks.trim().length === 0)) {
      this.leadDetailForm.get('callerRemarks').setErrors({required: true});
    } else {
      this.leadDetailForm.get('callerRemarks').setErrors(null);
    }

    if (this.leadDetailForm.get('leadStatusId').dirty && this.leadDetailSave.leadStatusId > 0
    && (!this.leadDetailSave.ecRemarks || this.leadDetailSave.ecRemarks.trim().length === 0)) {
      this.leadDetailForm.get('ecRemarks').setErrors({required: true});
    } else {
      this.leadDetailForm.get('ecRemarks').setErrors(null);
    }

    this.leadDetailSave.leadContactDetails = this.leadDetail.leadContactDetails;

    const primaryLeadContact = this.leadDetailSave.leadContactDetails.filter(x => x.contactType === 'Primary');
    const secondaryLeadContact = this.leadDetailSave.leadContactDetails.filter(x => x.contactType === 'Secondary');

    primaryLeadContact[0].emailAddress = this.leadDetailForm.get('emailAddressPrimary').value;
    primaryLeadContact[0].mobileNumber = this.leadDetailForm.get('mobileNumberPrimary').value;

    if (secondaryLeadContact[0]) {
      secondaryLeadContact[0].emailAddress = this.leadDetailForm.get('emailAddressSecondary').value;
      secondaryLeadContact[0].mobileNumber = this.leadDetailForm.get('mobileNumberSecondary').value;
    } else if (this.leadDetailForm.get('emailAddressSecondary').value || this.leadDetailForm.get('mobileNumberSecondary').value) {
      const newSecondaryLeadContact = new LeadContactDetail();
      newSecondaryLeadContact.contactType = 'Secondary';
      newSecondaryLeadContact.emailAddress = this.leadDetailForm.get('emailAddressSecondary').value;
      newSecondaryLeadContact.mobileNumber = this.leadDetailForm.get('mobileNumberSecondary').value;
      this.leadDetailSave.leadContactDetails.push(newSecondaryLeadContact);
    }

    if (!this.leadDetailForm.valid) {
      return;
    }

    this.commonService.showOverlay();
    this.leadDetailSave.isCallerReminderOn = this.isCallerReminderOn;
    this.leadDetailSave.isECReminderOn = this.isECReminderOn;
    this.leadDetailSave.id = this.leadDetail.id;

    console.log('invoice', this.invoiceFormData.get('invoiceFile'));

    this.leadService.saveLeadDetail(this.leadDetailSave).subscribe(
      (result: Result) => {
        if (result.statusCode === 200) {
          this.toastr.success(result.message);
          if (this.invoiceFormData.get('invoiceFile')) {
            this.uploadInvoiceFile();
          }
          else {
            this.commonService.hideOverlay();
            this.leadService.getLeadDetail(this.leadDetail.id);
            this.leadService.setLeadUpdated(this.leadDetail.id);
          }
        }
        this.commonService.hideOverlay();
      },
      (error: Result) => {
        /* this.hideOverlay();
      this.errorResult.message = error.message; */
        /* console.log(error); */
        this.commonService.hideOverlay();
        this.toastr.error(error.message);
      }
    );
  }

  uploadInvoiceFile(): void {
    const upload = this.leadService.uploadInvoiceFile(this.leadDetailSave.id, this.invoiceFormData);
    this.uploadSub = upload.subscribe(
      (e) => {
        if (e.type === HttpEventType.UploadProgress) {
          // this.uploadProgress = Math.round(100 * (e.loaded / e.total));
          /* if (this.uploadProgress === 100) {
            this.commonService.hideOverlay();
          } */
        } else if (e.type === HttpEventType.Response) {
          /* console.log('-->', e.body); */
          this.leadService.getLeadDetail(this.leadDetail.id);
          this.leadService.setLeadUpdated(this.leadDetail.id);
          this.commonService.hideOverlay();
        }
      },
      (error) => {
        this.commonService.hideOverlay();
        console.log(error);
        this.toastr.error(error);
      }
    );
  }

  downloadReportFile(data: any, filename: string): void {
    const blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);

    const element = document.createElement('a');
    element.href = URL.createObjectURL(blob);
    element.download = filename;
    document.body.appendChild(element);
    element.click();

    /* window.open(url); */
  }
}
