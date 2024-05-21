import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {RouterLink, RouterOutlet} from "@angular/router";

// @Component({
//   selector: 'app-root',
//   standalone: true,
//     imports: [RouterOutlet,
//         ReactiveFormsModule, RouterLink
//     ],
//   templateUrl: './login.component.html',
//   styleUrl: './login.component.css'
// })
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isCreated: any ;
  userForm: any;

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

  }

  verify() {

  }

  signIn() {

  }
}

