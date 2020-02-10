import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader/loader.component';
import { JobIdPipe } from './pipes/jobId-pipe/job-id.pipe';

@NgModule({
  declarations: [LoaderComponent, JobIdPipe],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
