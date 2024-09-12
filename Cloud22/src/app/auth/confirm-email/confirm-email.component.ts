import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from "../../environment/environment";
import {CognitoUser, CognitoUserPool} from "amazon-cognito-identity-js";

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.css'
})
export class ConfirmEmailComponent implements OnInit{
  constructor(private router: Router,
              private route: ActivatedRoute) {
  }

  @ViewChild('validationCodeInput') validationCodeInput!: ElementRef;

  validationCode: string = "";
  registerUsername: string = "";

  private userPoolData = {
    UserPoolId: environment.cognito.userPoolId,
    ClientId: environment.cognito.userPoolWebClientId
  };

  private userPool = new CognitoUserPool(this.userPoolData);

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.registerUsername = params['username'];
      console.log("Username:", this.registerUsername);
    });
  }

  confirmValidation(){
    this.validationCode = this.validationCodeInput.nativeElement.value;
    console.log("Validation Code: ", this.validationCode);
    console.log('Username:', this.registerUsername);
    console.log('UserPoolId:', this.userPoolData.UserPoolId);

    const user = {
      Username: this.registerUsername,
      Pool: this.userPool
    }

    const cognitoUser = new CognitoUser(user);

    cognitoUser.confirmRegistration(this.validationCode, true, (err, res) => {
      // if(err){
      //   console.log("UPS... Confirmation failed!");
      //   console.log("ERROR: ", err);
      //   return
      // }

      console.log("YEY... Confirmation successful!");
      console.log("RESULT: ", res);

      this.router.navigate(['']);
    })
  }
}
