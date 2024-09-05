import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {Router, RouterOutlet} from "@angular/router";
import {environment} from "../environment/environment";
import {CognitoUserPool} from "amazon-cognito-identity-js";
import {AuthService} from "../auth/services/auth.service";
import {LambdaService} from "../movies/movie.service";
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

  constructor(private router: Router,
              private authService: AuthService,
              //private movieService: MovieService
              private lambdaService: LambdaService
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


}
