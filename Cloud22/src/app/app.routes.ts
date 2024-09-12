import { Routes } from '@angular/router';
import {MainPageComponent} from "./main-page/main-page.component";
import {LoginComponent} from "./auth/login/login.component";
import {ConfirmEmailComponent} from "./auth/confirm-email/confirm-email.component";

export const routes: Routes = [

    {
        path: 'main-page',
        component: MainPageComponent,
    },
    {
        path: '',
        component: LoginComponent,
    },
    {
        path: 'confirm-email',
        component: ConfirmEmailComponent
    }
];
