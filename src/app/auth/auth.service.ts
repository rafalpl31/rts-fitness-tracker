import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Store } from '@ngrx/store';
import { AuthData } from './auth-data.model';
import { TrainingService } from '../training/training.service';
import { UiService } from '../shared/ui.service';
import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';
import * as Auth from './auth.actions';

@Injectable()
export class AuthService {
  constructor(
    private router: Router,
    private fireAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private uiService: UiService,
    private store: Store<fromRoot.State>
  ) {}

  initAuthListener() {
    this.fireAuth.authState.subscribe((user) => {
      if (user) {
        this.store.dispatch(new Auth.SetAuthenticated());
        this.router.navigate(['/training']);
      } else {
        this.store.dispatch(new Auth.SetUnauthenticated());
        this.trainingService.cancelFireSubscriptions();
        this.router.navigate(['/login']);
      }
    });
  }

  registerUser(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading());
    this.fireAuth
      .auth
      .createUserWithEmailAndPassword(
        authData.email,
        authData.password
      )
      .then(() => {
        this.store.dispatch(new UI.StopLoading());
      })
      .catch((err) => {
        this.uiService.showSnackbar(err.message, null, 3000);
        this.uiService.loadingStateChanged.next(false);
        this.store.dispatch(new UI.StopLoading());
      });
  }

  login(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading());
    this.fireAuth
      .auth
      .signInWithEmailAndPassword(
        authData.email,
        authData.password
      )
      .then(() => {
        this.store.dispatch(new UI.StopLoading());
      })
      .catch((err) => {
        this.uiService.showSnackbar(err.message, null, 3000);
        this.store.dispatch(new UI.StopLoading());
      });
  }

  logout() {
    this.fireAuth.auth.signOut();
  }
}
