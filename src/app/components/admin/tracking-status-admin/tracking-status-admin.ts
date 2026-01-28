import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TrackingStatusService } from '../../../services/tracking-status.service';
import { TrackingStatus } from '../../../interfaces/tracking-status';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-tracking-status-admin',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './tracking-status-admin.html',
    styleUrl: './tracking-status-admin.css'
})
export class TrackingStatusAdminComponent implements OnInit {
    private statusService = inject(TrackingStatusService);
    private fb = inject(FormBuilder);

    statuses = signal<TrackingStatus[]>([]);
    isModalOpen = signal(false);
    isEditing = signal(false);

    form = this.fb.group({
        code: ['', [Validators.required, Validators.pattern('^[A-Z_]+$')]],
        name: ['', Validators.required],
        description: [''],
        sortOrder: [0, Validators.required],
        active: [true]
    });

    ngOnInit() {
        this.loadStatuses();
    }

    loadStatuses() {
        this.statusService.getAllStatuses().subscribe({
            next: (data) => this.statuses.set(data),
            error: (err) => console.error('Error loading statuses', err)
        });
    }

    openCreateModal() {
        this.isEditing.set(false);
        this.form.reset({ active: true, sortOrder: this.statuses().length + 1 });
        this.form.get('code')?.enable();
        this.isModalOpen.set(true);
    }

    openEditModal(status: TrackingStatus) {
        this.isEditing.set(true);
        this.form.patchValue(status);
        this.form.get('code')?.disable(); // Code cannot be changed
        this.isModalOpen.set(true);
    }

    closeModal() {
        this.isModalOpen.set(false);
    }

    saveStatus() {
        if (this.form.invalid) return;

        const statusData = this.form.getRawValue() as TrackingStatus;

        if (this.isEditing()) {
            this.statusService.updateStatus(statusData.code, statusData).subscribe({
                next: () => {
                    Swal.fire('Actualizado', 'Estado actualizado correctamente', 'success');
                    this.loadStatuses();
                    this.closeModal();
                },
                error: () => Swal.fire('Error', 'No se pudo actualizar el estado', 'error')
            });
        } else {
            this.statusService.createStatus(statusData).subscribe({
                next: () => {
                    Swal.fire('Creado', 'Estado creado correctamente', 'success');
                    this.loadStatuses();
                    this.closeModal();
                },
                error: () => Swal.fire('Error', 'No se pudo crear el estado', 'error')
            });
        }
    }

    deleteStatus(code: string) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto. Asegúrate de que no haya paquetes usando este estado.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                this.statusService.deleteStatus(code).subscribe({
                    next: () => {
                        Swal.fire('Eliminado', 'El estado ha sido eliminado', 'success');
                        this.loadStatuses();
                    },
                    error: () => Swal.fire('Error', 'No se pudo eliminar (probablemente esté en uso)', 'error')
                });
            }
        });
    }
}
