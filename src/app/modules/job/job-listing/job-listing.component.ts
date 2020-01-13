import { Component, OnInit } from '@angular/core';
import { Job1ServiceService } from '../job-service.service';
import { ToastrService } from 'ngx-toastr';
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
  pageSizeOptions: number[] = [2, 5, 10, 25, 100];
  pageSelected = 0;
  DefaultPageSize = 2;
  constructor(private jobService: Job1ServiceService, private toastr: ToastrService) { }

  ngOnInit() {
    const pageParams = {pageSize: this.DefaultPageSize, pageIndex: this.pageSelected};
    this.jobService.getAllJobs(pageParams).subscribe((jobs: any) => {
      this.jobs = jobs.ProfileList;
      this.length = jobs.TotalRecords;
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
    const pageParams = {pageSize: 2, pageIndex: 0};
    this.jobService.getAllJobs(pageParams).subscribe((jobs: any) => {
      this.jobs = jobs.ProfileList;
      this.length = jobs.TotalRecords;
    });
  }
  search() {
    const paramObject = {
      locationId : this.selectedLocation ? this.selectedLocation : 0,
      experienceId : this.selectedExperience ? this.selectedExperience : 0,
      designationId : this.selectedDesignation ? this.selectedDesignation : 0,
      pageSize: this.DefaultPageSize,
      pageIndex: 0
    };
    this.filterProfile(paramObject);
  }
  filterProfile(paramObject) {
    this.jobService.FetchFilteredProfiles(paramObject).subscribe((FilteredList: any) => {
      if (FilteredList.StatusCode === 200) {
        this.jobs = FilteredList.ProfileList;
        this.length = FilteredList.TotalRecords;
      }
    });
  }
  onPaginateChange(evn){
    const paramObject = {
      locationId : this.selectedLocation ? this.selectedLocation : 0,
      experienceId : this.selectedExperience ? this.selectedExperience : 0,
      designationId : this.selectedDesignation ? this.selectedDesignation : 0,
      pageIndex: evn.pageIndex,
      pageSize: evn.pageSize
    };
    this.pageSelected = evn.pageIndex;
    this.DefaultPageSize = evn.pageSize;
    this.filterProfile(paramObject);
  }
}
