import { LeadService } from './../lead.service';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { LeadListEnvelope } from './../../model/lead/LeadListEnvelope';

export class LeadListDataSource extends DataSource<LeadListEnvelope | undefined> {

    private cachedLeadList = Array.from<LeadListEnvelope>({ length: 0 });
    private dataStream = new BehaviorSubject<(LeadListEnvelope | undefined)[]>(this.cachedLeadList);
    private subscription = new Subscription();

    constructor(private leadService: LeadService) {
        super();
    }

    connect(collectionViewer: CollectionViewer): Observable<(LeadListEnvelope | undefined)[] | readonly LeadListEnvelope[] | undefined[]> {
        this.subscription.add(collectionViewer.viewChange.subscribe(range => {
            /* range.end; */
        }));
        return this.dataStream;
    }
    disconnect(collectionViewer: CollectionViewer): void {
        this.subscription.unsubscribe();
    }

    private fetchLeadList(): void {
        this.leadService.getLeadList(null).subscribe((res) => {
            this.cachedLeadList = this.cachedLeadList.concat(res);
            this.dataStream.next(this.cachedLeadList);
        }, (error) => {
            console.log(error);
        });
    }

}
