import { Component, OnInit, Directive, ChangeDetectorRef, ElementRef, ViewChild, HostListener, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Job1ServiceService } from '../job-service.service';
import {MatChipInputEvent} from '@angular/material';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { Router } from '@angular/router';
import { JobServiceService } from '../../../shared/services/job-service.service';
import { AdalService } from 'src/app/shared/services/adal.service';
// import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import * as JSPdf from 'jspdf';
// import * as html2canvas from 'html2canvas';
import html2canvas from 'html2canvas';
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
  selectedDesignationName;
  selectedLocationName;
  selectedExperienceName;
  jobDetail;
  suggestedSkill = [];
  suggestedQualification = [];
  suggestedResponsibilities = [];
  selectedIndex = 2
  isSameUser = false
  submitted = false;
  ////
  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('suggestedInput') suggestedInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild('content', {}) content: ElementRef;
  capturedImage;

  public downloadPDF() {
    window.scrollTo()
  //   html2canvas(document.querySelector("#content"),{scrollY: -window.scrollY}).then(canvas => {

  //     // debugger;

  //    /// document.body.appendChild(canvas);
  //    this.capturedImage = canvas.toDataURL();
  //    console.log("canvas.toDataURL() -->" + this.capturedImage);
  //    // this will contain something like (note the ellipses for brevity), console.log cuts it off
  //    // "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAa0AAAB3CAYAAACwhB/KAAAXr0lEQVR4Xu2dCdiNZf7HP/ZQkpQtaUxDjYYoTSYlURMhGlmKa..."


  //    canvas.toBlob(function (blob) {

  //      //  just pass blob to something expecting a blob
  //      // somfunc(blob);

  //      // Same as canvas.toDataURL(), just longer way to do it.
  //      var reader = new FileReader();
  //     //  debugger;
  //      reader.readAsDataURL(blob);
  //      reader.onloadend = function () {
  //        let base64data = reader.result;
  //        console.log("Base64--> " + base64data);
  //      }

  //    });


  //  });
    let quotes = document.getElementById('content-pdf');
    html2canvas(document.getElementById('content-pdf'),{scrollY: -window.scrollY}).then(function(canvas) {

      var img = canvas.toDataURL("image/png");
      console.log(canvas, 'canvass')
      // window.open(img);
      var doc = new JSPdf('p', 'pt', 'letter');
      for (var i = 0; i <= quotes.clientHeight/1450; i++) {
        //! This is all just html2canvas stuff
        var srcImg  = canvas;
        var sX      = 0;
        var sY      = 1450 *i; // start 980 pixels down for every new page
        var sWidth  = 1100;
        var sHeight = 1450;
        var dX      = 0;
        var dY      = 0;
        var dWidth  = 1100;
        var dHeight = 1450;

        let onePageCanvas = document.createElement("canvas");
        onePageCanvas.setAttribute('width', "1100");
        onePageCanvas.setAttribute('height', "1450");
        var ctx = onePageCanvas.getContext('2d');
        // details on this usage of this function:
        // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images#Slicing
        ctx.drawImage(srcImg,sX,sY,sWidth,sHeight,dX,dY,dWidth,dHeight);

        // document.body.appendChild(canvas);
        var canvasDataURL = onePageCanvas.toDataURL("image/png", 1.0);

        var width         = onePageCanvas.width;
        var height        = onePageCanvas.clientHeight;

        //! If we're on anything other than the first page,
        // add another page
        if (i > 0) {
            doc.addPage(612, 791); //8.5" x 11" in pts (in*72)
        }
        //! now we declare that we're working on that page
        doc.setPage(i+1);
        //! now we add content to that page!
        doc.addImage(canvasDataURL, 'PNG', 25, 20, (width*0.5), (height*0.5));

    }
    //! after the for loop is finished running, we save the pdf.
      // doc.addImage(img,'JPEG',0,0,200,0);
      doc.save('testCanvas.pdf');
      // this.canvas.nativeElement.src = canvas.toDataURL();
      // this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      // this.downloadLink.nativeElement.download = 'marble-diagram.png';
      // this.downloadLink.nativeElement.click();
      });
  }
  // Pie
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'bottom',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };
  public pieChartLabels: Label[] = [['90-100% '], ['80-90% '], ['70-80 %'],['<70 %']];
  public pieChartData: number[] = [300, 370, 315, 280];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  // public pieChartPlugins = [pluginDataLabels];
  public pieChartColors = [
    {
      backgroundColor: ['#264d00', '#66cc00', '#b3ff66', '#ffa600'],
    },
  ];
  constructor(@Inject(DOCUMENT) private document: Document, private formBuilder: FormBuilder, private jobService: Job1ServiceService, private toastr: ToastrService,private router: Router, private commonJobService: JobServiceService, private adalService:AdalService ) {

   }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    if ((document.body.scrollTop > 140 ||
    document.documentElement.scrollTop > 140) && document.getElementById('header')) {
      document.getElementById('header').classList.add('fixed-header');
      // document.getElementById('paragraph').classList.add('green');
    }
    if (document.documentElement.scrollTop < 1 && document.getElementById('header')) {
        document.getElementById('header').classList.remove('fixed-header');
        // document.getElementById('paragraph').classList.add('green');
      }
  }
  fixHeader() {
    document.getElementById('header').classList.add('fixed-header');
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }
  private _filter(value: any): string[] {
    const filterValue = value.Id ? value.Id.toLowerCase() : value.toLowerCase();
    return this.allTags.filter((option, index) => {
      return option.TagName.toLowerCase().includes(filterValue);
    });
  }
  ngOnInit() {
    // this.commonJobService.getSideBarIndex().subscribe((sidebarIndex)=>{
    //   this.selectedIndex = sidebarIndex;
    // })
    this.jobService.fetchProfiles(location.pathname.split('/').pop()).subscribe((jobDetail: any) => {
      if (jobDetail.StatusCode === 200) {
        if(this.adalService.userInfo.profile.oid === jobDetail.ProfileDetail.CreatedBy){
          this.isSameUser = true
        }
        this.isDataFetched = true;
        const defaultMandatorySkill = [];
        const defaultDesiredSkill = [];
        const defaultQualification = [];
        const defaultResponsibility = [];
        this.jobDetail = jobDetail
        jobDetail.ProfileDetail.SkillList.forEach((ele) => {
          if (ele.SkillTypeId === 1) {
            defaultMandatorySkill.push(this.createMandatorySkill(ele));
          } else {
            defaultDesiredSkill.push(this.createDesiredSkill(ele));
          }
        }
        );
        jobDetail.ProfileDetail.QualificationList.forEach((ele) => {
            console.log(ele, 'elee')
            ele.isEditing = false
            defaultQualification.push(this.createQualification(ele));
        });
        console.log(defaultQualification, 'default qualificationnnn')
        jobDetail.ProfileDetail.ResponsibilityList.forEach((ele) => {
          ele.isEditing = false
          ele.Responsibility = [ele.Responsibility,Validators.required]
          defaultResponsibility.push(this.formBuilder.group(ele));
      });
        this.tags = jobDetail.ProfileDetail.TagsList;
        this.jobDescriptionForm = this.formBuilder.group({
          title: new FormControl(jobDetail.ProfileDetail.ProfileName),
          about: new FormControl(jobDetail.ProfileDetail.About, Validators.required),
          selectedDesignation: new FormControl(jobDetail.ProfileDetail.DesignationId),
          selectedLocation: new FormControl(jobDetail.ProfileDetail.LocationId),
          selectedExperience: new FormControl(jobDetail.ProfileDetail.ExperienceId),
          desiredSkills: this.formBuilder.array(defaultDesiredSkill),
          mandatorySkills: this.formBuilder.array(defaultMandatorySkill),
          qualifications:  this.formBuilder.array(defaultQualification),
          rolesAndResponsibility: this.formBuilder.array(defaultResponsibility),
          tagsCtrl: new FormControl(''),
        });
        this.jobService.FetchExperienceList().subscribe((experiences: any) => {
          if (experiences.StatusCode === 200) {
            this.experiences = experiences.ExperienceMasterList;
            experiences.ExperienceMasterList.forEach((val) => {
              if (this.jobDescriptionForm && this.jobDescriptionForm.get('selectedExperience').value === val.Id) {
                this.selectedExperienceName = val.ExperienceName;
              }
            });
          }
        });
        this.jobService.FetchLocationList().subscribe((locations: any) => {
          if (locations.StatusCode === 200) {
            this.locations = locations.LocationMasterList;
            locations.LocationMasterList.forEach((val) => {
              if (this.jobDescriptionForm && this.jobDescriptionForm.get('selectedLocation').value === val.Id) {
                this.selectedLocationName = val.LocationName;
              }
            });
          }
        });
        this.jobService.FetchDesignationList().subscribe((designations: any) => {
          if (designations.StatusCode === 200) {
            this.designations = designations.DesignationList;
            designations.DesignationList.forEach((val) => {
              if (this.jobDescriptionForm && this.jobDescriptionForm.get('selectedDesignation').value === val.Id) {
                this.selectedDesignationName = val.DesignationName;
              }
            });
          }
        });

      } else {
        this.jobDescriptionForm = this.formBuilder.group({
          title: new FormControl('Title of the job'),
          about: new FormControl('Summary of the job'),
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
      console.log(this.jobDescriptionForm, 'dfdfdfdf')
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
          this.filteredTags = this.tagsCtrl.valueChanges
          .pipe(
            startWith(''),
            map(val => {
              if (val && val.length >= 2) {
                return this._filter(val);
              } else {
                return [];
              }
            } )
          );
        }
      });
    });


  }
  createMandatorySkill(newSkill): FormGroup {
    return this.formBuilder.group({
        isEditing: newSkill.isEditing?newSkill.isEditing:false,
        SkillId: newSkill.SkillId,
        SkillName: [newSkill.SkillName,Validators.required],
        SkillTypeId: newSkill.SkillTypeId,
        SkillTypeName : newSkill.SkillTypeName,
    });
  }
  createQualification(qualificationObj): FormGroup {
    console.log(qualificationObj, 'qualificaddfd')
    qualificationObj.Name = [qualificationObj.Name,Validators.required]
    return this.formBuilder.group(qualificationObj);
  }
  createDesiredSkill(desiredSkill): FormGroup {
    return this.formBuilder.group({
      isEditing:desiredSkill.isEditing?desiredSkill.isEditing:false,
      SkillId: desiredSkill.SkillId,
      SkillName: [desiredSkill.SkillName,Validators.required],
      SkillTypeId: 2,
      SkillTypeName : 'Desired'
    });
  }
  addMandatorySkill(): void {
    this.mandatorySkills = this.jobDescriptionForm.get('mandatorySkills') as FormArray;
    const newSkill = {
      isEditing:true,
      SkillId: 0,
      SkillName: '',
      SkillTypeId: 1,
      SkillTypeName : 'Mandatory'};
    this.mandatorySkills.push(this.createMandatorySkill(newSkill));
  }
  addDesiredSkill(): void {
    this.mandatorySkills = this.jobDescriptionForm.get('desiredSkills') as FormArray;
    const newSkill = {
      isEditing:true,
      SkillId: 0,
      SkillName: '',
      SkillTypeId: 1,
      SkillTypeName : 'Desired'};
    this.mandatorySkills.push(this.createDesiredSkill(newSkill));
  }
  addQualification(): void {
    this.qualifications = this.jobDescriptionForm.get('qualifications') as FormArray;
    const obj = {Id: 0, Name: '',isEditing:true};
    this.qualifications.push(this.createQualification(obj));
  }
  addResponsibility(): void {
    this.rolesAndResponsibility = this.jobDescriptionForm.get('rolesAndResponsibility') as FormArray;
    const obj = {Id: '', Responsibility: ['',Validators.required],isEditing:true};
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
  selectedSkill(event: MatAutocompleteSelectedEvent,index,isMandatory): void{
    console.log(event,'eventt')
    console.log(this.jobDescriptionForm.controls['mandatorySkills'].value[index],'dsdfdfdfd')
    if(isMandatory){
      this.jobDescriptionForm.controls['mandatorySkills'].value[index].SkillName = event.option.value
    }else{
      this.jobDescriptionForm.controls['desiredSkills'].value[index].SkillName = event.option.value
    }
  }
  selectQualification(event: MatAutocompleteSelectedEvent,index,isMandatory): void{
    console.log(event,'eventt')
    console.log(this.jobDescriptionForm.controls['qualifications'].value[index],'dsdfdfdfd')
      this.jobDescriptionForm.controls['qualifications'].value[index].Name = event.option.value
  }
  selectResponsibility(event: MatAutocompleteSelectedEvent,index,isMandatory): void{
    console.log(event,'eventt')
    console.log(this.jobDescriptionForm.controls['rolesAndResponsibility'].value[index],'dsdfdfdfd')
      this.jobDescriptionForm.controls['rolesAndResponsibility'].value[index].Responsibility = event.option.value
  }
  getSkill(event){
    console.log(event, 'event')
    if(event.target.value.length >2){
      // check for letter and numbers
      if((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 65 && event.keyCode <= 90)){
        this.jobService.FetchAllSkills(event.target.value).subscribe((skillData: any)=>{
          console.log(skillData, 'skllls')
          if(skillData.StatusCode){
            this.suggestedSkill = skillData.Skills;
            console.log(this.suggestedSkill, 'sillllllll')
          }
        })
      }
    }
  }
  getQualifications(event){
    console.log(event, 'event')
    if(event.target.value.length >1){
      // check for letter and numbers
      if((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 65 && event.keyCode <= 90)){
        this.jobService.FetchAllQualifications(event.target.value).subscribe((Data: any)=>{
          console.log(Data, 'skllls')
          if(Data.StatusCode){
            this.suggestedQualification = Data.ProfileQualifications;
            console.log(this.suggestedQualification, 'sillllllll')
          }
        })
      }
    }
  }
  getResponsibilities(event){
    console.log(event, 'event')
    if(event.target.value.length >1){
      // check for letter and numbers
      if((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 65 && event.keyCode <= 90)){
        this.jobService.FetchAllResponsibilities(event.target.value).subscribe((Data: any)=>{
          console.log(Data, 'skllls')
          if(Data.StatusCode){
            this.suggestedResponsibilities = Data.ProfileResponsibilities;
            console.log(this.suggestedResponsibilities, 'sillllllll')
          }
        })
      }
    }
  }
  // activateClass(index){
  //   this.commonJobService.changeSideBarIndex(index)
  // }
  onSave() {
    this.submitted = true;
    console.log(this.jobDescriptionForm,"formdetialll",this.jobDescriptionForm.invalid,"dddddddd")
          // stop here if form is invalid
          if (this.jobDescriptionForm.invalid) {
            return;
        }
    console.log(this.jobDescriptionForm.get('qualifications').value,'qualifications valuee')
    console.log(this.jobDescriptionForm.get('rolesAndResponsibility').value,'rolesAndResponsibility valuee')
    // return
    const jdObject = {
      ProfileId: location.pathname.split('/').pop(),
      ProfileName: this.jobDescriptionForm.get('title').value,
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
        if(this.isSameUser){
          this.jobDetail.ProfileDetail.UpdatedDate = updatedData.ProfileDetail.UpdatedDate
          this.isEditJd = false
          document.body.scrollTop = 0; // For Safari
          document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        }else{
          // this.commonJobService.changeSideBarIndex(2)
          this.router.navigate(['myJd']);
        }

      }
    });
  }
}


