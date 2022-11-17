import { LeadInvoiceFileDetail } from './LeadInvoiceFileDetail';
import { LeadActivity } from './LeadActivity';
import { ECManagerRemark } from './ECManagerRemark';
import { LeadReminder } from './LeadReminder';
import { LeadCallerRemark } from './LeadCallerRemark';
import { LeadContactDetail } from './LeadContactDetail';

export class LeadDetail {
    id: string;
    contactPersonName: string;
    enquiryType: string;
    leadContactDetails: LeadContactDetail[];
    address: string;
    city: string;
    state: string;
    company: string;
    subject: string;
    description: string;
    leadCallingStatusId: number;
    leadClassificationId: number;
    leadEnquiryTypeId: number;
    leadSpaceTypeId: number;
    leadStatusId: number;
    leadSource: string;
    assignedToECId: number;
    assignedAtToEC: Date;
    callerRemarks: string;
    leadCallerRemarks: LeadCallerRemark[];
    callerLeadReminder: LeadReminder;
    ecLeadReminder: LeadReminder;
    isCallerReminderOn: boolean;
    isECReminderOn: boolean;
    leadECManagerRemarks: ECManagerRemark[];
    ecRemarks: string;
    leadConversion: Date;

    dealerName: string;
    dealerCode: string;
    leadValueINR: number;
    volumeInSquareFeet: number;
    futureRequirement: string;
    futureRequirementTileSegment: string;
    futureRequirementVolume: string;
    quantityInSquareFeet: number;
    existingLeadIds: string[];
    overallLeadStatus: string;
    leadActivities: LeadActivity[];
    leadInvoiceFileDetails: LeadInvoiceFileDetail[];
   /*  callerRemindAt: Date;
    ecRemindAt: Date; */
}
