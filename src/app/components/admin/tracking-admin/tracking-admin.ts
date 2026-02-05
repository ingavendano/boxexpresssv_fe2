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
  // Helper to convert hex to rgba
  private hexToRgba(hex: string, alpha: number): string {
    let r = 0, g = 0, b = 0;
    if (!hex) return `rgba(107, 114, 128, ${alpha})`; // Default gray

    if (hex.length === 4) {
      r = parseInt("0x" + hex[1] + hex[1]);
      g = parseInt("0x" + hex[2] + hex[2]);
      b = parseInt("0x" + hex[3] + hex[3]);
    } else if (hex.length === 7) {
      r = parseInt("0x" + hex[1] + hex[2]);
      g = parseInt("0x" + hex[3] + hex[4]);
      b = parseInt("0x" + hex[5] + hex[6]);
    }
    return `rgba(${r},${g},${b},${alpha})`;
  }

  getStatusStyles(status: any) {
    const color = status?.color || '#6B7280';
    return {
      'background-color': this.hexToRgba(color, 0.1),
      'color': color,
      'border': `1px solid ${this.hexToRgba(color, 0.2)}`
    };
  }

  viewPackage(pkg: Package) {
    const statusStyles = this.getStatusStyles(pkg.currentStatus);
    const styleString = `background-color: ${statusStyles['background-color']}; color: ${statusStyles['color']}; border: ${statusStyles['border']}`;

    Swal.fire({
      title: 'Detalles del Paquete',
      html: `
        <div class="overflow-hidden rounded-lg border border-gray-200">
          <table class="w-full text-sm text-left">
            <tbody class="divide-y divide-gray-100">
              <tr class="bg-gray-50">
                <td class="px-4 py-3 font-semibold text-gray-600 w-1/3">Tracking ID</td>
                <td class="px-4 py-3 font-mono text-blue-600">${pkg.trackingId}</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-semibold text-gray-600">Remitente</td>
                <td class="px-4 py-3">${pkg.senderName}</td>
              </tr>
              <tr class="bg-gray-50">
                <td class="px-4 py-3 font-semibold text-gray-600">Destinatario</td>
                <td class="px-4 py-3">${pkg.receiverName}</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-semibold text-gray-600">Estado</td>
                <td class="px-4 py-3">
                  <span class="px-2 py-1 rounded-full text-xs font-semibold" style="${styleString}">
                    ${pkg.currentStatus.name}
                  </span>
                </td>
              </tr>
              <tr class="bg-gray-50">
                <td class="px-4 py-3 font-semibold text-gray-600">Peso</td>
                <td class="px-4 py-3 font-mono">${pkg.weight ? pkg.weight + ' lb' : '-'}</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-semibold text-gray-600">Trip ID</td>
                <td class="px-4 py-3 font-mono">${pkg.tripId || '-'}</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-semibold text-gray-600">Descripción</td>
                <td class="px-4 py-3">${pkg.description}</td>
              </tr>
            </tbody>
          </table>
        </div>
      `,
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#334155', // Slate-700
      width: '32rem'
    });
  }

  editPackage(pkg: Package) {
    Swal.fire({
      title: 'Editar Paquete',
      text: `Funcionalidad de edición completa para ${pkg.trackingId} pendiente de implementación.`,
      icon: 'info'
    });
  }

  deletePackage(pkg: Package) {
    Swal.fire({
      title: '¿Eliminar paquete?',
      text: `Esta acción no se puede deshacer. Se eliminará el paquete ${pkg.trackingId} y todo su historial.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.packageService.deletePackage(pkg.id).subscribe({
          next: () => {
            Swal.fire('¡Eliminado!', 'El paquete ha sido eliminado.', 'success');
            this.loadPackages();
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Error', 'No se pudo eliminar el paquete.', 'error');
          }
        });
      }
    });
  }
}
