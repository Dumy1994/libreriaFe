import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../environments/environment.prod';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private dataSource: Subject<User[]> = new Subject<User[]>();
  productUser$ = this.dataSource.asObservable();
  private baseUrl = environment.endpoint + '/users';
  constructor(private http: HttpClient) { }


  getUsersList(){
    this.http.get<User[]>(this.baseUrl ).subscribe((data)=>{
      this.dataSource.next(data);
      console.log(data);
    })
  }

  getUser(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // delete
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  // update
  updateUser(user: User): Observable<Object> {
    return this.http.put(`${this.baseUrl}/update`, user);
  }
  // get user
  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }
}
