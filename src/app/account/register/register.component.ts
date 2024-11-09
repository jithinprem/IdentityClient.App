import {AfterViewInit, Component, ElementRef, Inject, OnInit, Renderer2, ViewChild} from '@angular/core';
import {AccountService} from "../account.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {SharedService} from "../../shared/shared.service";
import {Router} from "@angular/router";
import {take} from "rxjs";
import {User} from "../../shared/models/account/user";
import {CredentialResponse} from "google-one-tap";
import {jwtDecode} from "jwt-decode";
import {DOCUMENT} from "@angular/common";

declare const FB: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, AfterViewInit{

  @ViewChild('googleButton', {static:true}) googleButton: ElementRef = new ElementRef({});

  public registerForm: FormGroup = new FormGroup({});
  public submitted = false;
  public errorMessages: string[] = [];

  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private router: Router,
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document,
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
    this.initializeGoogleButton();
    this.initializeForm();
  }

  ngAfterViewInit() {
    const script1 = this._renderer2.createElement('script');
    script1.src = 'https://accounts.google.com/gsi/client';
    script1.async = 'true';
    script1.defer = 'true';
    this._renderer2.appendChild(this._document.body, script1)
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

  public registerWithFacebook() {
    FB.login(async (fbResult: any) => {
      if(fbResult.authResponse) {
        const accessToken = fbResult.authResponse.accessToken;
        const userId = fbResult.authResponse.userID;
        this.router.navigateByUrl(`/account/third-party/facebook?access_token=${accessToken}&userId=${userId}`);
      } else {
        this.sharedService.showNotification(false, "Failed", "Unable to register with your facebook")
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

  private initializeGoogleButton() {
    (window as any).onGoogleLibraryLoad = () => {
      // @ts-ignore
      google.accounts.id.initialize({
        client_id: '386270772245-t751i9ej97f3m95f3t5139k8ampefi1n.apps.googleusercontent.com',
        callback: this.googleCallback.bind(this),
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      // @ts-ignore
      google.accounts.id.renderButton(
        this.googleButton.nativeElement,
        {size: 'medium', shape: "rectangular", text:'signup_with', logo_alignment:'center'}
      )
    }
  }

  private async googleCallback(response: CredentialResponse){
    const decodedToken: any = jwtDecode(response.credential);
    this.router.navigateByUrl(`/account/third-party/google?access_token=${response.credential}&userId=${decodedToken.sub}`); // sub basically contains the userId from the google
  }

}
