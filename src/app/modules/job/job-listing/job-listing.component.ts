import { Component, OnInit } from '@angular/core';
import { Job1ServiceService } from '../job-service.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
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
  searchString;
  // MatPaginator Inputs
  length = 100;
  pageSize = 2;
  pageSizeOptions: number[] = [2, 5, 10, 25, 100];
  pageSelected = 0;
  DefaultPageSize = 2;
  range;
  myJd = true;
  constructor(private jobService: Job1ServiceService, private toastr: ToastrService, private router: Router) { }

  ngOnInit() {
    const pageParams = {pageSize: this.DefaultPageSize, pageIndex: this.pageSelected, myJd: this.myJd};
    this.jobService.getAllJobs(pageParams).subscribe((jobs: any) => {
      this.jobs = jobs.ProfileList;
      this.length = jobs.TotalRecords;
      this.range = `${this.pageSelected + 1}-${this.jobs.length} of ${this.length}`;
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
    this.selectedLocation = 0;
    this.selectedExperience = 0;
    this.selectedDesignation = 0;
    const pageParams = {pageSize: 2, pageIndex: 0};
    this.jobService.getAllJobs(pageParams).subscribe((jobs: any) => {
      this.jobs = jobs.ProfileList;
      this.length = jobs.TotalRecords;
    });
  }
  search() {
    console.log(typeof this.selectedDesignation, 'selectedselectiponnnnnn')
    const paramObject = {
      locationId : (this.selectedLocation && this.selectedLocation !== 'undefined') ? this.selectedLocation : 0,
      experienceId : (this.selectedExperience && this.selectedExperience !== 'undefined') ? this.selectedExperience : 0,
      designationId : (this.selectedDesignation && this.selectedDesignation !== 'undefined') ? this.selectedDesignation : 0,
      pageSize: this.DefaultPageSize,
      pageIndex: 0,
      searchString: this.searchString ? this.searchString : '',
      myJd: this.myJd
    };
    this.filterProfile(paramObject);
  }
  filterProfile(paramObject) {
    console.log(paramObject,'paramobject')
    this.jobService.FetchFilteredProfiles(paramObject).subscribe((FilteredList: any) => {
      if (FilteredList.StatusCode === 200) {
        this.jobs = FilteredList.ProfileList;
        this.length = FilteredList.TotalRecords;
        const previousRecord = paramObject.pageIndex * paramObject.pageSize;
        this.range = `${previousRecord + 1}-${previousRecord + this.jobs.length} of ${this.length}`;
      }
    });
  }
  onPaginateChange(evn) {
    console.log(evn, 'evfvvnnn', this.DefaultPageSize, "this.DefaultPageSizedd")
    const paramObject = {
      locationId : (this.selectedLocation && this.selectedLocation !== 'undefined') ? this.selectedLocation : 0,
      experienceId : (this.selectedExperience && this.selectedExperience !== 'undefined') ? this.selectedExperience : 0,
      designationId : (this.selectedDesignation && this.selectedDesignation !== 'undefined') ? this.selectedDesignation : 0,
      pageIndex: evn.pageIndex !== undefined ? evn.pageIndex : evn - 1,
      pageSize: evn.pageSize ? evn.pageSize : this.DefaultPageSize,
      searchString: this.searchString ? this.searchString : ''
    };
    this.pageSelected = evn.pageIndex !== undefined ? evn.pageIndex : evn,
    this.DefaultPageSize = evn.pageSize ? evn.pageSize : this.DefaultPageSize;
    this.filterProfile(paramObject);
  }

  goToDetails(jobId) {
    this.router.navigate(['job-description/' + jobId]);
  }
}
