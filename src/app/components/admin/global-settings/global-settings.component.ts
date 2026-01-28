import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { GlobalSettingsService, GlobalParameter, ParameterAuditLog } from '../../../services/settings/global-settings.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-global-settings',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TranslatePipe, DatePipe],
    templateUrl: './global-settings.component.html',
    styleUrl: './global-settings.component.css'
})
export class GlobalSettingsComponent implements OnInit {
    private settingsService = inject(GlobalSettingsService);

    parameters = signal<GlobalParameter[]>([]);
    auditLogs = signal<ParameterAuditLog[]>([]);

    // Categorized signals
    taxesParams = computed(() => this.parameters().filter(p => p.category === 'TAXES'));
    costLbParams = computed(() => this.parameters().filter(p => p.category === 'COST_LB'));
    feesParams = computed(() => this.parameters().filter(p => p.category === 'ADMIN_FEES'));

    isLoading = signal(true);

    constructor() { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.isLoading.set(true);
        // Load params and logs in parallel
        this.settingsService.getAllSettings().subscribe({
            next: (data) => {
                this.parameters.set(data);
                this.isLoading.set(false);
            },
            error: (err) => console.error('Error loading settings', err)
        });

        this.settingsService.getAuditLogs().subscribe({
            next: (data) => {
                this.auditLogs.set(data);
            }
        });
    }

    updateParam(param: GlobalParameter, inputElement: HTMLInputElement) {
        const newValue = inputElement.value;

        if (newValue === param.paramValue) return;

        Swal.fire({
            title: '¿Estás seguro?',
            text: `Vas a cambiar "${param.description}" de ${param.paramValue} a ${newValue}. Este cambio afectará a todos los nuevos cálculos.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f97316',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, actualizar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                this.settingsService.updateSetting(param.paramKey, newValue).subscribe({
                    next: (updated) => {
                        // Update local state
                        this.parameters.update(params =>
                            params.map(p => p.id === updated.id ? updated : p)
                        );
                        // Refresh audit log
                        this.settingsService.getAuditLogs().subscribe(logs => this.auditLogs.set(logs));

                        Swal.fire('¡Actualizado!', 'El parámetro ha sido modificado.', 'success');
                    },
                    error: () => {
                        inputElement.value = param.paramValue; // Revert input
                        Swal.fire('Error', 'No se pudo actualizar el parámetro.', 'error');
                    }
                });
            } else {
                inputElement.value = param.paramValue; // Revert input if cancelled
            }
        });
    }
}
