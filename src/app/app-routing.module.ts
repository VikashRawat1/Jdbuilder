import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { JobListingComponent } from './job-listing/job-listing.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
// import { JobDetailComponent } from './job-detail/job-detail.component';

const routes: Routes = [
  {path: 'job', loadChildren: './modules/job/job.module#JobModule'},
  // {path: 'job-description/:jobId', component: JobDetailComponent},
  // {path: 'job', loadChildren: './modules/job/job.module#JobModule'},
  {path: '', redirectTo: 'job', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
