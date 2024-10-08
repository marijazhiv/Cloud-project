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
  username1:any
  email:any
  //feed: string = '';
  feed: any[] = []; // Koristite niz za čuvanje filmova


  selectedFile: Blob | undefined;
  title1: string = '';
  description1: string = '';
  actors1: string = '';
  directors1: string = '';
  genres1: string = '';

  fileUrl: string | null = null;

  deleteId: any;

  filmId: string = '';
  rating: number = 1;

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

  subscriptions: any;
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

    this.getSubs();
    this.loadFeed();
    this.loadMovies();
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

  async getSubs() {
    try {

      const results = await this.lambdaService.getSubscriptions(this.username);
      const responseBody = JSON.parse(results.body);

      console.log("SUCCESSFULY");
      console.log(results);
      console.log(responseBody);
      this.subscriptions = responseBody.subscriptions;
      console.log(this.subscriptions);
    } catch (error) {
      console.error('Error searching content:', error);
    }
  }

  async deleteMovie(){
    try {
      // Poziv metode deleteContent iz LambdaService
      const result = await this.lambdaService.deleteContent(this.deleteId);

      // Obrada odgovora
      console.log('Film je uspešno obrisan:', result);
      // Opciono: Dodaj logiku za obaveštavanje korisnika o uspešnom brisanju ili osvežavanje liste
    } catch (error) {
      // Obrada greške
      console.error('Došlo je do greške pri brisanju filma:', error);
    }
  }

  // downloadFilm(bucketName: string, key: string): void {
  //   this.s3Service.downloadFile(bucketName, key).subscribe({
  //     next: (blob) => {
  //       // Kreirajte URL za preuzimanje
  //       const url = URL.createObjectURL(blob);
  //
  //       // Kreirajte privremeni link za preuzimanje
  //       const a = document.createElement('a');
  //       a.href = url;
  //       a.download = key; // Postavite naziv fajla koji želite da preuzmete
  //       document.body.appendChild(a);
  //       a.click();
  //
  //       // Očistite URL
  //       URL.revokeObjectURL(url);
  //       this.refreshFeed();
  //
  //     },
  //
  //     error: (err) => {
  //       console.error('Error downloading file:', err);
  //     }
  //   });
  // }



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
        console.log('Upload successfully:', result);
        alert('Upload successfully')
        //await this.refreshFeed();
        await this.loadMovies();
      } catch (error) {
        console.error('Upload failed:', error);
      }
    } else {
      console.error('No file selected');
    }
  }

  // Funkcija koja se poziva prilikom submit-a forme
  // onSubmit() {
  //   // Prvo šaljemo podatke u DynamoDB
  //   this.subscriptionService.saveSubscription(this.username, this.subscriptionType, this.subscriptionValue, this.email)
  //       .subscribe(
  //           response => {
  //             console.log('Subscription saved:', response);
  //              this.refreshFeed();
  //             // Nakon uspešnog čuvanja, šaljemo email za verifikaciju
  //             this.subscriptionService.sendVerificationEmail(this.email).subscribe(
  //                 emailResponse => {
  //                   console.log('Verification email sent:', emailResponse);
  //                   alert('Uspešno ste se pretplatili. Verifikacioni email je poslat.');
  //                 },
  //                 emailError => {
  //                   console.error('Error sending verification email:', emailError);
  //                   alert('Došlo je do greške pri slanju verifikacionog emaila.');
  //                 }
  //             );
  //           },
  //           error => {
  //             console.error('Error saving subscription:', error);
  //             alert('Došlo je do greške pri čuvanju pretplate.');
  //           }
  //       );
  // }

  async onSubscribe() {
    try {
      const response = await this.lambdaService.subscribeUser(
          this.username,
          this.subscriptionType,
          this.subscriptionValue,
          this.email
      );

      console.log('Subscription successful:', response);
      await this.refreshFeed();
      alert('Uspešno ste se pretplatili. Verifikacioni email je poslat.');
    } catch (error) {
      console.error('Error during subscription:', error);
      alert('Došlo je do greške pri slanju verifikacionog emaila.');
    }


  }


    async updateSubscription(subscription: any) {
      try {
        const result = await this.lambdaService.updateSubscription(subscription.id, subscription.subscription_value);
        console.log('Subscription updated:', result);
        alert('Update Subscription successfully');
        //await this.refreshFeed();
        // Dodaj logiku za updateovanje liste, prikaz poruke uspeha, itd.
      } catch (error) {
        console.error('Error updating subscription:', error);
        alert('Update Subscription unsuccessfully');
      }
    }

  async deleteSubscription(subscription: any) {
    try {
      const result = await this.lambdaService.deleteSubscription(subscription.id);
      console.log('Subscription deleted:', result);
      alert('Delete Subscription successfully');
      //await this.refreshFeed();
      // Nakon uspešnog brisanja, ukloni stavku iz liste prikazanih pretplata
    } catch (error) {
      console.error('Error deleting subscription:', error);
      alert('Delete Subscription unsuccessfully');
    }
  }

  onRateMovie() {
    this.lambdaService.rateMovie(this.filmId, this.username, this.rating)
        .then(response => {
          console.log('Movie rated successfully:', response);
           this.refreshFeed();
          alert('Movie rated successfully');

        })
        .catch(error => {
          console.error('Error rating movie:', error);
          alert('Error rating movie');
        });
  }

  // fetchFeed(): void {
  //   this.lambdaService.getFeed(this.username).then(
  //       (response) => {
  //         console.log('Lambda response:', response); // Ispisuje JSON odgovor u konzolu
  //         this.feed = response;
  //       },
  //       (error) => {
  //         console.error('Error fetching feed:', error);
  //       }
  //   );
  // }

  async loadFeed() {
    try {
      const response = await this.lambdaService.getFeed(this.username);
      console.log('Lambda response:', response); // Ispisuje ceo odgovor iz Lambda funkcije

      if (response && response.body) {
        // Parsirajte JSON string iz body
        this.feed = JSON.parse(response.body);
      } else {
        this.feed = [];
      }
    } catch (error) {
      console.error('Error loading feed:', error);
    }
  }

  async refreshFeed() {
    try {
      await this.loadFeed();
      console.log('Feed refreshed successfully');
    } catch (error) {
      console.error('Error refreshing feed:', error);
    }
  }

  updatedId: string = "";
  updatedTitle: string = "";
  updatedDescription: string = "";
  updatedActors: string = "";
  updatedDirectors: string = "";
  updatedGenres: string = "";

  async onUpdate() {
    try {
      const parseList = (input: string) => input.split(',').map(item => item.trim()).filter(item => item.length > 0);

      const params = {
        id: this.updatedId,
        title: this.updatedTitle,
        description: this.updatedDescription,
        actors: parseList(this.updatedActors),
        directors: parseList(this.updatedDirectors),
        genres: parseList(this.updatedGenres),
      };

      console.log(params);
      const results = await this.lambdaService.updateContent(params);
      const responseBody = JSON.parse(results.body);

      console.log("SUCCESSFULY");
      console.log(results);
      console.log(responseBody);
      this.results = responseBody;
    } catch (error) {
      console.error('Error searching content:', error);
    }
  }

  async loadMovies() {
    try {
      this.movies = await this.lambdaService.getAllMovies();
      console.log('Movies:', this.movies); // Proverite sadržaj u konzoli
    } catch (error) {
      console.error('Error loading movies:', error);
    }
  }

  async downloadFilm() {
    const filmId = this.keyInput; // Primer ID-a filma
    this.username1 = this.authService.getUsername(); // Primer korisničkog imena

    try {
      const response = await this.lambdaService.downloadContent(filmId, this.username1);
      console.log('URL za preuzimanje:', this.username1);
      await this.refreshFeed();


      window.open(response.url, '_blank'); // Otvori URL za preuzimanje
    } catch (error) {
      console.error('Error downloading film:', error);
    }
  }

  async downloadMovie(movieId: any) {
    const username = this.authService.getUsername();

    if (!username) {
      console.error('Username is null or undefined');
      return;
    }

    const movieIdString = String(movieId);

    try {
      const response = await this.lambdaService.downloadContent(movieIdString, username);
      console.log('URL za preuzimanje:', response.url);

      // Fetch the video data as a Blob
      const fileResponse = await fetch(response.url);
      const blob = await fileResponse.blob();

      // Create a download link using the Blob object
      const link = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      link.href = url;

      // Postavi ime fajla i tip, možeš podesiti ime prema movieId-u ili nekim metapodacima
      link.download = `${movieIdString}.mp4`;

      // Simuliraj klik na link
      document.body.appendChild(link);
      link.click();

      // Očisti link nakon preuzimanja
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      await this.refreshFeed();
    } catch (error) {
      console.error('Error downloading film:', error);
    }






}


  async deleteMovieContent(id: number){
    try {
      // Poziv metode deleteContent iz LambdaService
      this.deleteId = String(id);
      const result = await this.lambdaService.deleteContent(this.deleteId);

      // Obrada odgovora
      console.log('Film je uspešno obrisan:', result);
      await this.loadMovies();
      alert('Film je uspešno obrisan!');
      // Opciono: Dodaj logiku za obaveštavanje korisnika o uspešnom brisanju ili osvežavanje liste
    } catch (error) {
      // Obrada greške
      console.error('Došlo je do greške pri brisanju filma:', error);
      alert('Film nije uspešno obrisan!');
    }
  }


  showRate: boolean = false;
  rateMovie1() {
    this.showRate = true;
    console.log(this.showRate);
  }

  onRateMovieContent(id: number) {
    this.filmId = String(id);
    this.lambdaService.rateMovie(this.filmId, this.username, this.rating)
        .then(response => {
          console.log('Movie rated successfully:', response);
          this.refreshFeed();
          console.log(response.statusCode);
          if (response.statusCode === 200) {
            console.log('Movie rated successfully:', response);
            this.refreshFeed();
            alert('Movie rated successfully');
          } else if (response.statusCode === 400) {
            console.log('You have already rated this movie:', response);
            alert('You have already rated this movie');
          }

        })
        .catch(error => {
          console.error('Error rating movie:', error);
          alert('Error rating movie');
        });
  }

  selectedMovieId: number | null = null;

  showUpdateForm(movieId: number) {
    this.selectedMovieId = movieId; // Postavi ID filma koji se azurira
  }

  async onUpdateContent() {
    try {
      const parseList = (input: string) => input.split(',').map(item => item.trim()).filter(item => item.length > 0);

      const params = {
        id: String(this.selectedMovieId),
        title: this.updatedTitle,
        description: this.updatedDescription,
        actors: parseList(this.updatedActors),
        directors: parseList(this.updatedDirectors),
        genres: parseList(this.updatedGenres),
      };

      console.log(params);
      const results = await this.lambdaService.updateContent(params);
      const responseBody = JSON.parse(results.body);

      console.log("SUCCESSFULY");
      console.log(results);
      console.log(responseBody);

      alert('Movie content successfully updated!');
      this.results = responseBody;
      this.loadMovies();
    } catch (error) {
      console.error('Error searching content:', error);
      alert('Error updating movie content. Please try again.');
    }
  }
}
