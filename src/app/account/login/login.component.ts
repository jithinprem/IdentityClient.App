import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AccountService} from "../account.service";
import {SharedService} from "../../shared/shared.service";
import {ActivatedRoute, Router} from "@angular/router";
import {take} from "rxjs";
import {User} from "../../shared/models/user";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public logInForm: FormGroup = new FormGroup({});
  public submitted = false;
  public errorMessages: string[] = [];
  public returnUrl: string | null = null;

  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.accountService.user$.pipe(take(1)).subscribe(
      {
        next: (user: User | null) => {
          if (user) {
            this.router.navigateByUrl('/');
          } else {
            this.activatedRoute.queryParamMap.subscribe(params => {
              if (params) {
                this.returnUrl = params.get('returnUrl');
              }
            });
          }
        }
      });
  }
  ngOnInit() {
    this.initializeForm();
  }

  public login(): void {
    this.submitted = true;
    this.errorMessages = [];

    if(this.logInForm.invalid){
      return;
    }
    this.accountService.login(this.logInForm.value).subscribe({
      next: () => {
        if(this.returnUrl) {
          this.router.navigateByUrl(this.returnUrl);
        } else {
          this.sharedService.showNotification(true, "login successful", "welcome");
          this.router.navigateByUrl('/');
        }
      },
      error: (error) => {
        if(error.error.errors) {
          this.errorMessages = error.error.errors;
        } else{
          this.errorMessages.push(error.error);
        }
        console.log(error);
      }
    })
  }

  private initializeForm(): void {
    this.logInForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]], // Validators.pattern() can also be used.
      password: ['', [Validators.required, Validators.minLength(6)]],
    })
  }
}
