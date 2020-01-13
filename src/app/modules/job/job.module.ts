import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { JobRoutingModule } from './job-routing.module';
import { JobListingComponent } from './job-listing/job-listing.component';
import { JobDetailComponent } from './job-detail/job-detail.component';
import { Job1ServiceService } from './job-service.service';
import {
  MatChipsModule,
  MatFormFieldModule,
  MatIconModule,
  MatAutocompleteModule,
  MatInputModule,
  MatSelectModule,
  MatPaginatorModule,
  MatProgressSpinnerModule
} from '@angular/material';
@NgModule({
  declarations: [
    JobListingComponent,
    JobDetailComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    JobRoutingModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
  ],
  providers: [Job1ServiceService]
})
export class JobModule { }
