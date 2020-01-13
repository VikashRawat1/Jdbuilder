import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JobListingComponent } from './job-listing/job-listing.component';
import { JobDetailComponent } from './job-detail/job-detail.component';
const routes: Routes = [
  {path: '', component: JobListingComponent},
  {path: 'job-description/:jobId', component: JobDetailComponent},
  // {path: '', redirectTo: '', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobRoutingModule { }
