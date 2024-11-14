import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Import the map operator
import { environment } from '../../../environments/environment'; // Import the environment file

@Injectable({
  providedIn: 'root'
})
export class ObservationsService {

  private apiUrl: string = environment.apiUrl; // Use the apiUrl from the environment file

  constructor(private http: HttpClient) { }

  getHeaders() {
    let accessToken = localStorage.getItem('metalicas-token');
    return {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    }
  }

  getObservations(): Observable<any> {
    const headers = this.getHeaders(); // Get the headers
    return this.http.get(`${this.apiUrl}getObservations`, { headers }).pipe(
      map((data: any) => data)
    );
  }



}
