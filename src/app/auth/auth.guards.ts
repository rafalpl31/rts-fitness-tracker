import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuards implements CanActivate, CanLoad {

  constructor(private authService: AuthService, private router: Router) {}

  private determineAccess() {
    if (this.authService.isAuth()) {
      return true;
    } else {
      this.router.navigate(['/login']);
    }
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.determineAccess();
  }

  canLoad(route: Route) {
    return this.determineAccess();
  }
}
