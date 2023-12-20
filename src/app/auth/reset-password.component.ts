import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormsModule,
  Validators,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Component for resetting password.
 *
 * This component allows the user to reset their password by providing a new password and confirming it.
 * It includes form validation and communicates with the server to update the password.
 *
 */
@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="container-fluid form">
      <div class="row" *ngIf="CurrentState == 'Wait'">
        <div class="col-md-12  close-form">
          <h2>Loading...</h2>
        </div>
      </div>
      <div class="row" *ngIf="CurrentState == 'NotVerified'">
        <div class="col-md-12">
          <h2>Invalid URL.</h2>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div class="card card-signin my-5">
            <div class="card-body">
              <h2 class="card-title text-center">Imposta una nuova password</h2>
              <div>
                <div id="errorMsg" *ngIf="errorMessage">
                  <span>{{ errorMessage }}</span>
                </div>
                <div id="successMsg" *ngIf="successMessage">
                  <span>{{ successMessage }}</span>
                </div>
                <form
                  action=""
                  [formGroup]="ResponseResetForm"
                  (ngSubmit)="ResetPassword(ResponseResetForm)"
                >
                  <div class="form-group mt-2">
                    <input
                      _ngcontent-c0=""
                      class="form-control form-control-lg"
                      placeholder="Nuova Password"
                      type="password"
                      id="password"
                      formControlName="password"
                    />
                    <span
                      *ngIf="
                        !ResponseResetForm.get('password')?.valid &&
                        !IsResetFormValid
                      "
                      class="help-block"
                      >Password è richiesto un minimo di 6 caratteri.</span
                    >
                  </div>
                  <div class="form-group mt-2">
                    <input
                      _ngcontent-c0=""
                      class="form-control form-control-lg"
                      placeholder="Conferma Nuova Password"
                      type="password"
                      id="cpassword"
                      formControlName="confirmPassword"
                    />
                    <span
                      *ngIf="
                        !ResponseResetForm.get('confirmPassword')?.valid &&
                        !IsResetFormValid
                      "
                      class="help-block"
                      >.
                    </span>
                    <span
                      *ngIf="
                        ResponseResetForm.get('confirmPassword')?.valid &&
                        ResponseResetForm.get('confirmPassword')?.value !=
                          ResponseResetForm.get('newPassword')?.value &&
                        !IsResetFormValid
                      "
                      class="help-block"
                      >Le password non corrispondono.</span
                    >
                  </div>
                  <div class="form-group d-flex justify-content-center mt-2">
                    <div>
                      <button type="submit" class="  btn btn-primary">
                        Salva Password
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class ResetPasswordComponent {
  errorMessage?: string;
  successMessage?: string;
  password?: null;
  CurrentState: any;
  IsResetFormValid = true;

  ResponseResetForm = this.fb.group({
    token: [this.password],
    password: ['', [Validators.required, Validators.minLength(4)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(4)]],
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.CurrentState = 'Wait';
    this.route.params.subscribe((params) => {
      this.password = params['token'];
      console.log(this.password);
      this.VerifyToken();
    });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      console.log(params);
    });
  }

  VerifyToken() {
    this.authService.ValidPasswordToken({ password: this.password }).subscribe(
      (data) => {
        this.CurrentState = 'Valid';
      },
      (err) => {
        this.CurrentState = 'NotVerified';
      }
    );
  }

  Validate(passwordFormGroup: any) {
    const new_password = passwordFormGroup.controls['password'].value;
    const confirm_password =
      passwordFormGroup.controls['confirmPassword'].value;

    if (confirm_password.length <= 0) {
      return null;
    }

    if (confirm_password !== new_password) {
      return {
        doesNotMatch: true,
      };
    }

    return null;
  }

  ResetPassword(form: any) {
    let formSend = {
      token: this.password,
      password: this.ResponseResetForm.value.password,
      confirmPassword: this.ResponseResetForm.value.confirmPassword,
    };
    if (formSend) {
      this.IsResetFormValid = true;
      this.authService.newPassword(formSend).subscribe(
        (data) => {
          this.ResponseResetForm.reset();
          this.successMessage = data.message;
          this.successMessage = '';
          this.router.navigate(['login']);
        },
        (err) => {
          if (err.error.message) {
            this.errorMessage = err.error.message;
          }
        }
      );
    } else {
      this.IsResetFormValid = false;
    }
  }
}
