import {Component, OnInit} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {Router, RouterOutlet} from "@angular/router";
import {environment} from "../environment/environment";
import {CognitoUserPool} from "amazon-cognito-identity-js";
import {AuthService} from "../auth/services/auth.service";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit{
  user: any;

  constructor(private router: Router,
              private authService: AuthService) {
  }

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
  }

  logOut(){
    const cognitoUser = this.userPool.getCurrentUser();

    if (cognitoUser) {
      cognitoUser.signOut();
    }

    localStorage.clear();
    this.router.navigate(['']);
  }

}
