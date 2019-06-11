import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import * as fromRoot from '../../app.reducer';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() sidenavToggle = new EventEmitter<void>();
  isAuth$: Observable<boolean>;
  authSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit() {
    this.isAuth$ = this.store.select(fromRoot.getIsAuth);
  }

  onLogout() {
    this.authService.logout();
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

}
