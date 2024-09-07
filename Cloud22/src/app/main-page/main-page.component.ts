import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {Router, RouterOutlet} from "@angular/router";
import {environment} from "../environment/environment";
import {CognitoUserPool} from "amazon-cognito-identity-js";
import {AuthService} from "../auth/services/auth.service";
import {LambdaService} from "../movies/movie.service";
import {S3Service} from "../../services/s3.service";
import {S3UploadService} from "../../services/s3-upload.service";
import {SubscriptionService} from "../../services/subscription.service";
//import {MovieService} from "../movies/movie.service";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit{
  user: any;
  userRole: any;
  // title: string = '';
  // description: string = '';
  // actors: string[] = [];
  // directors: string[] = [];
  // genres: string[] = [];
  results: any[] = [];

  keyInput: string = '';
  keyInput1: string = '';
  keyInput2: string = '';

  movies: any[] = [];

  #username = '';
  subscriptionType = '';
  subscriptionValue = '';
  #email = '';

  username:any
  email:any

  selectedFile: Blob | undefined;
  title1: string = '';
  description1: string = '';
  actors1: string = '';
  directors1: string = '';
  genres1: string = '';

  fileUrl: string | null = null;

  constructor(private router: Router,
              private authService: AuthService,
              //private movieService: MovieService
              private lambdaService: LambdaService,
              private s3Service: S3Service, private s3UploadService: S3UploadService,
              private subscriptionService: SubscriptionService
              ) {
  }

  @ViewChild('title') title!: ElementRef;
  @ViewChild('description') description!: ElementRef;
  @ViewChild('actors') actors!: ElementRef;
  @ViewChild('directors') directors!: ElementRef;
  @ViewChild('genres') genres!: ElementRef;

  private userPoolData = {
    UserPoolId: environment.cognito.userPoolId,
    ClientId: environment.cognito.userPoolWebClientId
  };

  private userPool = new CognitoUserPool(this.userPoolData);

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem("user") || '')
    console.log(this.user);

    console.log("CURRENT USER: ")
    console.log(this.authService.getCurrentUser());

    console.log("CURRENT USER> USERNAME: " + this.authService.getUsername());
    console.log("CURRENT USER> EMAIL: " + this.authService.getCurrentUserEmail());
    console.log("CURRENT USER> ROLE: " + this.authService.getCurrentUserRole());


    this.userRole = this.authService.getCurrentUserRole();
    this.username=this.authService.getUsername();
    this.email=this.authService.getCurrentUserEmail();
  }

  logOut(){
    const cognitoUser = this.userPool.getCurrentUser();

    if (cognitoUser) {
      cognitoUser.signOut();
    }

    localStorage.clear();
    this.router.navigate(['']);
  }

  /*
  search() {
    const searchParams = {
      title: this.title,
      description: this.description,
      actors: this.actors,
      directors: this.directors,
      genres: this.genres
    };

    this.movieService.searchMovies(searchParams).subscribe((response: any) => {
      this.results = response;
      console.log(this.results);
    }, error => {
      console.error('Error occurred:', error);
    });
  }

   */

  async search() {
    try {
      const parseList = (input: string) => input.split(',').map(item => item.trim()).filter(item => item.length > 0);

      const params = {
        title: this.title.nativeElement.value,
        description: this.description.nativeElement.value,
        actors: parseList(this.actors.nativeElement.value),
        directors: parseList(this.directors.nativeElement.value),
        genres: parseList(this.genres.nativeElement.value),
      };

      //console.log(this.title);
      console.log(params);
      const results = await this.lambdaService.searchContent(params);
      const responseBody = JSON.parse(results.body);

      console.log("SUCCESSFULY");
      console.log(results);
      console.log(responseBody);
      this.results = responseBody;
    } catch (error) {
      console.error('Error searching content:', error);
    }
  }

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



  // onFileSelected(event: any): void {
  //     const file = event.target.files[0];
  //     if (file) {
  //         this.selectedFile = file;
  //     }
  // }

  // uploadFilm(): void {
  //     if (this.selectedFile) {
  //         const actorsArray = this.actors.split(',').map(actor => actor.trim());
  //         const directorsArray = this.directors.split(',').map(director => director.trim());
  //         const genresArray = this.genres.split(',').map(genre => genre.trim());
  //
  //         this.s3UploadService.uploadMovie(
  //             this.selectedFile,
  //             this.title,
  //             this.description,
  //             actorsArray,
  //             directorsArray,
  //             genresArray
  //         ).subscribe({
  //             next: (response) => {
  //                 console.log('Successfully uploaded file:', response);
  //             },
  //             error: (err) => {
  //                 console.error('Error uploading file:', err);
  //             },
  //         });
  //     } else {
  //         console.error('No file selected for upload');
  //     }
  // }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  // async onUpload(): Promise<void> {
  //   if (this.selectedFile) {
  //     try {
  //       const result = await this.s3UploadService.uploadFile(
  //           this.selectedFile,
  //           'Movie Title', // Zamenite odgovarajućim vrednostima
  //           'Movie Description',
  //           ['Actor1', 'Actor2'],
  //           ['Director1'],
  //           ['Genre1', 'Genre2']
  //       );
  //       console.log('Upload successful:', result);
  //     } catch (error) {
  //       console.error('Upload failed:', error);
  //     }
  //   }


  async onUpload(): Promise<void> {
    if (this.selectedFile) {
      try {
        // Pretvori unos iz polja u nizove za actors, directors i genres
        const actorsArray = this.actors1.split(',').map(actor => actor.trim());
        const directorsArray = this.directors1.split(',').map(director => director.trim());
        const genresArray = this.genres1.split(',').map(genre => genre.trim());

        const result = await this.s3UploadService.uploadFile(
            this.selectedFile,
            this.title1,        // Title koji je unet u formu
            this.description1,  // Description koji je unet u formu
            actorsArray,       // Actors kao niz
            directorsArray,    // Directors kao niz
            genresArray        // Genres kao niz
        );
        console.log('Upload successful:', result);
      } catch (error) {
        console.error('Upload failed:', error);
      }
    } else {
      console.error('No file selected');
    }
  }

  // Funkcija koja se poziva prilikom submit-a forme
  subscriptions: any;
  onSubmit() {
    // Prvo šaljemo podatke u DynamoDB
    this.subscriptionService.saveSubscription(this.username, this.subscriptionType, this.subscriptionValue, this.email)
        .subscribe(
            response => {
              console.log('Subscription saved:', response);
              // Nakon uspešnog čuvanja, šaljemo email za verifikaciju
              this.subscriptionService.sendVerificationEmail(this.email).subscribe(
                  emailResponse => {
                    console.log('Verification email sent:', emailResponse);
                    alert('Uspešno ste se pretplatili. Verifikacioni email je poslat.');
                  },
                  emailError => {
                    console.error('Error sending verification email:', emailError);
                    alert('Došlo je do greške pri slanju verifikacionog emaila.');
                  }
              );
            },
            error => {
              console.error('Error saving subscription:', error);
              alert('Došlo je do greške pri čuvanju pretplate.');
            }
        );
  }




}
