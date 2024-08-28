import { Component } from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {RouterOutlet} from "@angular/router";
import {concatMap, mergeMap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Movie} from "./movie";
import {FilmService} from "./film.service";
import {S3Service} from "../s3.service";
@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {
  //videoUrl: string = "cloud.mkv";
  //movie: Movie | undefined;

  constructor(private s3Service: S3Service) {}

  downloadFilm(bucketName: string, key: string): void {
    this.s3Service.downloadFile(bucketName, key).subscribe({
      next: (blob) => {
        // Kreirajte URL za preuzimanje
        const url = URL.createObjectURL(blob);

        // Kreirajte privremeni link za preuzimanje
        const a = document.createElement('a');
        a.href = url;
        a.download = key; // Postavite naziv fajla koji želite da preuzmete
        document.body.appendChild(a);
        a.click();

        // Očistite URL
        URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error downloading file:', err);
      }
    });
  }
}