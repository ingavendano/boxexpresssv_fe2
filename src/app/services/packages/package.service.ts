import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TrackingStatus } from '../../interfaces/tracking-status';

export interface CreatePackageRequest {
    customerId: number;
    description: string;
    destinationAddressId?: number;
    destinationAddressText?: string;
    senderName?: string;
    weight: number;
    volumetricWeight?: number;
    category: 'PESO' | 'VOLUMEN';
    subcategory: string;
    declaredValue: number;
    totalCost: number;
}

export interface Package {
    id: number;
    trackingId: string;
    description: string;
    currentStatus: TrackingStatus;
    senderName: string;
    receiverName: string;
    destinationAddress: string;
    tripId?: string;
    createdAt: string;
    events: any[];
}

export interface BulkStatusUpdateRequest {
    packageIds: number[];
    statusCode: string;
    description?: string;
    location?: string;
    tripId?: string;
}

@Injectable({
    providedIn: 'root'
})
export class PackageService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/api/packages';

    createPackage(pkg: CreatePackageRequest): Observable<any> {
        return this.http.post<any>(this.apiUrl, pkg);
    }

    getPendingPackages(customerId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/customer/${customerId}/pending`);
    }

    bulkUpdateStatus(request: BulkStatusUpdateRequest): Observable<any[]> {
        return this.http.put<any[]>(`${this.apiUrl}/bulk-status`, request);
    }

    // Placeholder for search/filter endpoint
    searchPackages(filters: any): Observable<any[]> {
        // TODO: Implement backend endpoint for filtering
        // For now, testing with all pending logic if generic
        return this.http.get<any[]>(`${this.apiUrl}/search`, { params: filters });
    }

    getPackageLabel(id: number): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/${id}/label`, {
            responseType: 'blob'
        });
    }

    getMyPackages(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/customer/my-packages`);
    }
}
