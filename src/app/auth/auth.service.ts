import { Subject } from 'rxjs';

import { AuthData } from './auth-data.model';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { TrainingService } from '../training/training.service';
import { UiService } from '../shared/ui.service';

@Injectable()
export class AuthService {
  public authChange = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(
    private router: Router,
    private fireAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private uiService: UiService
  ) {}

  initAuthListener() {
    this.fireAuth.authState.subscribe(user => {
      if (user) {
        this.authChange.next(true);
        this.router.navigate(['/training']);
        this.isAuthenticated = true;
      } else {
        this.trainingService.cancelFireSubscriptions();
        this.authChange.next(false);
        this.router.navigate(['/login']);
        this.isAuthenticated = false;
      }
    });
  }

  registerUser(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);
    this.fireAuth
      .auth
      .createUserWithEmailAndPassword(
        authData.email,
        authData.password
      )
      .then(() => {
        this.uiService.loadingStateChanged.next(false);
      })
      .catch((err) => {
        this.uiService.showSnackbar(err.message, null, 3000);
        this.uiService.loadingStateChanged.next(false);
      });
  }

  login(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);
    this.fireAuth
      .auth
      .signInWithEmailAndPassword(
        authData.email,
        authData.password
      )
      .then(() => {
        this.uiService.loadingStateChanged.next(false);
      })
      .catch((err) => {
        this.uiService.showSnackbar(err.message, null, 3000);
        this.uiService.loadingStateChanged.next(false);
      });
  }

  logout() {
    this.fireAuth.auth.signOut();
  }

  isAuth() {
    return this.isAuthenticated;
  }
}
