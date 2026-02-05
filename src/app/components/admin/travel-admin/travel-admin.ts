import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TravelService, Travel } from '../../../services/travel.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-travel-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  templateUrl: './travel-admin.html',
  styleUrl: './travel-admin.css'
})
export class TravelAdminComponent implements OnInit {
  private travelService = inject(TravelService);
  private fb = inject(FormBuilder);

  travels = signal<Travel[]>([]);
  isLoading = signal(true);
  isModalOpen = signal(false);
  isEditing = signal(false);

  travelForm: FormGroup;
  minDate: string = new Date().toISOString().split('T')[0];

  constructor() {
    this.travelForm = this.fb.group({
      id: [null],
      origin: ['Houston, TX', [Validators.required]],
      destination: ['San Miguel, ES', [Validators.required]],
      closingDate: ['', [Validators.required]],
      departureDate: ['', [Validators.required]],
      arrivalDate: ['', [Validators.required]],
      status: ['SCHEDULED', [Validators.required]],
      transportType: ['AIR', [Validators.required]]
    });
  }

  ngOnInit() {
    this.loadTravels();
  }

  loadTravels() {
    this.isLoading.set(true);
    // Since we are admin, we want ALL travels, not just public ones
    // But currently TravelService.getAllTravels uses /api/travels which is correct
    this.travelService.getAllTravels().subscribe({
      next: (data) => {
        this.travels.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
        Swal.fire('Error', 'No se pudieron cargar los viajes', 'error');
      }
    });
  }

  openModal(travel?: Travel) {
    this.isModalOpen.set(true);
    if (travel) {
      this.isEditing.set(true);
      // Ensure dates are in YYYY-MM-DD format for HTML date inputs
      const formValue = {
        ...travel,
        closingDate: this.formatDate(travel.closingDate),
        departureDate: this.formatDate(travel.departureDate),
        arrivalDate: this.formatDate(travel.arrivalDate)
      };
      this.travelForm.patchValue(formValue);
    } else {
      this.isEditing.set(false);
      this.travelForm.reset({
        origin: 'Houston, TX',
        destination: 'San Miguel, ES',
        status: 'SCHEDULED',
        transportType: 'AIR'
      });
    }
  }

  private formatDate(date: string | any): string {
    if (!date) return '';
    // If it's already a string like '2024-01-20', split works or returns it
    // If it comes as full ISO with time, split takes first part
    if (typeof date === 'string') {
      return date.split('T')[0];
    }
    // If it's an array (rare Spring default), handle it? 
    // Usually Spring returns string ISO-8601.
    return date;
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.isEditing.set(false);
    this.travelForm.reset();
  }

  onSubmit() {
    if (this.travelForm.invalid) {
      this.travelForm.markAllAsTouched();
      return;
    }

    const travelData = this.travelForm.value;

    // Simple frontend validation for dates
    if (travelData.arrivalDate < travelData.departureDate) {
      Swal.fire('Error', 'La fecha de llegada no puede ser antes de la salida', 'warning');
      return;
    }

    this.isLoading.set(true);

    if (this.isEditing() && travelData.id) {
      this.travelService.updateTravel(travelData.id, travelData).subscribe({
        next: () => {
          this.handleSuccess('Viaje actualizado correctamente');
        },
        error: (err) => this.handleError(err)
      });
    } else {
      this.travelService.createTravel(travelData).subscribe({
        next: () => {
          this.handleSuccess('Viaje creado correctamente');
        },
        error: (err) => this.handleError(err)
      });
    }
  }

  deleteTravel(travel: Travel) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading.set(true);
        this.travelService.deleteTravel(travel.id!).subscribe({
          next: () => {
            this.handleSuccess('Viaje eliminado');
          },
          error: (err) => this.handleError(err)
        });
      }
    });
  }

  private handleSuccess(message: string) {
    this.isLoading.set(false);
    this.closeModal();
    this.loadTravels();
    Swal.fire('Éxito', message, 'success');
  }

  private handleError(err: any) {
    this.isLoading.set(false);
    console.error(err);
    Swal.fire('Error', err.error?.error || 'Ocurrió un error', 'error');
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'SCHEDULED': return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'IN_TRANSIT': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'COMPLETED': return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border border-red-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  }

  getTransportColor(type: string): string {
    switch (type) {
      case 'AIR': return 'bg-blue-50 text-blue-700 border border-blue-100';
      case 'SEA': return 'bg-cyan-50 text-cyan-700 border border-cyan-100';
      case 'GROUND': return 'bg-orange-50 text-orange-700 border border-orange-100';
      default: return 'bg-gray-50 text-gray-600 border border-gray-200';
    }
  }
}
