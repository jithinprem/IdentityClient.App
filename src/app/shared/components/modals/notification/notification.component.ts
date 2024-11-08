import { Component } from '@angular/core';
import {BsModalRef} from "ngx-bootstrap/modal";

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {
  public isSuccess: boolean = true
  public title: string = '';
  public message: string = '';

  constructor(public bsModalRef: BsModalRef) {

  }

}
