import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { TariffService, TariffCategory, TariffRange } from '../../../services/tariff/tariff.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-tariff-config',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
    templateUrl: './tariff-config.component.html',
    styleUrl: './tariff-config.component.css'
})
export class TariffConfigComponent implements OnInit {
    private fb = inject(FormBuilder);
    private tariffService = inject(TariffService);

    categories = signal<TariffCategory[]>([]);
    selectedCategory = signal<TariffCategory | null>(null);

    // Computed property to check if current category is PRODUCTS
    // NOW USED MOSTLY FOR BACKWARDS COMPAT OR SPECIFIC DISPLAY IF NEEDED
    // BUT LOGIC IS UNIFIED
    isProductCategory = computed(() => {
        return this.selectedCategory()?.name === 'TARIFFS.TYPE.PRODUCTS';
    });

    rangeForm: FormGroup;
    isSubmitting = signal(false);

    // Store items that are added locally but not yet saved to backend
    pendingRanges = signal<TariffRange[]>([]);

    constructor() {
        this.rangeForm = this.fb.group({
            minValue: [0],
            maxValue: [0],
            feeValue: [0, [Validators.required, Validators.min(0)]],
            subcategoryName: ['', [Validators.required]] // Always required now
        });
    }

    ngOnInit() {
        this.loadCategories();
    }

    loadCategories() {
        this.tariffService.getAllCategories().subscribe({
            next: (data) => {
                this.categories.set(data);
                if (this.selectedCategory() && data.length > 0) {
                    const updated = data.find(c => c.id === this.selectedCategory()!.id);
                    if (updated) this.selectedCategory.set(updated);
                    this.updateValidators();
                } else if (data.length > 0 && !this.selectedCategory()) {
                    // Select first by default
                    this.selectedCategory.set(data[0]);
                    this.updateValidators();
                }
            },
            error: (err) => {
                console.error('Error loading tariffs', err);
                if (err.status === 403) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Acceso Denegado',
                        text: 'No tienes permisos de Administrador para ver esta sección.',
                        confirmButtonText: 'Ir al Login'
                    }).then(() => {
                        // Optional: clear token
                        // Check if in browser before accessing DOM/Storage
                        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
                            localStorage.removeItem('token');
                            window.location.href = '/login';
                        }
                    });
                }
            }
        });
    }

    selectCategory(category: TariffCategory) {
        this.selectedCategory.set(category);
        this.pendingRanges.set([]); // Clear pending when switching
        this.rangeForm.reset({ minValue: 0, maxValue: 0, feeValue: 0, subcategoryName: '' });
        this.updateValidators();
    }

    updateValidators() {
        // Now mostly uniform, but keeping method if logic diverges later
        const minCtrl = this.rangeForm.get('minValue');
        const maxCtrl = this.rangeForm.get('maxValue');
        const nameCtrl = this.rangeForm.get('subcategoryName');

        // Always require name, ignore min/max (set to 0 by default form value)
        nameCtrl?.setValidators([Validators.required]);

        // We might want to keep min/max for specific logic, but per requirements:
        // "Data entry allowing Subcategory and Percentage" implies min/max are not user-facing
        minCtrl?.clearValidators();
        maxCtrl?.clearValidators();

        minCtrl?.updateValueAndValidity();
        maxCtrl?.updateValueAndValidity();
        nameCtrl?.updateValueAndValidity();
    }

    addToPending() {
        if (this.rangeForm.invalid || !this.selectedCategory()) {
            this.rangeForm.markAllAsTouched();
            return;
        }

        const formVal = this.rangeForm.value;
        const newRange: TariffRange = {
            minValue: 0, // Default
            maxValue: 0, // Default
            feeValue: formVal.feeValue,
            subcategoryName: formVal.subcategoryName
        };

        this.pendingRanges.update(prev => [...prev, newRange]);

        // Reset form but keep category
        this.rangeForm.reset({
            minValue: 0,
            maxValue: 0,
            feeValue: 0,
            subcategoryName: ''
        });
    }

    removePending(index: number) {
        this.pendingRanges.update(prev => prev.filter((_, i) => i !== index));
    }

    saveAll() {
        if (this.pendingRanges().length === 0) return;

        this.isSubmitting.set(true);

        this.tariffService.addRangesBatch(this.selectedCategory()!.id, this.pendingRanges()).subscribe({
            next: () => {
                this.isSubmitting.set(false);
                this.pendingRanges.set([]); // Clear pending
                this.loadCategories(); // Reload to show in main list

                Swal.fire({
                    icon: 'success',
                    title: 'Guardado',
                    text: 'Subcategorías guardadas correctamente',
                    timer: 1500,
                    showConfirmButton: false
                });
            },
            error: (err) => {
                this.isSubmitting.set(false);
                Swal.fire('Error', 'No se pudo guardar las tarifas', 'error');
            }
        });
    }

    deleteRange(rangeId: number) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                this.tariffService.deleteRange(rangeId!).subscribe(() => {
                    this.loadCategories();
                    Swal.fire('Eliminado', 'El ítem ha sido eliminado.', 'success');
                });
            }
        });
    }
}
