import { Component } from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {RouterLink, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-root',
  standalone: true,
    imports: [RouterOutlet,
        ReactiveFormsModule, RouterLink
    ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isCreated: any ;
  userForm: any;

  signUp() {

  }

  verify() {

  }

  signIn() {

  }
}

