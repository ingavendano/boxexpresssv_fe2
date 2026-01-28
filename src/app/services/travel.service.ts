import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Travel {
    id?: number;
    origin: string;
    destination: string;
    closingDate: string; // ISO Date
    departureDate: string;
    arrivalDate: string;
    status: 'SCHEDULED' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';
    transportType: 'AIR' | 'SEA' | 'GROUND';
}

@Injectable({
    providedIn: 'root'
})
export class TravelService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/api/travels';

    getPublicTravels(): Observable<Travel[]> {
        return this.http.get<Travel[]>(`${this.apiUrl}/public`);
    }

    // Admin methods
    getAllTravels(): Observable<Travel[]> {
        return this.http.get<Travel[]>(this.apiUrl);
    }

    createTravel(travel: Travel): Observable<Travel> {
        return this.http.post<Travel>(this.apiUrl, travel);
    }

    updateTravel(id: number, travel: Travel): Observable<Travel> {
        return this.http.put<Travel>(`${this.apiUrl}/${id}`, travel);
    }

    deleteTravel(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
