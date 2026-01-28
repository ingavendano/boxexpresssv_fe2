import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TrackingStatus } from '../interfaces/tracking-status';

export interface TrackingEvent {
    status: TrackingStatus;
    location: string;
    description: string;
    timestamp: string;
}

export interface PackagePublic {
    trackingId: string;
    description: string;
    currentStatus: TrackingStatus;
    originCity: string;
    destinationCity: string;
    lastUpdate: string;
    history: TrackingEvent[];
}

@Injectable({
    providedIn: 'root'
})
export class TrackingService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/api/tracking/public';

    trackPackage(trackingId: string): Observable<PackagePublic> {
        return this.http.get<PackagePublic>(`${this.apiUrl}/${trackingId}`);
    }
}
