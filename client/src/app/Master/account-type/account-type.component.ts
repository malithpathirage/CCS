import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '_services/account.service';
import { User } from 'src/app/_models/user';
import { IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { MasterService } from '_services/master.service';
import { AccountType } from 'src/app/_models/accountType';

@Component({
  selector: 'app-account-type',
  templateUrl: './account-type.component.html',
  styleUrls: ['./account-type.component.css']
})
export class AccountTypeComponent implements OnInit {
  accountTypeForm: FormGroup;
  user  : User;
  accTypeList: AccountType[];
  saveButton: boolean=false;
  validationErrors: string[] = [];

  public col : IgxColumnComponent;
  public oWidth : string;
  public nWidth : string;

  @ViewChild('accTypeGrid' , {static : true})
  public accTypeGrid: IgxGridComponent;
  constructor(private accountService : AccountService,
    private fb : FormBuilder,
    private masterService : MasterService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadAccountType();
  }
  initializeForm(){
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
      });
      var authMenus = this.user.permitMenus;
  
        if(authMenus != null) {
            if (authMenus.filter((x) => x.autoIdx == 2246).length > 0) {
              this.saveButton = true;
            }
          }
          this.accountTypeForm = this.fb.group({
            accTypeId: [0],
            createUserId: this.user.userId,
            description : ['', [Validators.required, Validators.maxLength(100)]]
      });  
  }
  public onResize(event) {
    this.col = event.column;
    this.oWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }
  loadAccountType() {
    this.accTypeList=[];
    this.masterService.getAccountType().subscribe((sup) => {
      this.accTypeList = sup;
     // console.log(sup);
    });
  }
  saveAccountType (){
    if (this.saveButton == true){
      var Obj = {
        createUserId : this.user.userId, 
        description : this.accountTypeForm.get('description').value.trim(),
        accTypeId : this.accountTypeForm.get('accTypeId').value
      };
     // console.log(Obj);
      this.masterService.saveAccountType(Obj).subscribe(
        (result) => {
          if (result == 1){
            this.toastr.success('Account Type Saves Successfully !!!');
            this.loadAccountType();
            this.clearControlls ();
          }else if(result == 2){
            this.toastr.success('Account Type Updated Successfully !!!');
            this.loadAccountType();
            this.clearControlls (); 
          }else if(result == -1){
            this.toastr.warning('Account Type Alredy Exists !!!');
          }else if(result == -2){
            this.toastr.warning('Account Type Failed, Already In Use  !!!');
          }else{
            this.toastr.error('Contact Admin. Error No:- ' + result.toString());
          }
        },(error) => {
          this.validationErrors = error;
        });   
      } else {
        this.toastr.error('Save Permission Denied !!!');
      }   
  }
  clearControlls (){
    this.accountTypeForm.get('accTypeId').setValue(0);
    this.accountTypeForm.get('description').setValue('');
  }
  resetControls(){
    this.clearControlls();
  }
  onEditAccountType (event, cellId) {
    this.clearControlls ();
    const ids = cellId.rowID;
    const selectedRowData = this.accTypeGrid.data.filter((record) =>{
      return record.accTypeId == ids;
    });
    this.accountTypeForm.get('description').setValue(selectedRowData[0]['description']);
    this.accountTypeForm.get('accTypeId').setValue(selectedRowData[0]['accTypeId']);
  } 
}
