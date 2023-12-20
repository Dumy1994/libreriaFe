import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TokenStorageService } from '../services/tokenStorage.service';

/**
 * Represents the LoginComponent class.
 * This component is responsible for handling the login functionality.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  template: `
   <div class="col-md-12 ">
  <div class="card card-container login">
    <h1 class="">Benvenuto in Book library</h1>
    <p class="grey Ysabeau">Accedi per continuare</p>
    <hr>
    <form
      *ngIf="!isLoggedIn"
      name="form"
      (ngSubmit)="f.form.valid && onSubmit()"
      #f="ngForm"
      novalidate
    >
      <div class="form-group">
        <input
          type="text"
          class="input-login"
          placeholder="Inserisci username"
          name="username"
          [(ngModel)]="form.username"
          required
          #username="ngModel"
        />
      </div>
      <div class="form-group">
        <input
          type="password"
          class="input-login"
          name="password"
          placeholder="Inserisci la tua password"
          [(ngModel)]="form.password"
          required
          minlength="6"
          #password="ngModel"
        />
      </div>

      <div class="form-group mt-3">
        <button class="button-login">
          Accedi
        </button>
      </div>
      <div class="form-group">
        <div
        class="text-danger mt-2"
          role="alert"
          *ngIf="isLoginFailed"
        >
          Username o password errati
        </div>
      </div>

    </form>
     <!-- password dimenticata  -->
     <div class="pt-3 ">
      <p class="grey Ysabeau">
        Non hai un account?
        <a class="p-0 link-login" routerLink="/register" routerLinkActive="active">
          Registrati
        </a>
      </p>
      <p class="grey Ysabeau">
        Password dimenticata?
        <a class="p-0 link-login" routerLink="/request-reset-password" routerLinkActive="active">
          Clicca qui
        </a>
      </p>
    </div>
  </div>
</div>

  `,
  styles: `
  .login{
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 20px;
    box-shadow: 0 0 10px #ccc;
    margin-top: 6vh;
    padding: 20px;
    position: absolute;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
    width: 50%;

}
/* screen and (max-width: 768px) */
@media screen and (max-width: 768px) {
    .container{
        width: 100%;
    }
    .login{
        width: 100%;
        border: none;
        box-shadow: none;

    }
}

  `
})
export class LoginComponent {

  form: any = {
    username: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  name?: string;

  constructor(private authService: AuthService,
     private tokenStorage: TokenStorageService,
     private router: Router
     ) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
      this.name = this.tokenStorage.getUser().username;
      console.log(this.tokenStorage.getUser().username)
    }
      if (this.isLoggedIn) {
        this.router.navigate(['/']);
      }

  }

  onSubmit(): void {
    const { username, password } = this.form;

    this.authService.login(username, password).subscribe({
      next: data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        this.reloadPage();
        this.router.navigate(['/']);

      },
      error: err => {
        // this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    });
  }

  reloadPage(): void {
    window.location.reload();
  }

}
