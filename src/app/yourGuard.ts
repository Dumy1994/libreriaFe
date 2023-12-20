import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class YourGuard implements CanActivate {
  token = sessionStorage.getItem('auth-token');
  constructor(private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    const isServer = !window.location.hostname;
    if (isServer) {
      // Use a server-side mechanism to handle authentication
      return true; // Or return false or redirect to login page
    }

    const token = sessionStorage.getItem('auth-token');
    if (token != null) {
      return true;
    } else {
      console.log('token is not valid', this.token);
      this.router.navigateByUrl('/login');
      return false;
    }
  }
  checkToken() {
    // if token taket from param  is valid go to reset password page else go to login page
    if (this.token != null) {
      this.router.navigateByUrl('/reset-password');
    } else {
      this.router.navigateByUrl('/login');
    }
  }




}
