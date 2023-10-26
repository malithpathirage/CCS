import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerType } from 'src/app/_models/customerType';
import { User } from 'src/app/_models/user';
import { ToastrService } from 'ngx-toastr';
import { IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-customer-type',
  templateUrl: './customer-type.component.html',
  styleUrls: ['./customer-type.component.css']
})
export class CustomerTypeComponent implements OnInit {
  customerTypeForm : FormGroup;
  customerTypeList : CustomerType[];
  user : User;
  saveButton: boolean = false;
  validationErrors: string[] = [];

  public col: IgxColumnComponent;
  public oWidth : string;
  public nWidth : string;

  @ViewChild('customerTypeGrid', { static: true })
  public customerTypeGrid: IgxGridComponent;
  
  constructor(private accountService: AccountService,
    private masterService: MasterService,
    private fb : FormBuilder,
    private toastr: ToastrService) {}

  ngOnInit(): void {
    this.initializeform();
    this.loadCustomerType();
  }
  initializeform(){
      this.accountService.currentUser$.forEach((element) => {
        this.user = element;
      });
      var authMenus = this.user.permitMenus;

      if(authMenus != null) {
          if (authMenus.filter((x) => x.autoIdx == 2191).length > 0) {
            this.saveButton = true;
          }
        }
        this.customerTypeForm = this.fb.group({
          autoId: [0],
          createUserId: this.user.userId,
          details: ['', [Validators.required, Validators.maxLength(100)]]
      });  
    } 
    public onResize(event) {
      this.col = event.column;
      this.oWidth = event.prevWidth;
      this.nWidth = event.newWidth;
    } 
    loadCustomerType() {
      this.customerTypeList = []
      this.masterService.getCustomerType().subscribe((cusTypeList) => {
      this.customerTypeList = cusTypeList;
      });
    } 
    saveCustomerType() {
      if (this.saveButton == true) {
        
        var Obj = {
          createdUserId : this.user.userId,
          details : this.customerTypeForm.get('details').value.trim(),
          autoId : this.customerTypeForm.get('autoId').value
        };
        this.masterService.saveCustomerType(Obj).subscribe(
          (result) => {
          if (result == 1){
            this.toastr.success('Customer Type Saves Successfully !!!');
            this.loadCustomerType();
            this.clearControlls();
          } 
          else if (result == 2) {
            this.toastr.success('Customer Type Updated Successfully !!!');
            this.loadCustomerType();
            this.clearControlls(); 
          }
          else if (result == -1){
            this.toastr.warning('Customet Type Already Exists !!!');
            
          }
          else if (result == -2){
            this.toastr.warning('Customer Type Failed, Already In Use  !!!')
          }
          else {
            this.toastr.error('Contact Admin. Error No:- ' + result.toString());
          }
        },
        (error) => {
          this.validationErrors = error;
        });
      }
      else {
        this.toastr.error('Save Permission Denied !!!');
      }
  }
  onEditCustomerType (event, cellId) {
    this.clearControlls();
    const ids = cellId.rowID;
    const selectedRowData = this.customerTypeGrid.data.filter((record) =>{
      return record.autoId == ids;
    });
    this.customerTypeForm.get('details').setValue(selectedRowData[0]['details']);
    this.customerTypeForm.get('autoId').setValue(selectedRowData[0]['autoId']);
  }
  clearControlls (){
    this.customerTypeForm.get('autoId').setValue(0);
    this.customerTypeForm.get('details').setValue('');
  }
  resetControlls (){
    this.clearControlls();
  }
}