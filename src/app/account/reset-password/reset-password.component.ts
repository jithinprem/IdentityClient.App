import {Component, OnInit} from '@angular/core';
import {SharedService} from "../../shared/shared.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AccountService} from "../account.service";
import {ActivatedRoute, Router} from "@angular/router";
import {take} from "rxjs";
import {User} from "../../shared/models/account/user";
import {ResetPassword} from "../../shared/models/account/resetPassword";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit{

  public resetPasswordForm: FormGroup = new FormGroup({});
  public token: string | null = null;
  public email: string | null = null;
  public submitted: boolean = false;
  public errorMessages: string[]= [];

  constructor(
    private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
  }
    ngOnInit(): void {
        this.accountService.user$.pipe(take(1)).subscribe({
          next: (user: User | null)=> {
            if(user) {
              this.router.navigateByUrl('/');
            }else {
              this.activatedRoute.queryParamMap.subscribe(params => {
                this.token = params.get("token");
                this.email = params.get("email");

                if(this.token && this.email) {
                  this.initializeForm(this.email);
                } else{
                  this.router.navigateByUrl('/');
                }
              })
            }
          }
        })
    }

    public initializeForm(userName: string) {
      this.resetPasswordForm = this.formBuilder.group({
        email: [{value: userName, disabled: true}],
        newPassword: ['', [Validators.required, Validators.minLength(6)]]
      })
    }

    public resetPassword() {
      this.submitted = true;
      this.errorMessages = [];

      if(this.resetPasswordForm.valid && this.email && this.token) {
        const model: ResetPassword = {
          token: this.token,
          email: this.email,
          newPassword: this.resetPasswordForm.get("newPassword")?.value
        };
        this.accountService.resetPassword(model).subscribe({
          next: (response: any) => {
            this.sharedService.showNotification(true, response.value.title, response.value.message);
            this.router.navigateByUrl('/account/login');
          }, error: error => {
            if (error.error.errors) {
              this.errorMessages = error.error.errors;
            } else{
              this.errorMessages.push(error.error);
            }
          }
        })
      }
    }

}
