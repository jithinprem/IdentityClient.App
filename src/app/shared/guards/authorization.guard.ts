import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {map, Observable} from "rxjs";
import {User} from "../models/account/user";
import {inject} from "@angular/core";
import {AccountService} from "../../account/account.service";
import {SharedService} from "../shared.service";

export const authorizationGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => {

  const accountService: AccountService = inject(AccountService);
  const sharedService: SharedService = inject(SharedService);
  const router: Router = inject(Router);

  return accountService.user$.pipe(
    map((user: User | null) => {
      if (user) {
        return true;
      } else {
        sharedService.showNotification(false, 'Restricted Area', 'Leave immediately.');
        router.navigate(['account/login'], {queryParams: {returnUrl: state.url}}); // if you are accessing a protected url without logging, the protected url data is passed to login
        return false;
      }
    })
  );
};
