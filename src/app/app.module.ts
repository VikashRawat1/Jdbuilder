import { BrowserModule } from '@angular/platform-browser';
import { NgModule, } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { JobServiceService } from './shared/services/job-service.service';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './shared/layout/header/header.component';
import { SidebarComponent } from './shared/layout/sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoaderService } from './shared/services/loader.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoaderInterceptor } from './shared/interceptors/loader.interceptors';
import { LoaderComponent } from './shared/loader/loader.component';
// import { Job1ServiceService } from './modules/job/job-service.service';
import {
  MatProgressSpinnerModule
} from '@angular/material';
// import { MaterialUiModule } from './modules/material-ui/material-ui.module';
import { ToastrModule } from 'ngx-toastr';
import {NgxPaginationModule} from 'ngx-pagination';
import { ChartsModule } from 'ng2-charts';
import { Config, APP_CONFIG } from './config/config';
import { AdalService } from './shared/services/adal.service';
import { AdalConfigService } from './shared/services/adal-config.service';
import { InsertAuthTokenInterceptor } from './shared/interceptors/insert-auth-token';
@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    HeaderComponent,
    SidebarComponent,
    LoaderComponent
  ],
  imports: [
    // MaterialUiModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    NgxPaginationModule,
    ToastrModule.forRoot(),
    ChartsModule
  ],
  providers: [JobServiceService, LoaderService, AdalService, AdalConfigService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: InsertAuthTokenInterceptor, multi: true },
    { provide: APP_CONFIG, useValue: {
      apiEndpoint: Config.url,
      clientId: Config.clientID,
      resource: Config.clientID,
      tenantId: Config.tenantID,
      redirectUri: 'http://localhost:4200'
    }}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
