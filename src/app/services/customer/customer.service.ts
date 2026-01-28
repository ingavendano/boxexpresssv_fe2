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

@Injectable({
    providedIn: 'root'
})
export class CustomerService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/api/customer';

    getMyAddresses(): Observable<Address[]> {
        return this.http.get<Address[]>(`${this.apiUrl}/addresses`);
    }

    addAddress(address: Address): Observable<Address> {
        return this.http.post<Address>(`${this.apiUrl}/addresses`, address);
    }
}
