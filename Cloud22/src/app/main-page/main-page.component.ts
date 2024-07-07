import { Component } from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {RouterOutlet} from "@angular/router";
import {DownloadService} from "./download.service";
@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {

  constructor(private downloadService: DownloadService) { }

  downloadFile(fileId: string): void {
    this.downloadService.getDownloadUrl("1719917953").subscribe(
        data => {
          if (data.url) {
            window.location.href = data.url;
          } else {
            console.error('Download URL is missing');
          }
        },
        error => {
          console.error('Error:', error);
        }
    );
  }

}
