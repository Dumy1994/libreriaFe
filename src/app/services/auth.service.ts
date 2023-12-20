import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8080/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      username,
      password
    }, httpOptions);
  }

  registerUser(body: any): Observable<any> {
    return this.http.post(`${AUTH_API}register`, body);
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      username,
      email,
      password
    }, httpOptions);
  }


  loginUser(body: any): Observable<any> {
    return this.http.post(`${AUTH_API}login`, body);
  }

  requestReset(body: any): Observable<any> {
    return this.http.post(`${AUTH_API}req-reset-password`, body);
  }

  newPassword(body: any): Observable<any> {
    return this.http.post(`${AUTH_API}new-password`, body);
  }

  ValidPasswordToken(body: any): Observable<any> {
    return this.http.post(`${AUTH_API}valid-password-token`, body);
  }
}
