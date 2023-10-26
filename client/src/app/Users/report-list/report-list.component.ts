import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxCheckboxComponent, IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { Report } from 'src/app/_models/report';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { AdminService } from '_services/admin.service';
import { ReportService } from '_services/report.service';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.css'],
})
export class ReportListComponent implements OnInit {
  reportList: any;
  reportListForm: FormGroup;
  validationErrors: string[] = [];
  user: User;
  moduleList: any;
  saveButton: boolean = false;

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

  @ViewChild('reportGrid', { static: true })
  public reportGrid: IgxGridComponent;
  @ViewChild('chkFromDate', { read: IgxCheckboxComponent })
  public chkFromDate: IgxCheckboxComponent;
  @ViewChild('chkToDate', { read: IgxCheckboxComponent })
  public chkToDate: IgxCheckboxComponent;

  constructor(
    public reportServices: ReportService,
    private fb: FormBuilder,
    private accountService: AccountService,
    public adminService: AdminService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.initilizeForm();
    this.loadModule();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 2184).length > 0) {
        this.saveButton = true;
      }
    }

    this.reportListForm = this.fb.group({
      autoId: [0],
      module: ['', [Validators.required, Validators.maxLength(20)]],
      reportName: ['', [Validators.required, Validators.maxLength(100)]],
      ssrsReportName: ['', [Validators.required , Validators.maxLength(100)]],
      fromDate: [false],
      toDate: [false],
      purpose: ['', [Validators.maxLength(300)]],
    });
  }

  public onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  loadModule() {
    this.moduleList = this.reportServices.loadModuleList();
    //console.log(data);
  }

  public singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
      //console.log(event.newSelection);
    }
  }

  onModuleSelect(event) {
    this.reportList = [];
    for (const item of event.added) {
      this.loadReportDetails(item);
    }
  }

  loadReportDetails(module) {
    this.reportServices.loadReportDetails(module).subscribe(result => {
      this.reportList = result
    })
  }

  saveReportList() {
    if (this.saveButton == true) {
      var module =this.reportListForm.get('module').value[0];
    var obj = {
      autoId: this.reportListForm.get('autoId').value,
      module: this.reportListForm.get('module').value[0],
      reportName: this.reportListForm.get('reportName').value,
      ssrsReportName: this.reportListForm.get('ssrsReportName').value,
      fromDate: this.reportListForm.get('fromDate').value,
      toDate: this.reportListForm.get('toDate').value,
      purpose: this.reportListForm.get('purpose').value
    }
    this.reportServices.saveReport(obj).subscribe(result => {
      if (result == 1) {
        this.toastr.success('Report save Successfully !!!');
        this.clearReportList();
        this.loadReportDetails(module);
      } else if (result == 2) {
        this.toastr.success('Report update Successfully !!!');
        this.clearReportList();
        this.loadReportDetails(module);
      } else if (result == -1) {
        this.toastr.warning('Report already exists !!!');
      } else {
        this.toastr.error('Contact Admin. Error No:- ' + result.toString());
      }
    });
    } else {
      this.toastr.error('Save Permission denied !!!');
    }
  }

  onReportEdit(event, cellId) {
    const ids = cellId.rowID;
    const selectedRowData = this.reportGrid.data.filter((record) => {
      return record.autoId == ids;
    });

    //console.log(selectedRowData);
    // this.reportListForm.get('module').setValue(selectedRowData[0]['module']);
    this.reportListForm.get('autoId').setValue(selectedRowData[0]['autoId']);
    this.reportListForm.get('reportName').setValue(selectedRowData[0]['reportName']);
    this.reportListForm.get('ssrsReportName').setValue(selectedRowData[0]['ssrsReportName']);
    this.reportListForm.get('purpose').setValue(selectedRowData[0]['purpose']);
    this.reportListForm.get('fromDate').setValue(selectedRowData[0]['fromDate']);
    this.reportListForm.get('toDate').setValue(selectedRowData[0]['toDate']);
  }

  clearReportList() {
    this.reportListForm.get('autoId').setValue(0);
    // this.reportListForm.get('module').setValue('');
    this.reportListForm.get('reportName').setValue('');
    this.reportListForm.get('ssrsReportName').setValue('');
    this.reportListForm.get('purpose').setValue('');
    this.reportListForm.get('fromDate').setValue(false);
    this.reportListForm.get('toDate').setValue(false);
  }

  refreshReport() {
    this.clearReportList();
    this.reportListForm.get('module').setValue('');
    this.reportList = [];
  }

}
