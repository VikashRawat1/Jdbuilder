import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Job1ServiceService } from '../job-service.service';
import {MatChipInputEvent} from '@angular/material';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.scss']
})
export class JobDetailComponent implements OnInit {
  jobDescriptionForm: FormGroup;
  mandatorySkills: FormArray;
  desiredSkills: FormArray;
  qualifications: FormArray;
  rolesAndResponsibility: FormArray;
  deletedSkills: string[] = [];
  deletedQualifications: string[] = [];
  deletedResponsiblities: string[] = [];
  deletedTags: string[] = [];
  designations: string[] = [];
  experiences: string[] = [];
  locations: string[] = [];
  isDataFetched = false;
  reloading = false;
  // chips variable
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tagsCtrl = new FormControl();
  filteredTags: Observable<string[]>;
  tags = [];
  allTags = [];
  isEditJd = false;
  ////
  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  constructor(private formBuilder: FormBuilder, private jobService: Job1ServiceService, private toastr: ToastrService) {

   }
  private _filter(value: any): string[] {
    const filterValue = value.Id ? value.Id.toLowerCase() : value.toLowerCase();
    return this.allTags.filter((option, index) => {
      return option.TagName.toLowerCase().includes(filterValue);
    });
  }
  ngOnInit() {
    this.jobService.fetchProfiles(location.pathname.split('/').pop()).subscribe((jobDetail: any) => {
      if (jobDetail.StatusCode === 200) {
        this.isDataFetched = true;
        const defaultMandatorySkill = [];
        const defaultDesiredSkill = [];
        const defaultQualification = [];
        const defaultResponsibility = [];
        jobDetail.ProfileDetail.SkillList.forEach((ele) => {
          if (ele.SkillTypeId === 1) {
            defaultMandatorySkill.push(this.createMandatorySkill(ele));
          } else {
            defaultDesiredSkill.push(this.createDesiredSkill(ele));
          }
        }
        );
        jobDetail.ProfileDetail.QualificationList.forEach((ele) => {
            defaultQualification.push(this.createQualification(ele));
        });
        jobDetail.ProfileDetail.ResponsibilityList.forEach((ele) => {
          defaultResponsibility.push(this.formBuilder.group(ele));
      });
        this.tags = jobDetail.ProfileDetail.TagsList;
        this.jobDescriptionForm = this.formBuilder.group({
          about: new FormControl(jobDetail.ProfileDetail.About),
          selectedDesignation: new FormControl(jobDetail.ProfileDetail.DesignationId),
          selectedLocation: new FormControl(jobDetail.ProfileDetail.LocationId),
          selectedExperience: new FormControl(jobDetail.ProfileDetail.ExperienceId),
          desiredSkills: this.formBuilder.array(defaultDesiredSkill),
          mandatorySkills: this.formBuilder.array(defaultMandatorySkill),
          qualifications:  this.formBuilder.array(defaultQualification),
          rolesAndResponsibility: this.formBuilder.array(defaultResponsibility),
        });
      } else {
        this.jobDescriptionForm = this.formBuilder.group({
          about: new FormControl('About the job'),
          desiredSkill: this.formBuilder.array([ this.formBuilder.group(
            {SkillId: 0, SkillName: 'default D skill', SkillTypeId: 2, SkillTypeName: 'Desired' }
            )
          ]),
          mandatorySkills: this.formBuilder.array([ this.formBuilder.group(
            {SkillId: 0, SkillName: 'default M skill', SkillTypeId: 1, SkillTypeName: 'Mandatory' }
            )
          ]),
          qualifications:  this.formBuilder.array([ this.formBuilder.group({Id: 0, Name: 'default qualification'})]),
        });
      }
      this.jobService.FetchTagsList().subscribe((tags: any) => {
        if (tags.StatusCode === 200) {
          this.allTags = tags.ProfileTagsList;
          // this.tagsCtrl = tags.DesignationList;
          for (let index = 0; this.allTags.length > index ; index++) {
            for (let index2 = 0; this.tags.length > index2 ; index2++) {
              if (this.allTags[index].Id === this.tags[index2].Id) {
                this.allTags.splice(index, 1);
                index = 0;
                index2 = 0;
              }
            }
          }
          this.filteredTags = this.tagsCtrl.valueChanges.pipe(
            startWith(null),
            map((tag: object | null) =>  tag ? this._filter(tag) : this.allTags.slice()));
        }
      });
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
  createMandatorySkill(newSkill): FormGroup {
    return this.formBuilder.group({
        SkillId: newSkill.SkillId,
        SkillName: newSkill.SkillName,
        SkillTypeId: newSkill.SkillTypeId,
        SkillTypeName : newSkill.SkillTypeName,
    });
  }
  createQualification(qualificationObj): FormGroup {
    return this.formBuilder.group(qualificationObj);
  }
  createDesiredSkill(desiredSkill): FormGroup {
    return this.formBuilder.group({
      SkillId: desiredSkill.SkillId,
      SkillName: desiredSkill.SkillName,
      SkillTypeId: 2,
      SkillTypeName : 'Desired'
    });
  }
  addMandatorySkill(): void {
    this.mandatorySkills = this.jobDescriptionForm.get('mandatorySkills') as FormArray;
    const newSkill = {
      SkillId: 0,
      SkillName: 'New Mandatory skill',
      SkillTypeId: 1,
      SkillTypeName : 'Mandatory'};
    this.mandatorySkills.push(this.createMandatorySkill(newSkill));
  }
  addQualification(): void {
    this.qualifications = this.jobDescriptionForm.get('qualifications') as FormArray;
    const obj = {Id: 0, Name: 'New Qualification'};
    this.qualifications.push(this.createQualification(obj));
  }
  addResponsibility(): void {
    this.rolesAndResponsibility = this.jobDescriptionForm.get('rolesAndResponsibility') as FormArray;
    const obj = {Id: '', Responsibility: 'New Responsibility'};
    this.rolesAndResponsibility.push(this.formBuilder.group(obj));
  }
  deleteSkill(deletedSkill, index) {
    this.mandatorySkills = this.jobDescriptionForm.get('mandatorySkills') as FormArray;
    if (deletedSkill.SkillId.value !== 0) {
      this.deletedSkills.push(deletedSkill.SkillId.value);
    }
    this.mandatorySkills.removeAt(index);
  }
  deleteDesiredSkill(deletedSkill, index) {
    this.desiredSkills = this.jobDescriptionForm.get('desiredSkills') as FormArray;
    if (deletedSkill.SkillId.value !== 0) {
      this.deletedSkills.push(deletedSkill.SkillId.value);
    }
    this.desiredSkills.removeAt(index);
  }
  deleteQualification(deletedQualification, index) {
    this.qualifications = this.jobDescriptionForm.get('qualifications') as FormArray;
    if (deletedQualification.Id.value !== 0) {
      this.deletedQualifications.push(deletedQualification.Id.value);
    }
    this.qualifications.removeAt(index);
  }
  deleteResponsiblity( deletedResponsibility, index: number) {
    this.rolesAndResponsibility = this.jobDescriptionForm.get('rolesAndResponsibility') as FormArray;
    if (deletedResponsibility.Id.value !== 0) {
      this.deletedResponsiblities.push(deletedResponsibility.Id.value);
    }
    this.rolesAndResponsibility.removeAt(index);
  }
  moveToDesired(selectedSkill, index) {
    const updatedSkill = {
      SkillId: selectedSkill.SkillId.value,
      SkillName: selectedSkill.SkillName.value
    };
    this.desiredSkills = this.jobDescriptionForm.get('desiredSkills') as FormArray;
    this.desiredSkills.push(this.createDesiredSkill(updatedSkill));
    this.mandatorySkills = this.jobDescriptionForm.get('mandatorySkills') as FormArray;
    this.mandatorySkills.removeAt(index);
  }
  moveToMandatory(selectedSkill, index) {
    const updatedSkill = {
      SkillId: selectedSkill.SkillId.value,
      SkillName: selectedSkill.SkillName.value,
      SkillTypeId: 1,
      SkillTypeName: 'Mandatory'
    };
    this.mandatorySkills = this.jobDescriptionForm.get('mandatorySkills') as FormArray;
    this.mandatorySkills.push(this.createMandatorySkill(updatedSkill));
    this.desiredSkills = this.jobDescriptionForm.get('desiredSkills') as FormArray;
    this.desiredSkills.removeAt(index);
  }
  // get mandatorySkills(): FormArray { return this.jobDescriptionForm.get('mandatorySkills') as FormArray; }
  // get qualifications(): FormArray { return this.jobDescriptionForm.get('qualifications') as FormArray; }

  // addMandatorySkill(): void {
  //   this.mandatorySkills.push(new FormControl());
  // }
  add(event: MatChipInputEvent, isAdd): void {
    if (isAdd) {
      const input = event.input;
      const value = event.value;
      // Add our tag
      if ((value || '').trim()) {
        this.tags.push({Id: '', TagName: value.trim()});
      }
      // Reset the input value
      if (input) {
        input.value = '';
      }
      this.tagsCtrl.setValue(null);
    }

  }

  removeTag(tag): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
      this.allTags.push(tag);
      this.deletedTags.push(tag.Id);
    }
  }
  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.value);
    this.tagInput.nativeElement.value = '';
    this.allTags.filter((option, index) => {
      if (option.Id.toLowerCase().includes(event.option.value.Id)) {
        this.allTags.splice(index, 1);
      }
    });
    this.tagsCtrl.setValue(null);
  }
  onSave() {
    const jdObject = {
      ProfileId: location.pathname.split('/').pop(),
      About: this.jobDescriptionForm.get('about').value,
      DesignationId: this.jobDescriptionForm.get('selectedDesignation').value,
      LocationId: this.jobDescriptionForm.get('selectedLocation').value,
      ExperienceId: this.jobDescriptionForm.get('selectedExperience').value,
      SkillList: [...this.jobDescriptionForm.get('mandatorySkills').value, ...this.jobDescriptionForm.get('desiredSkills').value],
      QualificationList: this.jobDescriptionForm.get('qualifications').value,
      ResponsibilityList: this.jobDescriptionForm.get('rolesAndResponsibility').value,
      TagsList: this.tags,
      DeletedQualifications: this.deletedQualifications,
      DeletedSkills: this.deletedSkills,
      DeletedResponsibilities: this.deletedResponsiblities,
      DeletedTags: this.deletedTags
    };
    this.jobService.saveJd(jdObject).subscribe((updatedData: any) => {
      if (updatedData.StatusCode === 200){
        this.toastr.success(updatedData.Message, 'Success');
        // location.reload();
      }
    });
  }
}


