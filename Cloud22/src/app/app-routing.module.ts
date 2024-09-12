import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import {MainPageComponent} from "./main-page/main-page.component";
import {ConfirmEmailComponent} from "./auth/confirm-email/confirm-email.component";

const routes: Routes = [
    {path : '', component: LoginComponent},
    {path : 'main-page', component: MainPageComponent},
    {path: 'confirm-email/:username', component: ConfirmEmailComponent}

  ];

  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class  AppRoutingModule { }
