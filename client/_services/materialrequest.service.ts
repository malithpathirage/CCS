import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MaterialRequestGetDto } from 'src/app/_models/materialRequestGetDto';
import { MRNoListDto } from 'src/app/_models/mrNoListDto';
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
export class MaterialrequestService {
  baseUrl = environment.apiUrl;

constructor(private http: HttpClient) { }

saveMaterialRequest(model: any) {
  return this.http.post(this.baseUrl + 'MR/SaveMR' , model , httpOptions);
}

sendMaterialRequest(model: any) {
  return this.http.post(this.baseUrl + 'MR/SendMR' , model , httpOptions);
}

getMaterialRequestDt(mrHeaderId: number) {
  return this.http.get<MaterialRequestGetDto[]>(this.baseUrl + 'MR/MRDtList/' + mrHeaderId , httpOptions);
}

getMRNoList(searchList: any) {
  return this.http.post<MRNoListDto[]>(this.baseUrl + 'MR/MRList' , searchList , httpOptions);
}

approveMR(model: any) {
  return this.http.post(this.baseUrl + 'MR/ApproveMR' , model , httpOptions);
}

cancelMR(mrHd: any) {
  return this.http.post(this.baseUrl + 'MR/CancelMR' , mrHd , httpOptions);
}

getInventoryStock(mrHeaderId: number) {
  return this.http.get<MaterialRequestGetDto[]>(this.baseUrl + 'MR/InvStock/' + mrHeaderId , httpOptions);
}
}
