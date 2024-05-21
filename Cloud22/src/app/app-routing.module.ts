import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import {MainPageComponent} from "./main-page/main-page.component";

const routes: Routes = [
    {path : '', component: LoginComponent},
    {path : 'main-page', component: MainPageComponent}

  ];

  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class  AppRoutingModule { }
