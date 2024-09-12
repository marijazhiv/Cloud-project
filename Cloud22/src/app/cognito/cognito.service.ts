import { Injectable } from '@angular/core';
import {environment} from "../environment/environment";
import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession,
  CognitoIdToken,
  ISignUpResult
} from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: environment.cognito.userPoolId,
  ClientId: environment.cognito.userPoolWebClientId
};

const userPool = new CognitoUserPool(poolData);

@Injectable({
  providedIn: 'root'
})
export class CognitoService {

  constructor() { }
}
