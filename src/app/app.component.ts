import { Component, Inject, OnInit} from '@angular/core';
import { AdalService } from './shared/services/adal.service';
import { APP_CONFIG, AppConfig } from './config/config';
import { Router } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'jobProject';
  isAuthenticated = false;
  subscription: Subscription;
  constructor(private adalService: AdalService, @Inject(APP_CONFIG) private config: AppConfig, private router: Router) { }
  ngOnInit() {
    this.adalService.handleCallback();
    // this.router.navigate(['/']);
    this.subscription = this.adalService.getUserAuthenticationStatus().subscribe(value => {
      if (value) {
        this.isAuthenticated = value;
      } else {
        // clear messages when empty message received
        this.isAuthenticated = value;
      }
    });
    this.adalService.acquireTokenResilient(this.config.resource).subscribe((token) => {
      console.log(token,'token inside app component')
    });
  }
}
