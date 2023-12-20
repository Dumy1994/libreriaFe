import { Component } from '@angular/core';
import { TokenStorageService } from '../services/tokenStorage.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

/**
 * Represents the navigation bar component of the application.
 */
@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div>
      <nav class="navbar nav-container navbar-expand p-0 justify-content-around">
        <a href="#" class="nav-logo d-flex p-2"><img class="" src="../../assets/bl.png" alt="logo"></a>
        <ul class="navbar-nav mr-auto" routerLinkActive="active">
          <li class="nav-item ">
            <a  class="nav-link" routerLink="bookList">LIBRERIA</a>
          </li>
        </ul>

        <ul class="navbar-nav ml-auto" *ngIf="!isLoggedIn">
          <li class="nav-item">
            <a class="nav-link" routerLink="register">Registrati</a>
          </li>
          <li class="nav-item">
            <a  class="nav-link" routerLink="login">Login</a>
          </li>
        </ul>

        <ul class="navbar-nav ml-auto" *ngIf="isLoggedIn">
          <li class="nav-item">
            <p   class="nav-link">{{ username }}</p>
          </li>
          <li class="nav-item">
            <a href class="nav-link" (click)="logout()">LogOut</a>
          </li>
        </ul>
      </nav>
    </div>
  `,
  styles: `
    .nav-container{
      background-color: #f4f4f4;
      border-bottom: 1px solid #e5e5e5;
      height: 50px;
      font-family: 'Noto Serif', serif;
      font-size: 16px;
      overflow: hidden;
    }
    .nav-logo{
      height: 90px;
      object-fit: contain;
      margin-bottom: 10px;
    }


  `
})
export class NavBarComponent {
  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username?: string;

  /**
   * Constructs a new instance of the NavBarComponent.
   * @param tokenStorageService - The token storage service.
   */
  constructor(private tokenStorageService: TokenStorageService) { }

  /**
   * Initializes the component.
   */
  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');

      this.username = user.username;
    }
  }

  /**
   * Logs out the user.
   */
  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
