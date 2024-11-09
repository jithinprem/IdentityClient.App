import {AfterViewInit, Component, ElementRef, Inject, OnInit, Renderer2, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AccountService} from "../account.service";
import {SharedService} from "../../shared/shared.service";
import {ActivatedRoute, Router} from "@angular/router";
import {take} from "rxjs";
import {User} from "../../shared/models/account/user";
import {LoginWithExternal} from "../../shared/models/account/loginWithExternal";
import {DOCUMENT} from "@angular/common";
import {CredentialResponse} from "google-one-tap";
import {jwtDecode} from "jwt-decode";

declare const FB: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {

  @ViewChild('googleButton', {static:true}) googleButton: ElementRef = new ElementRef({});

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
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document,
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

  public loginWithFacebook(){
    FB.login(async (fbResult: any) => { // this could be coming from the script we added in index.html
      if(fbResult.authResponse) {
        const accessToken = fbResult.authResponse.accessToken;
        const userId = fbResult.authResponse.userID;
        console.log(fbResult);
        this.accountService.loginWithThirdParty(new LoginWithExternal(accessToken, userId, "facebook")).subscribe({
          next: _ => {
            if(this.returnUrl){
              this.router.navigateByUrl(this.returnUrl);
            } else{
              this.router.navigateByUrl('/');
            }
          },
          error: (error) => {
            this.sharedService.showNotification(false, "Failed", error.error);
          }
        })
      } else {
        this.sharedService.showNotification(false, "Failed", "Unable to login with your facebook")
      }
    })
  }

  public resendEmailConfirmationLink(){
    this.router.navigateByUrl('/account/send-email/resend-email-confirmation-link');
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
        {size: 'medium', shape: "rectangular", text:'signin_with', logo_alignment:'center'}
      )
    }
  }

  private async googleCallback(response: CredentialResponse){
    const decodedToken: any = jwtDecode(response.credential);
    this.accountService.loginWithThirdParty(new LoginWithExternal(response.credential, decodedToken.sub, "google"))
      .subscribe({
        next: _ => {
          if(this.returnUrl){
            this.router.navigateByUrl(this.returnUrl);
          } else {
            this.router.navigateByUrl('/');
          }
        }, error: error => {
          this.sharedService.showNotification(false, "Failed", error.error);
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
