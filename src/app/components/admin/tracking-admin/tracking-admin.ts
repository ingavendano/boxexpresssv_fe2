import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PackageService, Package, BulkStatusUpdateRequest } from '../../../services/packages/package.service';
import { TrackingStatusService } from '../../../services/tracking-status.service';
import { TrackingStatus } from '../../../interfaces/tracking-status';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tracking-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './tracking-admin.html',
  styleUrl: './tracking-admin.css',
  providers: [DatePipe]
})
export class TrackingAdmin implements OnInit {
  private packageService = inject(PackageService);
  private statusService = inject(TrackingStatusService);
  private fb = inject(FormBuilder);

  packages = signal<Package[]>([]);
  selectedIds = signal<Set<number>>(new Set());

  searchForm = this.fb.group({
    tripId: [''],
    status: ['']
  });

  // Derived state
  totalSelected = computed(() => this.selectedIds().size);
  isAllSelected = computed(() => {
    const pkgCount = this.packages().length;
    return pkgCount > 0 && this.selectedIds().size === pkgCount;
  });

  statuses = signal<TrackingStatus[]>([]);

  ngOnInit() {
    this.loadStatuses();
    this.loadPackages();
  }

  loadStatuses() {
    this.statusService.getActiveStatuses().subscribe({
      next: (data) => this.statuses.set(data),
      error: (err) => console.error('Error loading statuses', err)
    });
  }

  loadPackages() {
    const filters = this.searchForm.value;
    // Remove empty filters
    const cleanFilters: any = {};
    if (filters.tripId) cleanFilters.tripId = filters.tripId;
    if (filters.status) cleanFilters.status = filters.status;

    this.packageService.searchPackages(cleanFilters).subscribe({
      next: (data) => {
        this.packages.set(data);
        this.selectedIds.set(new Set()); // Reset selection on reload
      },
      error: (err) => console.error('Error loading packages', err)
    });
  }

  toggleSelection(pkgId: number) {
    this.selectedIds.update(ids => {
      const newIds = new Set(ids);
      if (newIds.has(pkgId)) {
        newIds.delete(pkgId);
      } else {
        newIds.add(pkgId);
      }
      return newIds;
    });
  }

  toggleSelectAll(event: any) {
    if (event.target.checked) {
      const allIds = this.packages().map(p => p.id);
      this.selectedIds.set(new Set(allIds));
    } else {
      this.selectedIds.set(new Set());
    }
  }

  async openBulkUpdateModal() {
    if (this.selectedIds().size === 0) return;

    const options = this.statuses().map(s => `<option value="${s.code}">${s.name}</option>`).join('');

    const { value: formValues } = await Swal.fire({
      title: `Actualizar ${this.selectedIds().size} paquetes`,
      html: `
        <select id="swal-status" class="swal2-input">
          <option value="" disabled selected>Seleccione nuevo estado</option>
          ${options}
        </select>
        <input id="swal-location" class="swal2-input" placeholder="Ubicación (opcional)">
        <textarea id="swal-desc" class="swal2-textarea" placeholder="Descripción del evento"></textarea>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        return {
          status: (document.getElementById('swal-status') as HTMLInputElement).value,
          location: (document.getElementById('swal-location') as HTMLInputElement).value,
          description: (document.getElementById('swal-desc') as HTMLInputElement).value
        };
      }
    });

    if (formValues && formValues.status) {
      this.executeBulkUpdate(formValues);
    }
  }

  executeBulkUpdate(data: any) {
    const request: BulkStatusUpdateRequest = {
      packageIds: Array.from(this.selectedIds()),
      statusCode: data.status,
      location: data.location,
      description: data.description
    };

    this.packageService.bulkUpdateStatus(request).subscribe({
      next: () => {
        Swal.fire('Actualizado', 'Los paquetes han sido actualizados exitosamente', 'success');
        this.loadPackages();
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudieron actualizar los paquetes', 'error');
      }
    });
  }
}
