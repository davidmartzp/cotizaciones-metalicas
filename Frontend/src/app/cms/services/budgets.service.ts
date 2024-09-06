import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Import the map operator
import { environment } from '../../../environments/environment'; // Import the environment file

@Injectable({
  providedIn: 'root'
})
export class BudgetsService {

  private apiUrl: string = environment.apiUrl; // Use the apiUrl from the environment file

  constructor(private http: HttpClient) { }

  getHeaders() {
    let accessToken = localStorage.getItem('metalicas-token');
    return {
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    }
  }

  getBudgets(): Observable<any> {
    const headers = this.getHeaders(); // Get the headers
    return this.http.get(`${this.apiUrl}getBudgets`, { headers }).pipe(
      map((data: any) => data)
    );
  }

  storeBudget(Budget: any): Observable<any> {
    const headers = this.getHeaders(); // Get the headers
    return this.http.post(`${this.apiUrl}storeBudget`, Budget, { headers });
  }

  deleteBudget(id: number): Observable<any> {
    const headers = this.getHeaders(); // Get the headers
    return this.http.delete(`${this.apiUrl}Budget/${id}`, { headers });
  }

  getBudgetById(id: any): Observable<any> {
    const headers = this.getHeaders(); // Get the headers
    return this.http.get(`${this.apiUrl}getBudgetById/${id}`, { headers });
  }

  updateBudget(id: any, Budget: any): Observable<any> {
    const headers = this.getHeaders(); // Get the headers
    return this.http.put(`${this.apiUrl}updateBudget/${id}`, Budget, { headers });
  }

}
