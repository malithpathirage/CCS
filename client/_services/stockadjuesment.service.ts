import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

var usertoken: any;

if (localStorage.length > 0) { 
  usertoken = localStorage.getItem('token');
}

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: 'Bearer ' +  usertoken
  })
}

@Injectable({
  providedIn: 'root'
})
export class StockadjuesmentService {
  baseUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  saveStockAdjuestment(stockAdj: any) {
    return this.http.post(this.baseUrl + 'StockAdjuesment/SaveAdj', stockAdj ,httpOptions);
  }

  getInventoryDetails(stockId: number) {
    return this.http.get<any>(this.baseUrl + 'StockAdjuesment/StkDt/' + stockId ,httpOptions);
  }

}
