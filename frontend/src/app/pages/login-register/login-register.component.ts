import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NavbarComponent,
    MatSnackBarModule
  ],
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss']
})
export class LoginRegisterComponent {
  activeTab: 'login' | 'register' = 'login';
  loginForm: FormGroup;
  registerForm: FormGroup;
  showPassword = false;
  registerEmailError: string = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(/^\S+@\S+\.\S+$/)]],
      password: ['', [Validators.required, Validators.pattern(/^.{6,}$/)]],
      remember: [false]
    });

    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(/^\S+@\S+\.\S+$/)]],
      password: ['', [Validators.required, Validators.pattern(/^.{6,}$/)]]
    });
  }

  login(): void {
    if (this.loginForm.valid) {
      this.auth.login(this.loginForm.value).subscribe(() => {
        this.snackBar.open('Bienvenido', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/']);
      });
    }
  }

  register(): void {
    if (this.registerForm.valid) {
      const { name, email, password } = this.registerForm.value;
      this.registerEmailError = '';

      this.auth.register({ name, email, password }).subscribe({
        next: () => {
          this.snackBar.open('Registro exitoso', 'Cerrar', { duration: 3000 });

          this.auth.login({ email, password }).subscribe(() => {
            this.snackBar.open('Bienvenido', 'Cerrar', { duration: 3000 });
            this.router.navigate(['/']);
          });
        },
        error: (err) => {
          console.error('ERROR EN REGISTRO:', err);
          if (err.status === 409 || err.error?.message?.includes('exists')) {
            this.registerEmailError = 'Este email ya está en uso';
          } else {
            this.registerEmailError = 'Error inesperado al registrarse';
          }
        }
      });
    }
  }
}
