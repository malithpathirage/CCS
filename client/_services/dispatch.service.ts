import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DispatchStockDto } from 'src/app/_models/DispatchStockDto';
import { DispatchNoteDt } from 'src/app/_models/dispatchNoteDt';
import { DispatchProdDt } from 'src/app/_models/dispatchProdDt';
import { environment } from 'src/environments/environment';

var usertoken: any;
if (localStorage.length > 0) {
  usertoken = localStorage.getItem('token');
}

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: 'Bearer ' + usertoken,
  }),
};

@Injectable({
  providedIn: 'root',
})
export class DispatchService {
  baseUrl = environment.apiUrl + 'Dispatch';

  constructor(private http: HttpClient) {}

  saveDispatchDetails(diaptch: any) {
    return this.http.post(
      this.baseUrl + '/Save',
      diaptch,
      httpOptions
    );
  }

  getDispatchDetails(dispatch: any) {
    return this.http.post<DispatchNoteDt[]>(
      this.baseUrl + '/Details' , dispatch,
      httpOptions
    );
  }

  cancelDispatchDetails(diaptch: any) {
    return this.http.post(
      this.baseUrl + '/CancelDD',
      diaptch,
      httpOptions
    );
  }

  getDispatchNoList(cusRef: string) {
    return this.http.get<any>(
      this.baseUrl + '/ListCus/' + cusRef,
      httpOptions
    );
  }

  getDispatchNoLists(dispatch: string) {
    return this.http.get<any>(
      this.baseUrl + '/ListDisp/' + dispatch,
      httpOptions
    );
  }

  getPendDispatchDetails(prod: any) {
    return this.http.post<DispatchProdDt[]>(
      this.baseUrl + '/PendList',
      prod,
      httpOptions
    );
  }

  getDispatchStock(request: any) {
    return this.http.post<DispatchStockDto[]>(
      this.baseUrl + '/DispStock',
      request,
      httpOptions
    );
  }
}
