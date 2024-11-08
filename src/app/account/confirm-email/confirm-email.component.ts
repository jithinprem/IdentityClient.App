import {Component, OnInit} from '@angular/core';
import {SharedService} from "../../shared/shared.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AccountService} from "../account.service";
import {take} from "rxjs";
import {User} from "../../shared/models/account/user";
import {ConfirmEmail} from "../../shared/models/account/confirmEmail";

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss']
})
export class ConfirmEmailComponent implements OnInit {

  public success: boolean = true;

  constructor(
    private accountService: AccountService,
    private sharedService: SharedService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }
    ngOnInit(): void {
        this.accountService.user$.pipe(take(1)).subscribe({
          next: (user: User|null)=> {
            if (user) {
              this.router.navigateByUrl("/");
            } else {
              this.activatedRoute.queryParamMap.subscribe(params => {
                if (params) {
                  const confirmEmail: ConfirmEmail = {
                    token: params.get("token"),
                    email: params.get("email")
                  }
                  this.accountService.confirmEmail(confirmEmail).subscribe({
                    next: (response: any)=> {
                      this.success = true;
                      this.sharedService.showNotification(true, response.value.title, response.value.message);
                    },
                    error: (err: any) => {
                      this.success= false;
                      this.sharedService.showNotification(false, "Failed", err.error)
                    }
                  })
                }
              })
            }
          }
        });
    }

    public resendEmailConfirmationLink() {
      this.router.navigateByUrl('/account/send-email/resend-email-confirmation-link');
    }

}
