import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

interface Admin {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Mock admin credentials - in real app would be authenticated against backend
  private admin: Admin = {
    username: 'admin',
    password: 'password123'
  };

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkInitialAuth());
  
  constructor() { }
  
  login(username: string, password: string): Observable<boolean> {
    const isAuthenticated = 
      username === this.admin.username && 
      password === this.admin.password;
    
    if (isAuthenticated) {
      localStorage.setItem('isAuthenticated', 'true');
      this.isAuthenticatedSubject.next(true);
    }
    
    return of(isAuthenticated);
  }
  
  logout(): void {
    localStorage.removeItem('isAuthenticated');
    this.isAuthenticatedSubject.next(false);
  }
  
  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }
  
  private checkInitialAuth(): boolean {
    return localStorage.getItem('isAuthenticated') === 'true';
  }
} 