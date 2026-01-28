import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface User {
    id?: number;
    fullName: string;
    email: string;
    password?: string;
    phone?: string;
    role?: string;
    token?: string;
}

export interface RegisterRequest {
    fullName: string;
    email: string;
    password?: string;
    phone?: string;
    role?: string;
}

export interface LoginRequest {
    email: string;
    password?: string;
}

export interface AuthResponse {
    token: string;
    fullName: string;
    email: string;
    role: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8080/api/auth';

    // Signal to track current user state
    currentUser = signal<User | null>(this.getUserFromStorage());

    register(request: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request).pipe(
            tap(response => this.saveUserSession(response))
        );
    }

    login(request: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
            tap(response => this.saveUserSession(response))
        );
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.currentUser.set(null);
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('token');
    }

    private saveUserSession(response: AuthResponse) {
        if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify({
                fullName: response.fullName,
                email: response.email,
                role: response.role
            }));
            this.currentUser.set({
                fullName: response.fullName,
                email: response.email,
                role: response.role,
                token: response.token
            });
        }
    }

    private getUserFromStorage(): User | null {
        if (typeof localStorage !== 'undefined') {
            const userStr = localStorage.getItem('user');
            return userStr ? JSON.parse(userStr) : null;
        }
        return null;
    }
}
