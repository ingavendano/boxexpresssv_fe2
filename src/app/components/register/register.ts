import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  showPassword = signal(false);

  // Phone country code state
  countryCode = signal('+503'); // Default to ESA
  isUsa = signal(false);

  constructor() {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{8,10}$/)]]
    });
  }

  toggleCountry() {
    this.isUsa.update(v => !v);
    this.countryCode.set(this.isUsa() ? '+1' : '+503');
  }

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const formValue = this.registerForm.value;
    const fullPhone = `${this.countryCode()} ${formValue.phone}`;

    this.authService.register({
      fullName: formValue.fullName,
      email: formValue.email,
      password: formValue.password,
      phone: fullPhone
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/']); // Redirect to home/dashboard
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Registration error', err);
        // Simple error handling - can be improved based on backend response structure
        this.errorMessage.set('Error en el registro. Verifique sus datos o intente más tarde.');
      }
    });
  }
}
