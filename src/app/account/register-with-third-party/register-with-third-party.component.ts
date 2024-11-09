import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AccountService} from "../account.service";
import {take} from "rxjs";
import {User} from "../../shared/models/account/user";
import {RegisterWithExternal} from "../../shared/models/account/registerWithExternal";

@Component({
  selector: 'app-register-with-third-party',
  templateUrl: './register-with-third-party.component.html',
  styleUrls: ['./register-with-third-party.component.scss']
})
export class RegisterWithThirdPartyComponent implements OnInit{

  public registrationForm: FormGroup = new FormGroup({});
  public submitted: boolean = false;
  public provider: string | null = null;
  public access_token: string | null = null;
  public userId: string | null = null;
  public errorMessages: string[] = [];

  constructor(
    private accountService: AccountService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
        this.accountService.user$.pipe(take(1)).subscribe({
          next: (user: User | null)=> {
            if(user) {
              this.router.navigateByUrl('/');
            }else {
              this.activatedRoute.queryParamMap.subscribe({
                next: (params: any) => {
                  this.provider = this.activatedRoute.snapshot.paramMap.get('provider');
                  this.access_token = params.get("access_token");
                  this.userId = params.get("userId");

                  if(this.provider && this.access_token && this.userId &&
                    (this.provider === "facebook" || this.provider === "google") ) {
                    this.initializeForm();
                  }else {
                    this.router.navigateByUrl('/account/register')
                  }
                }
              })
            }
          }
        })
  }

  public register() {
    this.submitted = true;
    this.errorMessages = [];
    if(this.registrationForm.valid && this.userId && this.access_token && this.provider) {
      const firstName = this.registrationForm.get('firstName')?.value;
      const lastName = this.registrationForm.get('lastName')?.value;

      const model = new RegisterWithExternal(firstName, lastName, this.userId, this.access_token, this.provider);
      this.accountService.registerWithThirdParty(model).subscribe({
        next: (response: any)=> {
          this.router.navigateByUrl('/');
        },
        error: (error) => {
          if(error.error.errors) {
            this.errorMessages = error.error.errors;
          } else{
            this.errorMessages.push(error.error);
          }
        }
      })
    }
  }

  private initializeForm() {
    this.registrationForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
    })
  }




}
