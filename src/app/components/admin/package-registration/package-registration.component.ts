import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { CustomerAdminService, Address } from '../../../services/customers/customer-admin.service';
import { TariffService, TariffCategory, TariffRange } from '../../../services/tariff/tariff.service';
import { PackageService, CreatePackageRequest } from '../../../services/packages/package.service';
import { GlobalSettingsService } from '../../../services/settings/global-settings.service';
import { User } from '../../../services/auth/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-package-registration',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
    templateUrl: './package-registration.component.html',
    styleUrl: './package-registration.component.css'
})
export class PackageRegistrationComponent {
    private customerService = inject(CustomerAdminService);
    private packageService = inject(PackageService);
    private tariffService = inject(TariffService);
    private settingsService = inject(GlobalSettingsService);
    private fb = inject(FormBuilder);

    // Search
    searchControl = new FormControl('');
    searchResults = signal<User[]>([]);
    selectedCustomer = signal<User | any>(null);

    customerAddresses = signal<Address[]>([]);
    pendingPackages = signal<any[]>([]); // New Signal for history

    // Form
    packageForm: FormGroup;

    // Financials
    baseCost = signal(0);
    tariffCost = signal(0); // Arancel
    taxes = signal(0);
    adminFees = signal(0);
    homeDeliveryFee = signal(0); // New signal for explicit fee
    totalCost = signal(0);

    // Tariffs
    tariffCategories = signal<TariffCategory[]>([]);
    availableSubcategories = signal<TariffRange[]>([]);

    // Global Params (Loaded on Init)
    globalParams: any = {};

    constructor() {
        this.packageForm = this.fb.group({
            destinationCountry: ['ESA', Validators.required], // Default to El Salvador
            description: ['', Validators.required],
            category: ['', Validators.required], // Loaded dynamically
            subcategory: ['', Validators.required], // ID of TariffRange
            declaredValue: [0, [Validators.required, Validators.min(0)]],
            weight: [1, [Validators.required, Validators.min(0.1)]],
            destinationAddressId: [''], // Optional initially
            isHomeDelivery: [false], // Toggle logic
            senderName: ['Oficina Houston']
        });

        // Search Listener
        this.searchControl.valueChanges.subscribe(val => {
            if (val && val.length >= 3) {
                this.customerService.searchCustomers(val).subscribe(res => this.searchResults.set(res));
            } else {
                this.searchResults.set([]);
            }
        });

        // Country Change Listener
        this.packageForm.get('destinationCountry')?.valueChanges.subscribe(country => {
            this.updateAddressValidation();
            this.filterAddresses();
        });

        // Home Delivery Change Listener
        this.packageForm.get('isHomeDelivery')?.valueChanges.subscribe(isHome => {
            this.updateAddressValidation();
            this.calculateCost(); // Recalculate cost when delivery option changes
        });

        // Cost Calculation Listener
        this.packageForm.valueChanges.subscribe(() => this.calculateCost());

        // Category Change Listener to load subcategories
        this.packageForm.get('category')?.valueChanges.subscribe(catId => {
            if (catId) {
                const category = this.tariffCategories().find(c => c.id == catId);
                if (category) {
                    this.availableSubcategories.set(category.ranges || []);
                    this.packageForm.patchValue({ subcategory: '' }, { emitEvent: false });
                }
            }
        });

        this.loadSettings();
        this.loadTariffs();
    }

    // Helper to update validation
    updateAddressValidation() {
        const isHome = this.packageForm.get('isHomeDelivery')?.value;
        const addrControl = this.packageForm.get('destinationAddressId');

        if (isHome) {
            addrControl?.setValidators(Validators.required);
        } else {
            addrControl?.clearValidators();
        }
        addrControl?.updateValueAndValidity();
    }

    // All addresses loaded from backend
    allCustomerAddresses = signal<Address[]>([]);

    loadTariffs() {
        this.tariffService.getAllCategories().subscribe(cats => {
            this.tariffCategories.set(cats);
        });
    }

    loadSettings() {
        this.settingsService.getAllSettings().subscribe(params => {
            params.forEach(p => this.globalParams[p.paramKey] = Number(p.paramValue));
            this.calculateCost(); // Recalculate once params are loaded
        });
    }

    selectCustomer(customer: User) {
        this.selectedCustomer.set(customer);
        this.searchResults.set([]);
        this.searchControl.setValue(customer.fullName, { emitEvent: false });

        if (customer.id) {
            this.customerService.getAddresses(customer.id).subscribe(addrs => {
                this.allCustomerAddresses.set(addrs);
                this.filterAddresses();
            });

            // Load Pending Packages
            this.packageService.getPendingPackages(customer.id).subscribe(pkgs => {
                this.pendingPackages.set(pkgs);
            });
        }
    }

    filterAddresses() {
        const country = this.packageForm.get('destinationCountry')?.value;
        // Map 'ESA' -> 'ESA' and 'USA' -> 'USA'
        // Assuming Address type matches country code or logic needed
        const filtered = this.allCustomerAddresses().filter(a => a.type === country);
        this.customerAddresses.set(filtered);

        // Reset selected address if it's no longer valid
        const currentAddrId = this.packageForm.get('destinationAddressId')?.value;
        if (currentAddrId && !filtered.find(a => a.id == currentAddrId)) {
            this.packageForm.patchValue({ destinationAddressId: '' });
        }
    }

    calculateCost() {
        if (!this.globalParams['COST_LB_LOW']) return;

        const weight = this.packageForm.get('weight')?.value || 0;
        const subrangeId = this.packageForm.get('subcategory')?.value;
        const declaredVal = this.packageForm.get('declaredValue')?.value || 0;

        let costPerLb = weight <= 10
            ? this.globalParams['COST_LB_LOW']
            : this.globalParams['COST_LB_HIGH'];

        // Basic Logic: Cost = Weight * Rate
        let base = weight * costPerLb;

        // Tariff Logic (Percentage)
        let tariff = 0;
        if (subrangeId) {
            const range = this.availableSubcategories().find(r => r.id == subrangeId);
            if (range && range.feeValue) {
                tariff = declaredVal * (range.feeValue / 100);
            }
        }

        // Fees
        let fees = this.globalParams['FEE_AIRPORT'] + this.globalParams['FEE_ADMIN'];

        // Home Delivery Fee
        let homeDelivery = 0;
        if (this.packageForm.get('isHomeDelivery')?.value) {
            homeDelivery = (this.globalParams['FEE_HOME_DELIVERY'] || 0);
        }

        // Taxes (IVA 13%) -> Usually on (Base + Fees + HomeDelivery)
        let tax = (base + fees + homeDelivery) * this.globalParams['TAX_IVA'];

        this.baseCost.set(base);
        this.tariffCost.set(tariff);
        this.adminFees.set(fees);
        this.homeDeliveryFee.set(homeDelivery);
        this.taxes.set(tax);
        this.totalCost.set(base + fees + homeDelivery + tax + tariff);
    }

    onSubmit() {
        if (this.packageForm.invalid || !this.selectedCustomer()) {
            Swal.fire('Error', 'Complete el formulario y seleccione un cliente', 'error');
            return;
        }

        const subrangeId = this.packageForm.get('subcategory')?.value;
        const subcategoryName = this.availableSubcategories().find(r => r.id == subrangeId)?.subcategoryName || 'General';

        const req: CreatePackageRequest = {
            customerId: this.selectedCustomer().id,
            ...this.packageForm.value,
            subcategory: subcategoryName, // Send Name not ID
            totalCost: this.totalCost()
        };

        this.packageService.createPackage(req).subscribe({
            next: (pkg) => {
                Swal.fire({
                    title: 'Paquete Registrado',
                    text: `Tracking ID: ${pkg.trackingId}. ¿Desea imprimir la guía ahora?`,
                    icon: 'success',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, Imprimir Etiqueta',
                    cancelButtonText: 'Cerrar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.fetchLabel(pkg);
                    }
                    this.resetForm();
                });
            },
            error: () => Swal.fire('Error', 'No se pudo registrar el paquete', 'error')
        });
    }

    resetForm() {
        this.packageForm.reset({
            category: 'PESO',
            weight: 1,
            senderName: 'Oficina Houston'
        });
        this.selectedCustomer.set(null);
        this.searchControl.setValue('');
    }

    // PDF Preview
    pdfUrl = signal<any>(null);

    private sanitizer = inject(DomSanitizer);

    fetchLabel(pkg: any) {
        this.packageService.getPackageLabel(pkg.id).subscribe({
            next: (blob) => {
                const url = URL.createObjectURL(blob);
                this.pdfUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(url));
            },
            error: () => Swal.fire('Error', 'No se pudo generar la etiqueta', 'error')
        });
    }

    printLabel() {
        const iframe = document.getElementById('print-iframe') as HTMLIFrameElement;
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.print();
        }
    }

    closePreview() {
        this.pdfUrl.set(null);
    }
}
