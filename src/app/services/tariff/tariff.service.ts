import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TariffCategory {
    id: number;
    name: string;
    ranges: TariffRange[];
}

export interface TariffRange {
    id?: number;
    minValue: number;
    maxValue: number;
    feeValue: number;
    subcategoryName?: string;
}

import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TariffService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/api/tariffs`;

    getAllCategories(): Observable<TariffCategory[]> {
        return this.http.get<TariffCategory[]>(this.apiUrl);
    }

    addRange(categoryId: number, range: TariffRange): Observable<TariffRange> {
        return this.http.post<TariffRange>(`${this.apiUrl}/${categoryId}/ranges`, range);
    }

    addRangesBatch(categoryId: number, ranges: TariffRange[]): Observable<TariffRange[]> {
        return this.http.post<TariffRange[]>(`${this.apiUrl}/${categoryId}/ranges/batch`, ranges);
    }

    deleteRange(rangeId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/ranges/${rangeId}`);
    }
}
