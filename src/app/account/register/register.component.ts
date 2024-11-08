import {Component, OnInit} from '@angular/core';
import {AccountService} from "../account.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {SharedService} from "../../shared/shared.service";
import {Router} from "@angular/router";
import {take} from "rxjs";
import {User} from "../../shared/models/user";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit{

  public registerForm: FormGroup = new FormGroup({});
  public submitted = false;
  public errorMessages: string[] = [];

  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private router: Router
  ) {
    this.accountService.user$.pipe(take(1)).subscribe({
      next: (user: User | null) => {
        if(user) {
          this.router.navigateByUrl('/');
        }
      }
    })
  }
  ngOnInit() {
    this.initializeForm();
  }

  public register(): void {
    this.submitted = true;
    this.errorMessages = [];

    if(this.registerForm.invalid){
      return;
    }
    this.accountService.register(this.registerForm.value).subscribe({
      next: (response: any) => {
        this.sharedService.showNotification(true, response.value.title, response.value.message);
        this.router.navigateByUrl('/account/login');
        console.log(response);
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
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      email: ['', [Validators.required, Validators.email]], // Validators.pattern() can also be used.
      password: ['', [Validators.required, Validators.minLength(6)]],
    })
  }

}
