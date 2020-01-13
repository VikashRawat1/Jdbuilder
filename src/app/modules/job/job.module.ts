import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobRoutingModule } from './job-routing.module';
import { JobListingComponent } from './job-listing/job-listing.component';

@NgModule({
  declarations: [JobListingComponent],
  imports: [
    CommonModule,
    JobRoutingModule
  ]
})
export class JobModule { }
