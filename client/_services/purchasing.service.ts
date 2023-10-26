import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SupplierHeader } from 'src/app/_models/supplierHeader';
import { environment } from 'src/environments/environment';

var usertoken: any;
if (localStorage.length > 0) {
  usertoken = localStorage.getItem('token');
}

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: 'Bearer ' + usertoken
  }),
};

@Injectable({
  providedIn: 'root'
})
export class PurchasingService {
  baseUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  getSupplier() {
    return this.http.get<SupplierHeader[]>(this.baseUrl + 'Purchasing/Supplier',httpOptions);
  }
  
  getPendIndentDetails(IndentSearch: any) {
    return this.http.post(this.baseUrl + 'Purchasing/PendIndent' , IndentSearch ,httpOptions);
  }

  savePurchaseOrder(purchaseDto: any) {
    return this.http.post(this.baseUrl + 'Purchasing/SavePO' , purchaseDto , httpOptions);
  }

  getPurchaseOrderDetails(POHeaderId: number) {
    return this.http.get<any>(this.baseUrl + 'Purchasing/PODt/' + POHeaderId , httpOptions);
  }

  getPurchaseOrderHeader(poHeader: any) {
    return this.http.post(this.baseUrl + 'Purchasing/POHd' , poHeader , httpOptions);
  }

  cancelPurchaseOrder(purchaseHd: any) {
    return this.http.post(this.baseUrl + 'Purchasing/CancelPO' , purchaseHd , httpOptions);
  }

  reopenPurchaseOrder(purchaseHd: any) {
    return this.http.post(this.baseUrl + 'Purchasing/ReopenPO' , purchaseHd , httpOptions);
  }

  getGRNReceiveList(search: any) {
    return this.http.post(this.baseUrl + 'Purchasing/GRNRec' , search , httpOptions);
  }

  getGRNReceiveDetails(poHeaderId: number) {
    return this.http.get<any>(this.baseUrl + 'Purchasing/GRNRecDt/' + poHeaderId , httpOptions);
  }
  
  saveGRN(grnDt: any) {
    return this.http.post(this.baseUrl + 'Purchasing/GRNSave' , grnDt , httpOptions);
  }

  getGRNHeaderList(grnHeader: any) {
    return this.http.post(this.baseUrl + 'Purchasing/GRNHd' , grnHeader , httpOptions);
  }

  getGRNDetails(grnHeaderId: number) {
    return this.http.get<any>(this.baseUrl + 'Purchasing/GrnDt/' + grnHeaderId , httpOptions);
  }

  cancelGRN(grnHd: any) {
    return this.http.post(this.baseUrl + 'Purchasing/CancelGRN' , grnHd , httpOptions);
  }

}
