import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/_models/user';
import { PaymentMode } from 'src/app/_models/paymentmode';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-payment-mode',
  templateUrl: './payment-mode.component.html',
  styleUrls: ['./payment-mode.component.css']
})
export class PaymentModeComponent implements OnInit {
  paymentModeForm : FormGroup;
  user  : User;
  saveButton : Boolean = false;
  paymentModeList : PaymentMode[];
  validationErrors: string[] = [];


  public col : IgxColumnComponent;
  public oWidth : string;
  public nWidth : string;

  @ViewChild('paymentModeGrid' , {static : true})
  public paymentModeGrid: IgxGridComponent;

  constructor( private accountService : AccountService,
    private masterService : MasterService,
    private fb : FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadPaymnetMode(); 
  }
  
  initializeForm()
  {
    this.accountService.currentUser$.forEach((element) => {
    this.user = element;
    });
    var authMenus = this.user.permitMenus;

      if(authMenus != null) {
          if (authMenus.filter((x) => x.autoIdx == 2193).length > 0) {
            this.saveButton = true;
          }
        }
        this.paymentModeForm = this.fb.group({
          autoId: [0],
          createUserId: this.user.userId,
          name : ['', [Validators.required, Validators.maxLength(100)]]  
    });  
  }
  public onResize(event) {
    this.col = event.column;
    this.oWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }
  loadPaymnetMode(){
    this.paymentModeList = []
    this.masterService.getPaymentMode().subscribe((payModeList) =>{
      this.paymentModeList = payModeList;
      //console.log(this.paymentModeList);
    });
  }
  savePaymentMode (){
    if (this.saveButton == true){
      var Obj = {
        createdUserId : this.user.userId, 
        name : this.paymentModeForm.get('name').value.trim(),
        autoId : this.paymentModeForm.get('autoId').value
      };
      this.masterService.savePaymentMode(Obj).subscribe(
        (result) => {
          if (result == 1){
            this.toastr.success('Payment Mode Saves Successfully !!!');
            this.loadPaymnetMode();
            this.clearControlls ();
          }else if(result == 2){
            this.toastr.success('Payment Mode Updated Successfully !!!');
            this.loadPaymnetMode();
            this.clearControlls (); 
          }else if(result == -1){
            this.toastr.warning('Paymnet Mode Alredy Exists !!!');
          }else if(result == -2){
            this.toastr.warning('Payment Mode Failed, Already In Use  !!!');
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
  onEditPaymentMode (event, cellId) {
    this.clearControlls ();
    const ids = cellId.rowID;
    const selectedRowData = this.paymentModeGrid.data.filter((record) =>{
      return record.autoId == ids;
    });
    this.paymentModeForm.get('name').setValue(selectedRowData[0]['name']);
    this.paymentModeForm.get('autoId').setValue(selectedRowData[0]['autoId']);
  }
  clearControlls (){
    this.paymentModeForm.get('autoId').setValue(0);
    this.paymentModeForm.get('name').setValue('');
  }
  resetControlls (){
    this.clearControlls();
  }
}


