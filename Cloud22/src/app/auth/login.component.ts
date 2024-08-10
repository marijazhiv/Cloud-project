import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {RouterLink, RouterOutlet} from "@angular/router";
import {environment} from "../environment/environment";
import {CognitoUserAttribute, CognitoUserPool} from "amazon-cognito-identity-js";

// @Component({
//   selector: 'app-root',
//   standalone: true,
//     imports: [RouterOutlet,
//         ReactiveFormsModule, RouterLink
//     ],
//   templateUrl: './auth.component.html',
//   styleUrl: './auth.component.css'
// })
@Component({
  selector: 'app-auth',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isCreated: any ;
  userForm: any;

  registerFirstName: string = '';
  registerLastName: string = '';
  registerUsername: string = '';
  registerEmail: string = '';
  registerPassword: string = '';
  registerBirthDate: string = '';

  private userPoolData = {
    UserPoolId: environment.cognito.userPoolId,
    ClientId: environment.cognito.userPoolWebClientId
  };

  private userPool = new CognitoUserPool(this.userPoolData);

  ngOnInit() {
    const signUpButton = document.getElementById('signUp') as HTMLElement | any;
    const signInButton = document.getElementById('signIn') as HTMLElement | any;
    const container = document.getElementById('container') as HTMLElement | any;

    signUpButton.addEventListener('click', () => {
      container.classList.add("right-panel-active");
    });

    signInButton.addEventListener('click', () => {
      container.classList.remove("right-panel-active");
    });
    this.userForm = new FormGroup({
      first_name: new FormControl(''),
      last_name : new FormControl(''),
      date_of_birth: new FormControl(''),
      username: new FormControl(''),
      email : new FormControl(''),
      password: new FormControl('')

    });
  }
  signUp() {

    const userEmailAttribute= {
      Name: 'email',
      Value: this.registerEmail
    };

    const  userGivenNameAttribute = {
      Name: 'given_name',
      Value: this.registerFirstName
    };

    const userFamilyNameAttribute = {
      Name: 'family_name',
      Value: this.registerLastName
    };

    const userBirthDateAttribute = {
      Name: 'birthdate',
      Value: this.registerBirthDate
    };

    const attributeList: CognitoUserAttribute[] = [];
    attributeList.push(new CognitoUserAttribute(userEmailAttribute));
    attributeList.push(new CognitoUserAttribute(userGivenNameAttribute));
    attributeList.push(new CognitoUserAttribute(userFamilyNameAttribute));
    attributeList.push(new CognitoUserAttribute((userBirthDateAttribute)));

    this.userPool.signUp(this.registerUsername, this.registerPassword, attributeList, [], (err, result) => {
      if(err){
        console.log("UPS... Registration failed!");
        console.log("ERROR: ", err);
        return;
      }

      console.log('YEY... Registration successful!');
      console.log("RESULT: ", result);
    })
  }

  verify() {

  }

  signIn() {

  }
}

