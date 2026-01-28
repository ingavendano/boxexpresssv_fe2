import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './login.html',
    styleUrl: './login.css'
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    loginForm: FormGroup;
    isLoading = signal(false);
    showPassword = signal(false);

    constructor() {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]],
            rememberMe: [false]
        });
    }

    togglePassword() {
        this.showPassword.update(v => !v);
    }

    onSubmit() {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        this.isLoading.set(true);
        const { email, password, rememberMe } = this.loginForm.value;

        this.authService.login({ email, password }).subscribe({
            next: (response) => {
                this.isLoading.set(false);

                // Success Alert (Optional, maybe too intrusive for login?)
                // Let's just redirect immediately for smoother UX

                // Role-based redirection
                // Redirect based on role
                if (response.role === 'ROLE_ADMIN') {
                    this.router.navigate(['/admin']);
                } else {
                    this.router.navigate(['/customer/dashboard']);
                }
            },
            error: (err) => {
                this.isLoading.set(false);
                console.error('Login error', err);

                Swal.fire({
                    icon: 'error',
                    title: 'Acceso Denegado',
                    text: err.error?.error || 'Credenciales correo o contraseña incorrectos.',
                    confirmButtonColor: '#1e40af',
                    confirmButtonText: 'Intentar de nuevo'
                });
            }
        });
    }
}
