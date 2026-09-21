import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = false;

  login(email: string, password: string): boolean {

   if (
  email === 'demo@fintrack.com' &&
  password === '123456'
) {
  this.loggedIn = true;

  localStorage.setItem('fintrack_logged_in', 'true');

  localStorage.setItem(
    'fintrack_token',
    'demo-fintrack-token'
  );

  // return true;
} return true;
  }

  logout(): void {
    this.loggedIn = false;
     localStorage.removeItem('fintrack_logged_in');
  localStorage.removeItem('fintrack_token');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('fintrack_logged_in') === 'true';
  }
}