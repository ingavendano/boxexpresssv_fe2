import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Address {
    id?: number;
    department: string;
    municipality: string;
    street: string;
    referencePoint: string;
    phone: string;
    instructions?: string;
    contactName?: string;
    zipCode?: string;
    city?: string;
    state?: string;
    type?: string;
}

import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/api/customer`;

    getMyAddresses(): Observable<Address[]> {
        return this.http.get<Address[]>(`${this.apiUrl}/addresses`);
    }

    addAddress(address: Address): Observable<Address> {
        return this.http.post<Address>(`${this.apiUrl}/addresses`, address);
    }

    updateProfile(data: { fullName?: string, phone?: string, password?: string }): Observable<any> {
        return this.http.put(`${this.apiUrl}/profile`, data);
    }

    updateAddress(id: number, address: Address): Observable<Address> {
        return this.http.put<Address>(`${this.apiUrl}/addresses/${id}`, address);
    }

    deleteAddress(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/addresses/${id}`);
    }
}
