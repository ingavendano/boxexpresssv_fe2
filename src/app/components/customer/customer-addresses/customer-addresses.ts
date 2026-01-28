import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomerService, Address } from '../../../services/customer/customer.service';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-addresses',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './customer-addresses.html',
  styleUrl: './customer-addresses.css'
})
export class CustomerAddresses {
  private customerService = inject(CustomerService);
  private fb = inject(FormBuilder);

  addresses = signal<Address[]>([]);
  showModal = signal(false);
  addressForm: FormGroup;

  departments = ['San Miguel', 'San Salvador', 'La Unión', 'Usulután', 'Morazán', 'La Libertad', 'Santa Ana', 'Sonsonate', 'Ahuachapán', 'Cabañas', 'Chalatenango', 'Cuscatlán', 'La Paz', 'San Vicente'];

  constructor() {
    this.addressForm = this.fb.group({
      department: ['', Validators.required],
      municipality: ['', Validators.required],
      street: ['', Validators.required], // Using this for specific address line
      referencePoint: ['', Validators.required],
      phone: ['', Validators.required],
      contactName: ['', Validators.required]
    });
    this.loadAddresses();
  }

  loadAddresses() {
    this.customerService.getMyAddresses().subscribe({
      next: (data) => this.addresses.set(data),
      error: (err) => console.error('Error loading addresses', err)
    });
  }

  openModal() {
    this.addressForm.reset();
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  onSubmit() {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }

    const newAddress: Address = this.addressForm.value;
    this.customerService.addAddress(newAddress).subscribe({
      next: (saved) => {
        this.addresses.update(list => [...list, saved]);
        this.closeModal();
        Swal.fire({
          icon: 'success',
          title: 'Dirección Agregada',
          text: 'Se ha guardado correctamente.',
          timer: 1500,
          showConfirmButton: false
        });
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo guardar la dirección', 'error');
      }
    });
  }
}
