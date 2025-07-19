import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface User {
    id: string;
    username: string;
    email: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject: BehaviorSubject<User | null>;
    public currentUser: Observable<User | null>;
    private readonly API_URL = 'http://localhost:3000/api';

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User | null>(
            this.getUserFromToken()
        );
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User | null {
        return this.currentUserSubject.value;
    }

    login(credentials: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, credentials)
            .pipe(map(response => {
                localStorage.setItem('token', response.token);
                this.currentUserSubject.next(response.user);
                return response;
            }));
    }

    register(userData: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.API_URL}/auth/register`, userData)
            .pipe(map(response => {
                localStorage.setItem('token', response.token);
                this.currentUserSubject.next(response.user);
                return response;
            }));
    }

    logout(): void {
        localStorage.removeItem('token');
        this.currentUserSubject.next(null);
    }

    isAuthenticated(): boolean {
        const token = localStorage.getItem('token');
        return !!token && !this.isTokenExpired(token);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    private getUserFromToken(): User | null {
        const token = localStorage.getItem('token');
        if (token && !this.isTokenExpired(token)) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                return {
                    id: payload.id,
                    username: payload.username,
                    email: payload.email
                };
            } catch (error) {
                return null;
            }
        }
        return null;
    }

    private isTokenExpired(token: string): boolean {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 < Date.now();
        } catch (error) {
            return true;
        }
    }
} 