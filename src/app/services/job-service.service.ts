import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
const url = 'http://localhost:80/api';
@Injectable({providedIn: 'root'})
export class JobServiceService {
  constructor(private httpClient: HttpClient) { }
  getAllJobs() {
    return this.httpClient.get(`${url}/FetchProfiles`);
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
}
