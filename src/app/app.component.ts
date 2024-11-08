import {Component, OnInit} from '@angular/core';
import {AccountService} from "./account/account.service";
import {map} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Client.App';

  constructor(
    private accountService: AccountService
  ) {
  }

  ngOnInit() {
    this.refreshUser();
  }

  private refreshUser() {
    const jwt = this.accountService.getJWT();
    if(jwt) {
      this.accountService.refreshUser(jwt).subscribe({
        next(_:any) {
        },
        error: (_: any) => {
          this.accountService.logout();
        }
      })
    } else {
      this.accountService.refreshUser(null).subscribe();
    }
  }
}
