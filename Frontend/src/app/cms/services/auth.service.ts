import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'; // Import the environment file


@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(private http: HttpClient) { }
  private apiUrl: string = environment.apiUrl; // Use the apiUrl from the environment file

  

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}login`, data);
  }
  
  logout() {
    window.localStorage.removeItem('metalicas-token');
    window.localStorage.removeItem('metalicas-user');
    window.localStorage.removeItem('metalicas-id');
    window.location.reload()
  }

}
