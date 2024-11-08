import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './components/errors/not-found/not-found.component';
import { ValidationMessagesComponent } from './components/errors/validation-messages/validation-messages.component';
import {RouterModule} from "@angular/router";
import { NotificationComponent } from './components/modals/notification/notification.component';
import {BsModalService, ModalModule} from "ngx-bootstrap/modal";



@NgModule({
  declarations: [
    NotFoundComponent,
    ValidationMessagesComponent,
    NotificationComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ModalModule.forRoot()
  ],
  providers: [
    BsModalService
  ],
  exports: [
    RouterModule,
    ValidationMessagesComponent,
  ]
})
export class SharedModule { }
