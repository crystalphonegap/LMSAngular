import { LeadCallerRemark } from './LeadCallerRemark';
export class ExistingLead {
    id: string;
    contactPersonName: string;
    enquiryType: string;
    city: string;
    state: string;
    company: string;
    subject: string;
    description: string;
    leadCallingStatus: string;
    leadClassification: string;
    leadSource: string;
    assignedToEC: string;
    assignedAtToEC: Date;
    leadCallerRemarks: LeadCallerRemark[];
    leadStatus: string;
}
