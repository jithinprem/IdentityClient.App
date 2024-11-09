import { Injectable } from '@angular/core';
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap/modal";
import {Register} from "./models/account/register";
import {NotificationComponent} from "./components/modals/notification/notification.component";

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  public bsModalRef?: BsModalRef;

  constructor(private modalService: BsModalService) { }

  public showNotification(isSuccess: boolean, title: string, message: string) {
    const initialState: ModalOptions = {
      initialState: {
        isSuccess,
        title,
        message
      }
    };
    this.bsModalRef = this.modalService.show(NotificationComponent, initialState);
  }

}
