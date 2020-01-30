import { Component, Inject, OnInit} from '@angular/core';
import { AdalService } from './shared/services/adal.service';
import { APP_CONFIG, AppConfig } from './config/config';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'jobProject';
  constructor(private adalService: AdalService, @Inject(APP_CONFIG) private config: AppConfig, private router: Router) { }
  ngOnInit() {
    this.adalService.handleCallback();
    this.router.navigate(['/']);
  }
}
