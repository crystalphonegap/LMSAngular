import { LeadContactDetail } from './LeadContactDetail';

export class LeadListView {
    id: string;
    contactPersonName: string;
    leadDateTime: Date;
    enquiryType: string;
    leadClassification: string;
    leadContactDetail: LeadContactDetail;
    leadSource: string;
    remindAt: Date;
    isLeadUpdated: number;
    leadHistoryCount: number;
    leadHistoryIds: string;
    isReminderExpired: boolean;
}
