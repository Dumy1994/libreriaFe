import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { TokenStorageService } from '../services/tokenStorage.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
/**
 * Represents the RegisterComponent class.
 */
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
   <div class="col-md-12">
  <div class="card card-container register  p-3">
    <h1 class="">Benvenuto in Book library </h1>
    <p class="grey Ysabeau">Registrati per continuare</p>
    <hr>
    <form
      *ngIf="!isSuccessful"
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
          maxlength="20"
          #username="ngModel"
        />
      </div>
      <div class="form-group">
        <input
          type="email"
          class="input-login"
          placeholder="Inserisci la tua email"
          name="email"
          [(ngModel)]="form.email"
          required
          email
          #email="ngModel"
        />
        <div class="alert-danger" *ngIf="email.errors && f.submitted">
          <div class="text-danger mt-2" *ngIf="email.errors['required']">L'email è obbligatoria</div>
          <div class="text-danger mt-2" *ngIf="email.errors['email']">
            L'email deve essere valida
          </div>
        </div>
      </div>
      <div class="form-group">
        <input
          type="password"
          class="input-login"
          placeholder="Inserisci la password"
          name="password"
          [(ngModel)]="form.password"
          required
          #password="ngModel"
        />
      </div>
      <div class="form-group ">
        <button class="button-login" >Registrati</button>
      </div>
    </form>
    <!-- hai gia un account? -->
    <div class="pt-3 ">
      <p class="grey Ysabeau">
        Hai già un account?
        <a class="p-0 link-login" routerLink="/login" routerLinkActive="active">
          Accedi
        </a>
      </p>
    </div>
  </div>
</div>

  `,
  styles: `

.register{
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
    .register{
        width: 100%;
        border: none;
        box-shadow: none;

    }
}
  `
})
export class RegisterComponent {
  form: any = {
    username: null,
    email: null,
    password: null
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  isLoggedIn = false;

  constructor(private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private router: Router
    ) { }

  ngOnInit(): void {

  }

  onSubmit(): void {
    const { username, email, password } = this.form;

    this.authService.register(username, email, password).subscribe({
      next: data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.router.navigate(['/login']);
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }
}
