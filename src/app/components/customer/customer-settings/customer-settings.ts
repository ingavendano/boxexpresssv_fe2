
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { CustomerService } from '../../../services/customer/customer.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-customer-settings',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './customer-settings.html',
})
export class CustomerSettingsComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private customerService = inject(CustomerService);
    private router = inject(Router);

    profileForm: FormGroup;
    isLoading = signal(false);
    errorMessage = signal<string | null>(null);
    showPassword = signal(false);

    // Phone country code state
    countryCode = signal('+503');
    isUsa = signal(false);

    constructor() {
        this.profileForm = this.fb.group({
            fullName: ['', [Validators.required, Validators.minLength(3)]],
            email: [{ value: '', disabled: true }, [Validators.required, Validators.email]], // Email usually readonly
            password: ['', [Validators.minLength(6)]], // Optional for update
            phone: ['', [Validators.required, Validators.pattern(/^\d{8,10}$/)]]
        });

        this.loadProfile();
    }

    loadProfile() {
        const user = this.authService.currentUser();
        if (user) {
            this.profileForm.patchValue({
                fullName: user.fullName,
                email: user.email,
            });

            // Parse phone if possible to separate code
            if (user.phone) {
                if (user.phone.startsWith('+1')) {
                    this.countryCode.set('+1');
                    this.isUsa.set(true);
                    this.profileForm.patchValue({ phone: user.phone.replace('+1 ', '').trim() });
                } else if (user.phone.startsWith('+503')) {
                    this.countryCode.set('+503');
                    this.isUsa.set(false);
                    this.profileForm.patchValue({ phone: user.phone.replace('+503 ', '').trim() });
                } else {
                    // Fallback
                    this.profileForm.patchValue({ phone: user.phone });
                }
            }
        }
    }

    toggleCountry() {
        this.isUsa.update(v => !v);
        this.countryCode.set(this.isUsa() ? '+1' : '+503');
    }

    togglePassword() {
        this.showPassword.update(v => !v);
    }

    onSubmit() {
        if (this.profileForm.invalid) {
            this.profileForm.markAllAsTouched();
            return;
        }

        this.isLoading.set(true);
        this.errorMessage.set(null);

        const formValue = this.profileForm.value;
        const fullPhone = `${this.countryCode()} ${formValue.phone}`;

        // Only send password if provided
        const payload: any = {
            fullName: formValue.fullName,
            phone: fullPhone
        };
        if (formValue.password) {
            payload.password = formValue.password;
        }

        this.customerService.updateProfile(payload).subscribe({
            next: (updatedUser) => {
                this.isLoading.set(false);
                this.authService.updateCurrentUser(updatedUser);
                Swal.fire({
                    icon: 'success',
                    title: 'Perfil Actualizado',
                    text: 'Tus datos han sido actualizados correctamente.',
                    timer: 1500,
                    showConfirmButton: false
                });
            },
            error: (err) => {
                this.isLoading.set(false);
                console.error('Update error', err);
                const backendError = err.error?.error || 'Error al actualizar perfil.';
                this.errorMessage.set(backendError);
            }
        });
    }
}
