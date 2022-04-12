import { LeadContactDetail } from './LeadContactDetail';

export class LeadDetailSave {
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
    isCallerReminderOn: boolean;
    isECReminderOn: boolean;
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
    overallLeadStatus: string;
    callerRemindAt: Date;
    ecRemindAt: Date;
    invoiceFile: FormData;
}
