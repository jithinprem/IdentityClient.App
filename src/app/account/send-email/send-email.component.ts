import {Component, OnInit} from '@angular/core';
import {SharedService} from "../../shared/shared.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AccountService} from "../account.service";
import {ActivatedRoute, Router} from "@angular/router";
import {take} from "rxjs";
import {User} from "../../shared/models/account/user";

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.scss']
})
export class SendEmailComponent implements OnInit{

  public emailForm: FormGroup = new FormGroup({});
  public submitted: boolean = false;
  public mode: string | undefined;
  public errorMessages: string[] = [];


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
          }
          else{
            const mode = this.activatedRoute.snapshot.paramMap.get("mode");
            if(mode) {
              this.mode = mode;
              this.initializeForm();
            }
          }
        }
      })
    }

    public initializeForm() {
      this.emailForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
      })
    }

    public sendEmail() {
      this.submitted = true;
      this.errorMessages = [];
      if(this.emailForm.valid){
        if(this.mode?.includes('resend-email-confirmation-link')) {
          this.accountService.resendEmailConfirmationLink(this.emailForm.get('email')?.value).subscribe({
            next: (response: any) => {
              this.sharedService.showNotification(true, response.value.title, response.value.message);
              this.router.navigateByUrl('/account/login');
            },
            error: error => {
              if (error.error.errors) {
                this.errorMessages = error.error.errors;
              } else{
                this.errorMessages.push(error.error);
              }
            }
          })
        } else if(this.mode?.includes('forgot-username-or-password')){
          this.accountService.forgotUsernameOrPassword(this.emailForm.get('email')?.value).subscribe({
            next: (response: any) => {
              this.sharedService.showNotification(true, response.value.title, response.value.message);
              this.router.navigateByUrl('/account/login');
            },
            error: error => {
              if (error.error.errors) {
                this.errorMessages = error.error.errors;
              } else{
                this.errorMessages.push(error.error);
              }
            }
          });
        }
      }
    }

    public cancel() {
      this.router.navigateByUrl('/account/login')
    }

}
