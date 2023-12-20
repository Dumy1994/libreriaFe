import { BookDetailComponent } from './components/book-detail.component';
import { Routes } from '@angular/router';
import { YourGuard } from './yourGuard';

export const routes: Routes = [
  {path: 'bookList', loadComponent: ()=> import('./pages/book-list.component').then(m => m.BookListComponent), canActivate: [YourGuard]},
  {path: 'book/:id', loadComponent: ()=> import('./components/book-detail.component').then(m => m.BookDetailComponent), canActivate: [YourGuard]},
  {path: 'login', loadComponent: ()=> import('./auth/login.component').then(m => m.LoginComponent)},
  {path: 'register', loadComponent: ()=> import('./auth/register.component').then(m => m.RegisterComponent)},
  {path: 'request-reset-password', loadComponent: ()=> import('./auth/request-reset.component').then(m => m.RequestResetComponent)},
  {path: 'reset-password/:token', loadComponent: ()=> import('./auth/reset-password.component').then(m => m.ResetPasswordComponent)},
  {path: '', redirectTo: '/bookList', pathMatch: 'full'},
];
