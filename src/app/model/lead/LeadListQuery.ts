export class LeadListQuery {
    pageNo: number;
    pageSize: number;
    sortBy: string;
    isSortingAscending: boolean;
    leadFromDate: Date;
    leadUptoDate: Date;
    leadSource: string;
    leadCallingStatusId: number;
    leadAttendedId: number;
    leadClassificationId: number;
    experienceCenterId: number;
    isUpcomingLeads: boolean;
    stateName: string;
    leadStatusId: number;
    contactPersonName: string;
    leadContactNo: string;
    leadECStatusId: number;
}
