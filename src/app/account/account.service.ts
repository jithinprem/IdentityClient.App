import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { Register} from "../shared/models/account/register";
import {environment} from "../../environments/environment.development";
import {Login} from "../shared/models/account/login";
import {User} from "../shared/models/account/user";
import {map, of, ReplaySubject} from "rxjs";
import {Router} from "@angular/router";
import {ConfirmEmail} from "../shared/models/account/confirmEmail";
import {ResetPassword} from "../shared/models/account/resetPassword";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  // userSource can be thought as a property => techinically an observable property
  // we can assign a user inside that or remove from that, we specify (1) telling userSource has only size of one
  // only one user can be stored hence
  // user$ is something we can subscribe to to get value from the userSource
  private userSource = new ReplaySubject<User | null>(1);
  public user$ = this.userSource.asObservable();

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }

  public register(model: Register) {
    return this.httpClient.post(`${environment.appUrl}/api/account/register`, model)
  }

  public login(model: Login) {
    return this.httpClient.post<User>(`${environment.appUrl}/api/account/login`, model).pipe(
      map((user: User) => {
        if (user) {
          this.setUser(user);
        }
      })
    )
  }

  public confirmEmail(model: ConfirmEmail){
    return this.httpClient.put(`${environment.appUrl}/api/account/confirm-email`, model);
  }

  public resendEmailConfirmationLink(email: string){
    return this.httpClient.post(`${environment.appUrl}/api/account/resend-email-confirmation-link/${email}`, {});
  }

  public forgotUsernameOrPassword(email: string) {
    return this.httpClient.post(`${environment.appUrl}/api/account/forgot-username-or-password/${email}`, {});
  }

  public resetPassword(model: ResetPassword) {
    return this.httpClient.put(`${environment.appUrl}/api/account/reset-password`, model);
  }

  public logout(){
    localStorage.removeItem(environment.userKey);
    this.userSource.next(null);
    this.router.navigateByUrl('/');
  }

  public getJWT(): string | null{
    const key = localStorage.getItem(environment.userKey)
    if(key) {
      const user: User = JSON.parse(key);
      return user.jwt;
    }
    return null;
  }

  public refreshUser(jwt: string | null): any{
    if(jwt === null) {
      this.userSource.next(null);
      return of(undefined);
    }
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
    return this.httpClient.get<User>(`${environment.appUrl}/api/account/refresh-user-token`, {headers}).pipe(
      map((user: User) => {
        if (user) {
          this.setUser(user);
        }
      })
    )
  }

  private setUser(user: User){
    // we are storing the user inside our local storage at one place
    // also inside our angular application using ReplaySubject
    localStorage.setItem(environment.userKey, JSON.stringify(user));
    this.userSource.next(user);

    // how to get user$
    this.user$.subscribe({
      next: response => console.log(response)
    })
  }
}
