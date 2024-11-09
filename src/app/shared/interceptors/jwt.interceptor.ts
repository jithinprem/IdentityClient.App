import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {Observable, take} from 'rxjs';
import {AccountService} from "../../account/account.service";
import {User} from "../models/account/user";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private accountService: AccountService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.accountService.user$.pipe(take(1)).subscribe({
      next: user => {
        // clone from the coming request and add Authorization header
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${user?.jwt}`
          }
        });
      }
    })
    return next.handle(request);
  }
}
