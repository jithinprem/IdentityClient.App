import {Component, OnInit} from '@angular/core';
import {PlayService} from "./play.service";

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {

  constructor(
    private playService: PlayService,
  ) {
  }
  public message: string | null= null;

    ngOnInit(): void {
      this.playService.getPlayers().subscribe({
        next: (response: any) => {
          this.message = response.value.message;
        },
        error: (err: any) => {
          console.log(err);
        }
      })
    }

}
