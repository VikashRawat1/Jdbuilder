import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JobListingComponent } from './job-listing/job-listing.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { JobDetailComponent } from './job-detail/job-detail.component';

const routes: Routes = [
  {path: 'job-listing', component: JobListingComponent},
  {path: 'job-description/:jobId', component: JobDetailComponent},
  {path: '', redirectTo: 'job-listing', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
