import { Component, OnInit, ViewChild } from '@angular/core';
import { IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { ErrorLog } from 'src/app/_models/errorLog';
import { AdminService } from '_services/admin.service';

@Component({
  selector: 'app-error-log',
  templateUrl: './error-log.component.html',
  styleUrls: ['./error-log.component.css']
})
export class ErrorLogComponent implements OnInit {
  errorList: ErrorLog[];
  public pWidth: string;
  public nWidth: string;
  public col: IgxColumnComponent;

  @ViewChild('errorLogGrid', { static: true })
  public errorLogGrid: IgxGridComponent
  
  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadErrorList();
  }

  public onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }


  loadErrorList() {
    this.adminService.getErrorLog().subscribe(result => {
      this.errorList = result
    })
  }

}
