import { Component, OnInit } from '@angular/core';
import { JobServiceService } from '../../../services/job-service.service';
import {PageEvent} from '@angular/material/paginator';
@Component({
  selector: 'app-job-listing',
  templateUrl: './job-listing.component.html',
  styleUrls: ['./job-listing.component.scss']
})
export class JobListingComponent implements OnInit {
  jobs: any[] = [];
  experiences = [];
  locations = [];
  designations = [];
  selectedDesignation;
  selectedLocation;
  selectedExperience;
  // MatPaginator Inputs
  length = 100;
  pageSize = 2;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  constructor(private jobService: JobServiceService, ) { }

  ngOnInit() {
    this.jobService.getAllJobs(true).subscribe((jobs: any) => {
      this.jobs = jobs.ProfileList;
    });
    this.jobService.FetchExperienceList().subscribe((experiences: any) => {
      if (experiences.StatusCode === 200) {
        this.experiences = experiences.ExperienceMasterList;
      }
    });
    this.jobService.FetchLocationList().subscribe((locations: any) => {
      if (locations.StatusCode === 200) {
        this.locations = locations.LocationMasterList;
      }
    });
    this.jobService.FetchDesignationList().subscribe((designations: any) => {
      if (designations.StatusCode === 200) {
        this.designations = designations.DesignationList;
      }
    });
  }
  refresh() {
    this.selectedLocation = undefined;
    this.selectedExperience = undefined;
    this.selectedDesignation = undefined;
    const paramObject = {
      locationId : 0,
      experienceId : 0,
      designationId : 0
    };
    this.jobService.getAllJobs(true).subscribe((jobs: any) => {
      this.jobs = jobs.ProfileList;
    });
  }
  search() {
    const paramObject = {
      locationId : this.selectedLocation ? this.selectedLocation : 0,
      experienceId : this.selectedExperience ? this.selectedExperience : 0,
      designationId : this.selectedDesignation ? this.selectedDesignation : 0
    };
    this.filterProfile(paramObject);
  }
  filterProfile(paramObject){
    this.jobService.FetchFilteredProfiles(paramObject).subscribe((FilteredList: any) => {
      if (FilteredList.StatusCode === 200) {
        this.jobs = FilteredList.ProfileList;
      }
    });
  }
}
