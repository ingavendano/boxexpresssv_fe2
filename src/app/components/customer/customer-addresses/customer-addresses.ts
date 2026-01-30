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

  editingAddressId = signal<number | null>(null);

  constructor() {
    this.addressForm = this.fb.group({
      department: ['', Validators.required],
      municipality: ['', Validators.required],
      street: ['', Validators.required],
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
    this.editingAddressId.set(null);
    this.addressForm.reset();
    this.showModal.set(true);
  }

  editAddress(addr: Address) {
    this.editingAddressId.set(addr.id!);
    this.addressForm.patchValue(addr);
    this.showModal.set(true);
  }

  deleteAddress(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.customerService.deleteAddress(id).subscribe({
          next: () => {
            this.addresses.update(list => list.filter(a => a.id !== id));
            Swal.fire('Eliminado', 'La dirección ha sido eliminada.', 'success');
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar la dirección', 'error')
        });
      }
    });
  }

  closeModal() {
    this.showModal.set(false);
    this.editingAddressId.set(null);
    this.addressForm.reset();
  }

  onSubmit() {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }

    const addressData: Address = this.addressForm.value;
    const editId = this.editingAddressId();

    if (editId) {
      this.customerService.updateAddress(editId, addressData).subscribe({
        next: (updated) => {
          this.addresses.update(list => list.map(a => a.id === editId ? updated : a));
          this.closeModal();
          Swal.fire('Actualizado', 'Dirección actualizada correctamente', 'success');
        },
        error: () => Swal.fire('Error', 'No se pudo actualizar', 'error')
      });
    } else {
      this.customerService.addAddress(addressData).subscribe({
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
}
