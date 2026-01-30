import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { TariffService, TariffCategory, TariffRange } from '../../../services/tariff/tariff.service';
import { GlobalSettingsService } from '../../../services/settings/global-settings.service';

@Component({
    selector: 'app-client-calculator',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
    templateUrl: './client-calculator.html'
})
export class ClientCalculatorComponent {
    private tariffService = inject(TariffService);
    private settingsService = inject(GlobalSettingsService);
    private fb = inject(FormBuilder);

    calculatorForm: FormGroup;

    // Financials
    baseCost = signal(0);
    tariffCost = signal(0);
    taxes = signal(0);
    adminFees = signal(0);
    homeDeliveryFee = signal(0);
    totalCost = signal(0);

    // Data
    tariffCategories = signal<TariffCategory[]>([]);
    availableSubcategories = signal<TariffRange[]>([]);
    globalParams: any = {};

    constructor() {
        this.calculatorForm = this.fb.group({
            category: ['', Validators.required],
            subcategory: ['', Validators.required],
            declaredValue: [0, [Validators.required, Validators.min(0)]],
            weight: [1, [Validators.required, Validators.min(0.1)]],
            isHomeDelivery: [false]
        });

        // Listeners
        this.calculatorForm.valueChanges.subscribe(() => this.calculateCost());

        this.calculatorForm.get('category')?.valueChanges.subscribe(catId => {
            if (catId) {
                const category = this.tariffCategories().find(c => c.id == catId);
                if (category) {
                    this.availableSubcategories.set(category.ranges || []);
                    this.calculatorForm.patchValue({ subcategory: '' }, { emitEvent: false });
                }
            }
        });

        this.loadSettings();
        this.loadTariffs();
    }

    loadTariffs() {
        this.tariffService.getAllCategories().subscribe(cats => {
            this.tariffCategories.set(cats);
        });
    }

    loadSettings() {
        this.settingsService.getAllSettings().subscribe(params => {
            params.forEach(p => this.globalParams[p.paramKey] = Number(p.paramValue));
            this.calculateCost();
        });
    }

    calculateCost() {
        if (!this.globalParams['COST_LB_LOW']) return;

        const weight = this.calculatorForm.get('weight')?.value || 0;
        const subrangeId = this.calculatorForm.get('subcategory')?.value;
        const declaredVal = this.calculatorForm.get('declaredValue')?.value || 0;

        let costPerLb = weight <= 10
            ? this.globalParams['COST_LB_LOW']
            : this.globalParams['COST_LB_HIGH'];

        // Base Cost
        let base = weight * costPerLb;

        // Tariff
        let tariff = 0;
        if (subrangeId) {
            const range = this.availableSubcategories().find(r => r.id == subrangeId);
            if (range && range.feeValue) {
                tariff = declaredVal * (range.feeValue / 100);
            }
        }

        // Fees
        let fees = this.globalParams['FEE_AIRPORT'] + this.globalParams['FEE_ADMIN'];

        // Home Delivery
        let homeDelivery = 0;
        if (this.calculatorForm.get('isHomeDelivery')?.value) {
            homeDelivery = (this.globalParams['FEE_HOME_DELIVERY'] || 0);
        }

        // Taxes (IVA 13%)
        let tax = (base + fees + homeDelivery) * this.globalParams['TAX_IVA'];

        this.baseCost.set(base);
        this.tariffCost.set(tariff);
        this.adminFees.set(fees);
        this.homeDeliveryFee.set(homeDelivery);
        this.taxes.set(tax);
        this.totalCost.set(base + fees + homeDelivery + tax + tariff);
    }
}
