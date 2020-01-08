import { BrowserModule } from '@angular/platform-browser';
import { NgModule, } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JobListingComponent } from './job-listing/job-listing.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { JobDetailComponent } from './job-detail/job-detail.component';
import { JobServiceService } from './services/job-service.service';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { HeaderComponent } from './shared/layout/header/header.component';
import { SidebarComponent } from './shared/layout/sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatChipsModule, MatFormFieldModule, MatIconModule, MatAutocompleteModule} from '@angular/material';
@NgModule({
  declarations: [
    AppComponent,
    JobListingComponent,
    PageNotFoundComponent,
    JobDetailComponent,
    HeaderComponent,
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatAutocompleteModule
  ],
  providers: [JobServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
