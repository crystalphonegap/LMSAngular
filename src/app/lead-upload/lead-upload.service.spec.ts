/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LeadUploadService } from './lead-upload.service';

describe('Service: LeadUpload', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LeadUploadService]
    });
  });

  it('should ...', inject([LeadUploadService], (service: LeadUploadService) => {
    expect(service).toBeTruthy();
  }));
});
