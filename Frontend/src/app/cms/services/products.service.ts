import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Importa el operador map
import { environment } from '../../../environments/environment'; // Import the environment file


@Injectable({
  providedIn: 'root'
})

export class ProductsService {
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


  searchProducts(params: any): Observable<any> {
    return this.http.get(`${this.apiUrl}searchProduct`, { 
      params,
      headers: this.getHeaders()
    }).pipe(
      map((data: any) => data)
    );
  }

  getProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}getProducts`, { headers: this.getHeaders() }).pipe(
      map((data: any) => data)
    );
  }

  storeProduct(product: any): Observable<any> {
    return this.http.post(`${this.apiUrl}storeProduct`, product, { headers: this.getHeaders() }).pipe(
      map((data: any) => data)
    );
  }

  getProduct(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}getProductById/${id}`, { headers: this.getHeaders() }).pipe(
      map((data: any) => data)
    );
  }

  updateProduct(product: any): Observable<any> {
    return this.http.put(`${this.apiUrl}updateProduct/${product.id}`, product, { headers: this.getHeaders() }).pipe(
      map((data: any) => data)
    );
  }


  
}
