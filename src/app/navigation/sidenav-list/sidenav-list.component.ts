import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromRoot from '../../app.reducer';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit {

  @Output() closeSidenavList = new EventEmitter<void>();
  isAuth$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit() {
    this.isAuth$ = this.store.select(fromRoot.getIsAuth);
  }

  onLogout() {
    this.onClose();
    this.authService.logout();
  }

  onClose() {
    this.closeSidenavList.emit();
  }

}
