import { customerothercode } from './../../../_models/customerothercode';
import { Component, OnInit,ViewChild } from '@angular/core';
import { FormGroup,FormBuilder,Validators}from '@angular/forms';
import { IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { User } from 'src/app/_models/user';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-customer-other-code',
  templateUrl: './customer-other-code.component.html',
  styleUrls: ['./customer-other-code.component.css']
})
export class CustomerOtherCodeComponent implements OnInit {
  customerOtherCodeForm: FormGroup;
  user:User;
  saveButton: Boolean=false;
  validationErrors: string[] = [];
  customerOtherCodeList: customerothercode[];


  public col : IgxColumnComponent;
  public oWidth : string;
  public nWidth : string;

  @ViewChild('customerOtherCodeGrid' , {static : true})
  public customerOtherCodeGrid: IgxGridComponent;

  constructor(private accountservice: AccountService,
    private fb: FormBuilder,
    private masterservices: MasterService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadCustomerOtherCode();
  }
  initializeForm(){
    this.accountservice.currentUser$.forEach((element)=>{
      this.user=element;
    });
    var authMenus = this.user.permitMenus;
    if(authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 2193).length > 0) {
        this.saveButton = true;
      }
    }
    this.customerOtherCodeForm=this.fb.group({
      autoId:[0],
      createUserId: this.user.userId,
      codeHeaderValue:['',[Validators.required,Validators.maxLength(50)]]
    });
  }
  public onResize(event) {
    this.col = event.column;
    this.oWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }
  loadCustomerOtherCode(){
    this.customerOtherCodeList=[]
    this.masterservices.getCustomerOtherCode().subscribe((custOther)=>{
      this.customerOtherCodeList = custOther;
      //console.log(this.customerOtherCodeList);
    });
  }
  saveCustomerOtherCode(){
    if(this.saveButton==true){
      var Obj = {
        createdUserId : this.user.userId, 
        codeHeaderValue : this.customerOtherCodeForm.get('codeHeaderValue').value.trim(),
        autoId : this.customerOtherCodeForm.get('autoId').value
      };
      //console.log(Obj);
      this.masterservices.saveCustomerOtherCode(Obj).subscribe(
        (result)=>{
          if (result == 1){
            this.toastr.success('Customer Other Code Saves Successfully !!!');
            this.loadCustomerOtherCode();
            this.clearControlls();
          }else if(result == 2){
            this.toastr.success('Customer Other Code Updated Successfully !!!');
            this.loadCustomerOtherCode();
            this.clearControlls();
          }else if(result == -1){
            this.toastr.warning('Customer Other CodeAlredy Exists !!!');
          }else if(result == -2){
            this.toastr.warning('Customer Other Code Failed, Already In Use  !!!');
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
    onEditCustomerOtherCode(event,cellID){
      this.clearControlls();
      const ids = cellID.rowID;
      const selectedRowData = this.customerOtherCodeGrid.data.filter((record)=>{
        return record.autoId == ids;
      });
      this.customerOtherCodeForm.get('codeHeaderValue').setValue(selectedRowData[0]['codeHeaderValue']);
      this.customerOtherCodeForm.get('autoId').setValue(selectedRowData[0]['autoId']);
    }
    clearControlls (){
      this.customerOtherCodeForm.get('autoId').setValue(0);
      this.customerOtherCodeForm.get('codeHeaderValue').setValue('');
    }
    resetControlls(){
      this.clearControlls();
    }
}

