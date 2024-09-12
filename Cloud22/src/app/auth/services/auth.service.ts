import { Injectable } from '@angular/core';
import { CognitoUser, CognitoUserPool } from "amazon-cognito-identity-js";
import { environment } from "../../environment/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userPool: CognitoUserPool;

  constructor() {
    this.userPool = new CognitoUserPool({
      UserPoolId: environment.cognito.userPoolId,
      ClientId: environment.cognito.userPoolWebClientId
    });
  }

  getCurrentUser(): CognitoUser | null {
    return this.userPool.getCurrentUser();
  }

  getUsername(): string | null {
    const currentUser = this.getCurrentUser();
    return currentUser ? currentUser.getUsername() : null;
  }

  getCurrentUserEmail(): string | null {
    const idToken = localStorage.getItem("idToken");
    if (!idToken) {
      return null;
    }

    const decodedToken = this.decodeJwtToken(idToken);
    return decodedToken ? decodedToken['email'] : null;
  }

  getCurrentUserRole1(): string[] | null {
    const idToken = localStorage.getItem("idToken");
    if (!idToken) {
      return null;
    }

    const decodedToken = this.decodeJwtToken(idToken);
    return decodedToken && decodedToken['cognito:groups'] ? decodedToken['cognito:groups'] : null;
  }

  getCurrentUserRole2(): string | null {
    try {
      const idToken = localStorage.getItem('idToken');
      if (idToken) {
        console.log("ID TOKEN: " + idToken);
        const decodedToken = this.decodeJwtToken(idToken);
        console.log("Decode token: " + decodedToken);
        console.log("Full decoded token: ", decodedToken);
        console.log("Decode token cognito:groups> " + decodedToken['cognito:groups']);
        if (decodedToken && decodedToken['cognito:groups']) {
          for (let group of decodedToken['cognito:groups']) {
            console.log(group);
            if (group === 'admin') {
              return 'admin';
            }
            if (group === 'RegisteredUser') {
              return 'RegisteredUser';
            }
          }
        }
      }
      return null;
    } catch (error) {
      console.error('Error fetching user role:', error);
      return null;
    }
  }

  getCurrentUserRole(): string | null {
    try {
      const idToken = localStorage.getItem('idToken');
      if (idToken) {
        const decodedToken = this.decodeJwtToken(idToken);
        console.log(decodedToken);
        console.log(decodedToken['given_name']);
        console.log(decodedToken['cognito:groups']);
        if (decodedToken && decodedToken['cognito:groups']) {
          if (decodedToken['cognito:groups'].includes('Administrator')) {
            return 'Administrator';
          }
          if (decodedToken['cognito:groups'].includes('RegisteredUser')) {
            return 'RegisteredUser';
          }
        }
      }
      return null;
    } catch (error) {
      console.error('Error fetching user role:', error);
      return null;
    }
  }

  private decodeJwtToken(token: string): any | null {
    try {
      const [, payload] = token.split('.');
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  }
}
