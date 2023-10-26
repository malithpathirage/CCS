import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { IndentDtDto } from 'src/app/_models/IndentDtDto';
import { IndentHdDto } from 'src/app/_models/IndentHdDto';
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
export class IndentdetailsService {
  baseUrl = environment.apiUrl;
  private indent = new ReplaySubject<any>();
  selectedIndent$ = this.indent.asObservable();

constructor(private http: HttpClient) { }

  getIntentHeader(searchDto: any) {
    return this.http.post<IndentHdDto[]>(this.baseUrl + 'Indent/IntHd', searchDto ,httpOptions);
  }

  getIntentDetails(indentHdId: number) {
    return this.http.get<IndentDtDto[]>(this.baseUrl + 'Indent/IntDt/' + indentHdId ,httpOptions);
  }

  getIntentDetailsbyIds(indent: any) {
    // return this.http.get<IndentDtDto[]>(this.baseUrl + 'Indent/IntDtIds/' + indentHdId ,httpOptions);
    return this.http.post(this.baseUrl + 'Indent/IntPO' , indent , httpOptions).pipe(
      map((response: any) => {
        const indentDt = response;
        //console.log(indentDt);
        localStorage.setItem('Indent', JSON.stringify(indentDt));
        this.indent.next(indentDt);
      }));
  }

  saveIntentDetails(indentDetails: any) {
    return this.http.post(this.baseUrl + 'Indent/SaveInd', indentDetails ,httpOptions);
  }

  changeIntentAssignTo(indentHd: any) {
    return this.http.post(this.baseUrl + 'Indent/ChAssignTo', indentHd ,httpOptions);
  }

}
