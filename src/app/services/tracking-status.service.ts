import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TrackingStatus } from '../interfaces/tracking-status';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TrackingStatusService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/api/tracking-statuses`;

    getAllStatuses(): Observable<TrackingStatus[]> {
        return this.http.get<TrackingStatus[]>(this.apiUrl);
    }

    getActiveStatuses(): Observable<TrackingStatus[]> {
        return this.http.get<TrackingStatus[]>(`${this.apiUrl}/active`);
    }

    createStatus(status: TrackingStatus): Observable<TrackingStatus> {
        return this.http.post<TrackingStatus>(this.apiUrl, status);
    }

    updateStatus(code: string, status: TrackingStatus): Observable<TrackingStatus> {
        return this.http.put<TrackingStatus>(`${this.apiUrl}/${code}`, status);
    }

    deleteStatus(code: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${code}`);
    }
}
