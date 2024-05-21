// import { bootstrapApplication } from '@angular/platform-browser';
// import { appConfig } from './app/app.config';
// import { AppComponent } from './app/app.component';
// import {LoginComponent} from "./app/login/login.component";
// import {MainPageComponent} from "./app/main-page/main-page.component";
//
//
// bootstrapApplication(MainPageComponent, appConfig)
//   .catch((err) => console.error(err));

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';


platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
