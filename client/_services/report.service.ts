import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Report } from 'src/app/_models/Report';
import { environment } from 'src/environments/environment';

var usertoken: any;
if (localStorage.length > 0) {
  // usertoken = JSON.parse(localStorage.getItem('token'));
  usertoken = localStorage.getItem('token');
  //console.log(usertoken);
}

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: 'Bearer ' +  usertoken
  })
}

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  // reportUrl = 'http://localhost:56138/Report/SetValues';
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // loadReport() {
  //   var obj = {
  //     ReportName: 'CCSReport',
  //   };
  //   // console.log(obj);
  //   return this.http.post(this.reportUrl, obj, httpOptions);
  // }

  loadModuleList() {
    var data = [
      { module: 'Orders' },
      { module: 'Production' },
      { module: 'Costing' },
      { module: 'Finance' },
    ];
    return data;
  }

  loadReportDetails(report: any) {
    return this.http.post(this.baseUrl + 'Report/ReportL' , report , httpOptions );
  }

  saveReport(report: Report) {
    return this.http.post(this.baseUrl + 'Report/SaveR', report , httpOptions)
  }
  
  loadDateSelectionType() {
    var data = [
      { Id : '1' , Types : 'Yesterday' },
      { Id : '2' , Types : 'Tomorrow' },
      { Id : '3' , Types : 'Today' },
      { Id : '4' , Types : 'Current Week' },
      { Id : '5' , Types : 'Previous Week' },
      { Id : '6' , Types : 'Next Week' },
      { Id : '7' , Types : 'Current Year' },
      { Id : '8' , Types : 'Next Year' },
      { Id : '9' , Types : 'Previous Year' },
      { Id : '10' , Types : 'Current Month' },
      { Id : '11' , Types : 'Previous Month' },
      { Id : '12' , Types : 'Next Month' }
    ];
    return data;
  }
}
