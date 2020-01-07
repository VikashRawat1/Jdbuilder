import { Component, OnInit } from '@angular/core';
import { JobServiceService } from '../services/job-service.service';

@Component({
  selector: 'app-job-listing',
  templateUrl: './job-listing.component.html',
  styleUrls: ['./job-listing.component.css']
})
export class JobListingComponent implements OnInit {
  jobs: any[] = [];
  constructor(private jobService: JobServiceService, ) { }

  ngOnInit() {
    this.jobService.getAllJobs().subscribe((jobs: any) => {
    console.log(jobs, ' jobsss');
    this.jobs = jobs.ProfileList;
    });
  }




}
