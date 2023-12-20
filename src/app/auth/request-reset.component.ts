import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
/**
 * Component for requesting password reset.
 *
 * This component allows the user to enter their email address and receive a password reset link.
 *
 */
@Component({
  selector: 'app-request-reset',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, FormsModule, ReactiveFormsModule],
  template: `


  <div class="col-md-12">
    <div class="card card-container register  p-3">
      <h1 class="">Richiedi il reset della password</h1>
      <p class="grey Ysabeau">
        Inserisci la tua email e ti invieremo un link per resettare la tua
        password
      </p>
      <hr>
      <form
        name="form"
        [formGroup]="RequestResetForm"
         (ngSubmit)="RequestResetUser(RequestResetForm)"
        #f="ngForm"
        novalidate
      >
        <div class="form-group ">
          <input _ngcontent-c0="" class="input-login"
           placeholder="Inscerisci la tua email"
          type="text" id="email" formControlName="email" />
          </div>
        <div class="form-group ">
          <button class="button-login" >Invia email</button>
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
        <p class="grey Ysabeau">
          Non hai un account?
          <a class="p-0 link-login" routerLink="/register" routerLinkActive="active">
            Registrati
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
export class RequestResetComponent {
  RequestResetForm: FormGroup = new FormGroup({});
  forbiddenEmails: any;
  errorMessage: string = '';
  successMessage: string = '';
  IsvalidForm = true;

  constructor(
    private authService: AuthService,
    private router: Router,
   ) {

  }


  ngOnInit() {

    this.RequestResetForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email], this.forbiddenEmails),
    });
  }


  RequestResetUser(form : FormGroup) {
    console.log(form)
    if (form.valid) {
      this.IsvalidForm = true;
      this.authService.requestReset(this.RequestResetForm.value).subscribe(
        data => {
          this.RequestResetForm.reset();
          this.successMessage = "L'emeil è stata inviata con successo";
          setTimeout(() => {
            this.successMessage = '';
            this.router.navigate(['home']);
          }, 1000);
        },
        err => {

          if (err.error.message) {
            this.errorMessage = err.error.message;
          }
        }
      );
    } else {
      this.IsvalidForm = false;
    }
  }
}
