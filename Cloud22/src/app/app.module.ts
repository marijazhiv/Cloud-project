import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {AppRoutingModule} from "./app-routing.module";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {MainPageComponent} from "./main-page/main-page.component";
import {AddMovieComponent} from "./add-movie/add-movie.component";
import { ConfirmEmailComponent } from './auth/confirm-email/confirm-email.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainPageComponent,
    ConfirmEmailComponent,

  ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        AppRoutingModule,
        HttpClientModule,
        AddMovieComponent,
    ],
  providers: [HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule {

 }
