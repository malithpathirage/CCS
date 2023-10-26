import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { AccountService } from '_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { MasterService } from '_services/master.service';
import { User } from 'src/app/_models/user';
import { PurchaseOrderType } from 'src/app/_models/purchaseOrderType';

@Component({
  selector: 'app-purchase-order-type',
  templateUrl: './purchase-order-type.component.html',
  styleUrls: ['./purchase-order-type.component.css']
})
export class PurchaseOrderTypeComponent implements OnInit {
  poForm: FormGroup;
  user  : User;
  poTypeList: PurchaseOrderType[];
  saveButton : Boolean = false;
  validationErrors: string[] = [];

  public col : IgxColumnComponent;
  public oWidth : string;
  public nWidth : string;

  @ViewChild('poTypeGrid' , {static : true})
  public poTypeGrid: IgxGridComponent;

  constructor(private accountService : AccountService,
    private masterService : MasterService,
    private fb : FormBuilder,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadPoType();
  }
  initializeForm(){
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
      });
      var authMenus = this.user.permitMenus;
  
        if(authMenus != null) {
            if (authMenus.filter((x) => x.autoIdx == 2253).length > 0) {
              this.saveButton = true;
            }
          }
          this.poForm = this.fb.group({
            poTypeId: [0],
            createUserId: this.user.userId,
            details : ['', [Validators.required, Validators.maxLength(50)]]  
      });  
  }
  public onResize(event) {
    this.col = event.column;
    this.oWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }
  loadPoType(){
    this.poTypeList = [];
    this.masterService.getPurchasingOrderType().subscribe((payModeList) =>{
      this.poTypeList  = payModeList;
    });
  }
  savePoType(){
    if(this.saveButton == true){
      var Obj ={
        poTypeId: this.poForm.get('poTypeId').value,
        details: this.poForm.get('details').value.trim(),
        userId: this.user.userId,
        modudeId: this.user.moduleId,
        companyId: this.user.locationId
      };
      this.masterService.savePurchaseOrderType(Obj).subscribe(
        (result) => {
          if (result == 1){
            this.toastr.success('Purchase Order Saves Successfully !!!');
            this.loadPoType();
            this.clearControlls ();
          }else if(result == 2){
            this.toastr.success('Purchase Order Updated Successfully !!!');
            this.loadPoType();
            this.clearControlls (); 
          }else if(result == -1){
            this.toastr.warning('Purchase Order Alredy Exists !!!');
          }else if(result == -2){
            this.toastr.warning('Purchase Order Failed, Already In Use  !!!');
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
  clearControlls(){
    this.poForm.get('poTypeId').setValue(0);
    this.poForm.get('details').setValue('');
  }
  resetControlls(){
    this.clearControlls();
  }
  onEditPurchaseOrder(event, cellId) {
    this.clearControlls();
    const ids = cellId.rowID;
    const selectedRowData = this.poTypeGrid.data.filter((record) =>{
      return record.poTypeId == ids;
    });
    this.poForm.get('details').setValue(selectedRowData[0]['details']);
    this.poForm.get('poTypeId').setValue(selectedRowData[0]['poTypeId']);
  }
}
