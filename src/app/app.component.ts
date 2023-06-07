import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ANGULAR_ROUTES } from './constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ohlc';

  constructor(private router: Router) {}

  isHome(): boolean {
    if(this.router.routerState.snapshot.url.startsWith(ANGULAR_ROUTES.HOME)) {
      return true;
    } else {
      return false
    }
  }
}
