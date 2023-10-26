import { Component, OnInit } from '@angular/core';
import { ReportService } from '_services/report.service';

@Component({
  selector: 'app-report-viewer',
  templateUrl: './report-viewer.component.html',
  styleUrls: ['./report-viewer.component.css']
})
export class ReportViewerComponent implements OnInit {
  reportServer: string = 'http://10.0.2.5:8080/ReportServer'; //'http://SAJJAD-LAP:80/Reports2021';
  serviceUrl: string = 'https://localhost:5001/api/ReportViewer';
  reportUrl: string = 'MPlusReport/CCSReport'; //'CCSReport/CCSReport';
  showParameters: string = "false"; 
  userName: string = 'eamadmin';
  password: string = 'Welc0me@eamvm';
  // parameters: any = {
  //  "SampleStringParameter": null,
  //  "SampleBooleanParameter" : false,
  //  "SampleDateTimeParameter" : "11/1/2020",
  //  "SampleIntParameter" : 1,
  //  "SampleFloatParameter" : "123.1234",
  //  "SampleMultipleStringParameter": ["Parameter1", "Parameter2"]
  //  };
  language: string = "en-us";
  width: number = 100;
  height: number = 100;
  toolbar: string = "true";

  constructor(private reportServices: ReportService) { }

  ngOnInit(): void {
    // this.reportServices.loadReport();
    // window.location.href = "http://localhost:65030/ReportForm.aspx";
  }

  openSite() {
    //console.log("here");
    // this.reportServices.loadReport();
    window.open("http://localhost:65030/ReportForm.aspx");
 }
 

  

}
