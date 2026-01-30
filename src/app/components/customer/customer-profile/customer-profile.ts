import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PackageService } from '../../../services/packages/package.service';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { AuthService } from '../../../services/auth/auth.service';
import { CustomerService } from '../../../services/customer/customer.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [CommonModule, TranslatePipe, ReactiveFormsModule],
  templateUrl: './customer-profile.html',
  styleUrl: './customer-profile.css',
})
export class CustomerProfile {
  authService = inject(AuthService);
  private packageService = inject(PackageService);
  private customerService = inject(CustomerService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);

  packages = signal<any[]>([]);
  showEditModal = signal(false);

  // KPIs
  packagesInTransit = computed(() =>
    this.packages().filter(p => p.currentStatus !== 'DELIVERED' && p.currentStatus !== 'CANCELLED').length
  );

  recentPackages = computed(() => this.packages().slice(0, 5));

  profileForm = this.fb.group({
    fullName: ['', Validators.required],
    phone: ['', Validators.required],
    password: [''] // Optional
  });

  constructor() {
    this.loadPackages();
    this.route.queryParams.subscribe(params => {
      if (params['action'] === 'edit') {
        this.openEditModal();
      }
    });
  }

  loadPackages() {
    this.packageService.getMyPackages().subscribe({
      next: (data) => this.packages.set(data),
      error: (err) => console.error('Error loading packages', err)
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'RECEIVED': return 'bg-blue-100 text-blue-800';
      case 'IN_TRANSIT': return 'bg-yellow-100 text-yellow-800';
      case 'WAREHOUSE_ES': return 'bg-purple-100 text-purple-800';
      case 'READY_FOR_PICKUP': return 'bg-green-100 text-green-800';
      case 'DELIVERED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  }

  openEditModal() {
    const user = this.authService.currentUser();
    if (user) {
      this.profileForm.patchValue({
        fullName: user.fullName,
        phone: user.phone || ''
      });
    }
    this.showEditModal.set(true);
  }

  updateProfile() {
    if (this.profileForm.invalid) return;

    this.customerService.updateProfile(this.profileForm.value as any).subscribe({
      next: (user) => {
        // Update local state via AuthService
        this.authService.updateCurrentUser(user);
        this.showEditModal.set(false);
        Swal.fire('Actualizado', 'Perfil actualizado correctamente', 'success');
      },
      error: () => Swal.fire('Error', 'No se pudo actualizar el perfil', 'error')
    });
  }
}
