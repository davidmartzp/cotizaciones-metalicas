import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Importa el operador map
import { environment } from '../../../environments/environment'; // Import the environment file

@Injectable({
  providedIn: 'root'
})
export class MailService {
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

  //sendSetUserPassword
  sendSetUserPassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}sendSetUserPassword`, data, { headers: this.getHeaders() });
  }

}
