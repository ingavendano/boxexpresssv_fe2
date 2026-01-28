import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, RegisterRequest } from '../auth/auth.service';

export interface Address {
    id?: number;
    type: 'USA' | 'ESA';
    contactName: string;
    phone: string;
    instructions?: string;
    // USA
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    // ESA
    department?: string;
    municipality?: string;
    referencePoint?: string;
}

@Injectable({
    providedIn: 'root'
})
export class CustomerAdminService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/api/admin/customers';

    getAllCustomers(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl);
    }

    createCustomer(request: RegisterRequest): Observable<User> {
        return this.http.post<User>(this.apiUrl, request);
    }

    getAddresses(userId: number): Observable<Address[]> {
        return this.http.get<Address[]>(`${this.apiUrl}/${userId}/addresses`);
    }

    addAddress(userId: number, address: Address): Observable<Address> {
        return this.http.post<Address>(`${this.apiUrl}/${userId}/addresses`, address);
    }

    searchCustomers(query: string): Observable<User[]> {
        return this.http.get<User[]>(`${this.apiUrl}/search`, { params: { query } });
    }
}
