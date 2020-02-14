import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from '../../config/config';
const url = Config.url;
@Injectable({providedIn: 'root'})
export class Job1ServiceService {
  constructor(private httpClient: HttpClient) { }
  getAllJobs(pageParams) {
    return this.httpClient.get(`${url}/FetchProfiles/?pageSize=${pageParams.pageSize}&pageIndex=${pageParams.pageIndex}&myJD=${pageParams.myJd}&sortDir=${pageParams.sortByDate}`);
  }
  fetchProfiles(jdId) {
    return this.httpClient.get(`${url}/FetchProfileDetails?profileId=${jdId}`);
  }
  saveJd(jdDetail) {
    return this.httpClient.post(`${url}/UpdateProfile`, jdDetail);
  }
  FetchExperienceList() {
    return this.httpClient.get(`${url}/FetchExperienceList`);
  }
  FetchLocationList() {
    return this.httpClient.get(`${url}/FetchLocationList`);
  }
  FetchDesignationList() {
    return this.httpClient.get(`${url}/FetchDesignationList`);
  }
  FetchTagsList() {
    return this.httpClient.get(`${url}/FetchTagsList`);
  }
  FetchFilteredProfiles(params) {
    console.log(params, 'paramsss')
    return this.httpClient.get(`${url}/FetchFilteredProfiles?experienceId=${params.experienceId}&locationId=${params.locationId}&designationId=${params.designationId}&pageSize=${params.pageSize}&pageIndex=${params.pageIndex}&tagString=${params.searchString}&myJD=${params.myJd}&sortDir=${params.sortByDate}&selectedUserId=${params.selectedUserId}`);
  }
  FetchAllSkills(searchString) {
    return this.httpClient.get(`${url}/FetchAllSkills?searchString=${searchString}
    `);
  }
  FetchUserDetails(){
    return this.httpClient.get(`${url}/FetchUserDetails`);
  }
  FetchAllResponsibilities(searchString) {
    return this.httpClient.get(`${url}/FetchAllResponsibilities?searchString=${searchString}
    `);
  }
  FetchAllQualifications(searchString) {
    return this.httpClient.get(`${url}/FetchAllQualifications?searchString=${searchString}
    `);
  }
}
