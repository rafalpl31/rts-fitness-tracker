import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../app.reducer';
import { take } from 'rxjs/operators';

@Injectable()
export class AuthGuards implements CanActivate, CanLoad {

  constructor(private store: Store<fromRoot.State>) {}

  private determineAccess() {
    return this.store.select(fromRoot.getIsAuth).pipe(take(1));
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.determineAccess();
  }

  canLoad(route: Route) {
    return this.determineAccess();
  }
}
