import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackageService } from '../../../services/packages/package.service';
import { TranslatePipe } from '../../../pipes/translate.pipe';

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './customer-profile.html',
  styleUrl: './customer-profile.css',
})
export class CustomerProfile {
  private packageService = inject(PackageService);

  packages = signal<any[]>([]);

  // KPIs
  packagesInTransit = computed(() =>
    this.packages().filter(p => p.currentStatus !== 'DELIVERED' && p.currentStatus !== 'CANCELLED').length
  );

  recentPackages = computed(() => this.packages().slice(0, 5));

  constructor() {
    this.loadPackages();
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
}
