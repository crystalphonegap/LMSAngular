import { LeadSource } from './LeadSource';
import { LeadReminderOption } from './LeadReminderOption';
import { ExperienceCenter } from './ExperienceCenter';
import { State } from './State';
import { LeadStatus } from './LeadStatus';
import { LeadSpaceType } from './LeadSpaceType';
import { LeadEnquiryType } from './LeadEnquiryType';
import { LeadClassification } from './LeadClassification';
import { LeadCallingStatus } from './LeadCallingStatus';

export class LeadMasterInfo {
    leadCallingStatuses: LeadCallingStatus[];
    leadClassifications: LeadClassification[];
    leadEnquiryTypes: LeadEnquiryType[];
    leadSpaceTypes: LeadSpaceType[];
    leadStatuses: LeadStatus[];
    states: State[];
    statesFilter: State[];
    experienceCenters: ExperienceCenter[];
    leadReminderOptions: LeadReminderOption[];
    leadSources: LeadSource[];
}
