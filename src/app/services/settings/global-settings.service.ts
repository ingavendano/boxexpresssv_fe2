import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface GlobalParameter {
    id: number;
    paramKey: string;
    paramValue: string;
    description: string;
    category: 'TAXES' | 'COST_LB' | 'ADMIN_FEES' | string;
    type: 'NUMBER' | 'TEXT' | 'BOOLEAN';
}

export interface ParameterAuditLog {
    id: number;
    oldValue: string;
    newValue: string;
    changeDate: string;
    modifiedBy: {
        username: string;
    };
    parameter: {
        description: string;
        paramKey: string;
    };
}

@Injectable({
    providedIn: 'root'
})
export class GlobalSettingsService {
    private http = inject(HttpClient);
    // private apiUrl = environment.apiUrl + '/settings';
    private apiUrl = 'http://localhost:8080/api/settings';

    getAllSettings(): Observable<GlobalParameter[]> {
        return this.http.get<GlobalParameter[]>(this.apiUrl);
    }

    updateSetting(key: string, value: string): Observable<GlobalParameter> {
        return this.http.put<GlobalParameter>(`${this.apiUrl}/${key}`, { value });
    }

    getAuditLogs(): Observable<ParameterAuditLog[]> {
        return this.http.get<ParameterAuditLog[]>(`${this.apiUrl}/audit`);
    }
}
