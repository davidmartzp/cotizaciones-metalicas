import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Importa el operador map
import { environment } from '../../../environments/environment'; // Import the environment file


@Injectable({
  providedIn: 'root'
})

export class UsersService {
  constructor(private http: HttpClient) { }
  private apiUrl: string = environment.apiUrl; // Use the apiUrl from the environment file

  // get metalicas-token from local storage and configure headers
  getHeaders() {
    let accessToken = localStorage.getItem('metalicas-token');
    return {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    }
  }


  searchUsers(params: any): Observable<any> {
    return this.http.get(`${this.apiUrl}searchUser`, { 
      params,
      headers: this.getHeaders()
    }).pipe(
      map((data: any) => data)
    );
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}getUsers`, { headers: this.getHeaders() }).pipe(
      map((data: any) => data)
    );
  }

  storeUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}storeUser`, user, { headers: this.getHeaders() }).pipe(
      map((data: any) => data)
    );
  }

  getUser(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}getUserById/${id}`, { headers: this.getHeaders() }).pipe(
      map((data: any) => data)
    );
  }

  updateUser(user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}updateUser/${user.id}`, user, { headers: this.getHeaders() }).pipe(
      map((data: any) => data)
    );
  }

  updateUserStatus(user: any): Observable<any> {
    console.log(user);
    return this.http.put(`${this.apiUrl}updateUserStatus/${user}`, user, { headers: this.getHeaders() }).pipe(
      map((data: any) => data)
    );
  }


  
}
