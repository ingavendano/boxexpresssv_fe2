import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { CustomerAdminService, Address } from '../../../services/customers/customer-admin.service';
import { User } from '../../../services/auth/auth.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-customer-management',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
    templateUrl: './customer-management.component.html',
    styleUrl: './customer-management.component.css'
})
export class CustomerManagementComponent implements OnInit {
    private customerService = inject(CustomerAdminService);
    private fb = inject(FormBuilder);

    customers = signal<User[]>([]);
    selectedCustomer = signal<User | any>(null); // Type 'any' used to accommodate id if missing in User type
    customerAddresses = signal<Address[]>([]);

    isLoading = signal(true);
    showForm = signal(false);
    activeTab = signal<'USA' | 'ESA'>('USA');

    // Forms
    customerForm: FormGroup;
    addressForm: FormGroup;

    constructor() {
        this.customerForm = this.fb.group({
            fullName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: [''],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });

        this.addressForm = this.fb.group({
            contactName: ['', Validators.required],
            phone: [''],
            instructions: [''],
            // USA
            street: [''],
            city: ['Houston'],
            state: ['Texas'],
            zipCode: [''],
            // ESA
            department: [''],
            municipality: [''],
            referencePoint: ['']
        });
    }

    ngOnInit() {
        this.loadCustomers();
    }

    loadCustomers() {
        this.isLoading.set(true);
        this.customerService.getAllCustomers().subscribe({
            next: (data) => {
                this.customers.set(data);
                this.isLoading.set(false);
            },
            error: () => this.isLoading.set(false)
        });
    }

    openCreateModal() {
        this.selectedCustomer.set(null);
        this.showForm.set(true);
        this.customerForm.reset();
    }

    selectCustomer(customer: User) {
        this.selectedCustomer.set(customer);
        this.showForm.set(false);
        this.loadAddresses(customer);
    }

    loadAddresses(customer: any) {
        if (!customer.id) return;
        this.customerService.getAddresses(customer.id).subscribe(data => {
            this.customerAddresses.set(data);
        });
    }

    createCustomer() {
        if (this.customerForm.invalid) return;

        this.customerService.createCustomer(this.customerForm.value).subscribe({
            next: (user) => {
                Swal.fire('Registrado', 'Cliente creado exitosamente', 'success');
                this.loadCustomers();
                this.selectCustomer(user);
            },
            error: (err) => Swal.fire('Error', err.error?.message || 'Error al crear', 'error')
        });
    }

    addAddress() {
        if (this.addressForm.invalid || !this.selectedCustomer()) return;

        const formVal = this.addressForm.value;
        const type = this.activeTab();

        const address: Address = {
            type: type,
            contactName: formVal.contactName,
            phone: formVal.phone,
            instructions: formVal.instructions,
            street: type === 'USA' ? formVal.street : undefined,
            city: type === 'USA' ? formVal.city : undefined,
            state: type === 'USA' ? formVal.state : undefined,
            zipCode: type === 'USA' ? formVal.zipCode : undefined,
            department: type === 'ESA' ? formVal.department : undefined,
            municipality: type === 'ESA' ? formVal.municipality : undefined,
            referencePoint: type === 'ESA' ? formVal.referencePoint : undefined
        };

        this.customerService.addAddress(this.selectedCustomer().id, address).subscribe({
            next: () => {
                Swal.fire('Agregada', 'Dirección guardada', 'success');
                this.loadAddresses(this.selectedCustomer());
                this.addressForm.reset({ city: 'Houston', state: 'Texas' });
            },
            error: () => Swal.fire('Error', 'No se pudo guardar la dirección', 'error')
        });
    }
}
