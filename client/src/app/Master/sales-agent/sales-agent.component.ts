import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { FluteType } from 'src/app/_models/fluteType';
import { SalesAgent } from 'src/app/_models/salesAgent';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-sales-agent',
  templateUrl: './sales-agent.component.html',
  styleUrls: ['./sales-agent.component.css']
})
export class SalesAgentComponent implements OnInit {
  salesAgentForm: FormGroup;
  salesAgentList: SalesAgent[]; 
  user: User;
  saveButton: boolean = false;
  validationErrors: string[] = [];

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

  @ViewChild('salesAgentGrid', { static: true })
  public salesAgentGrid: IgxGridComponent;
  
  constructor(private accountService: AccountService,
    private masterService: MasterService,
    private fb: FormBuilder,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initilizeForm();
    this.loadSalesAgent();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 108).length > 0) {
        this.saveButton = true;
      }
    }

    this.salesAgentForm = this.fb.group({
      autoId: [0],
      createUserId: this.user.userId,
      name: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.maxLength(100) , Validators.email]],
    });
  }

  public onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  loadSalesAgent() {
    this.salesAgentList = [];
    // var user: User = JSON.parse(localStorage.getItem('user'));
    //console.log(user);
    var locationId = this.user.locationId;
    this.masterService.getSalesAgent(locationId).subscribe((result) => {
      this.salesAgentList = result;
    });
  }  

  saveSalesAgent() {
    if(this.saveButton == true) {
    // var loc: User = JSON.parse(localStorage.getItem('user'));
    var obj = {
      createUserId: this.user.userId,
      name: this.salesAgentForm.get('name').value.trim(),
      email: this.salesAgentForm.get('email').value == null ? "" : this.salesAgentForm.get('email').value.trim(),
      autoId: this.salesAgentForm.get('autoId').value,
      locationId: this.user.locationId
    };

    // console.log(this.saveobj);
    this.masterService.saveSalesAgent(obj).subscribe(
      (result) => {
        if (result == 1) {
          this.toastr.success('Sales Agent save Successfully !!!');
          this.loadSalesAgent();
          this.clearControls();
        } else if (result == 2) {
          this.toastr.success('Sales Agent update Successfully !!!');
          this.loadSalesAgent();
          this.clearControls();
        } else if (result == -1) {
          this.toastr.warning('Sales Agent already exists !!!');
        } else if (result == -2) {
          this.toastr.warning('Sales Agent fail, already in use  !!!');
        } else {
          this.toastr.error('Contact Admin. Error No:- ' + result.toString());
        }
      },
      (error) => {
        this.validationErrors = error;
      });
    } else {
      this.toastr.error('Save Permission denied !!!');
    }
  }

  onEditSalesAgent(event, cellId) {
    this.clearControls();
    //console.log(cellId.rowID);
    const ids = cellId.rowID;
    const selectedRowData = this.salesAgentGrid.data.filter((record) => {
      return record.autoId == ids;
    });

    //console.log(selectedRowData);
    this.salesAgentForm.get('name').setValue(selectedRowData[0]['name']);
    this.salesAgentForm.get('autoId').setValue(selectedRowData[0]['autoId']);
    this.salesAgentForm.get('email').setValue(selectedRowData[0]['email']);
    // this.salesAgentForm.get('name').disable();
  }

  clearControls() {
    //this.masterColor.reset();
    this.salesAgentForm.get('autoId').setValue(0);
    this.salesAgentForm.get('createUserId').setValue(this.user.userId);
    this.salesAgentForm.get('name').setValue('');
    this.salesAgentForm.get('email').setValue('');
    // this.salesAgentForm.get('name').enable();
  }

  resetControls() {
    // this.mstrUnits.reset();
    this.clearControls();
    //this.clearGridRows();
  }

}
