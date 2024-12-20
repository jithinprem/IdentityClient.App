import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {ConfirmEmailComponent} from "./confirm-email/confirm-email.component";
import {SendEmailComponent} from "./send-email/send-email.component";
import {ResetPasswordComponent} from "./reset-password/reset-password.component";
import {RegisterWithThirdPartyComponent} from "./register-with-third-party/register-with-third-party.component";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'confirm-email', component: ConfirmEmailComponent},
  {path: 'send-email/:mode', component: SendEmailComponent},
  {path: 'reset-password', component: ResetPasswordComponent},
  {path: 'third-party/:provider', component: RegisterWithThirdPartyComponent}
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
})
export class AccountRoutingModule { }
