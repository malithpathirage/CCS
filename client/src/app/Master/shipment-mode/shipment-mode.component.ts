import { Component, OnInit,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { AccountService } from '_services/account.service';
import { User } from 'src/app/_models/user';
import { ToastrService } from 'ngx-toastr';
import { MasterService } from '_services/master.service';
import { ShipmentModes } from 'src/app/_models/shipmentModes';

@Component({
  selector: 'app-shipment-mode',
  templateUrl: './shipment-mode.component.html',
  styleUrls: ['./shipment-mode.component.css']
})
export class ShipmentModeComponent implements OnInit {
  shipmentModeForm : FormGroup;
  user  : User;
  saveButton : Boolean = false;
  validationErrors: string[] = [];
  shipmentModeList: ShipmentModes[];

  public col : IgxColumnComponent;
  public oWidth : string;
  public nWidth : string;

  @ViewChild('shipmentModeGrid' , {static : true})
  public shipmentModeGrid: IgxGridComponent;

  constructor(private accountService : AccountService,
    private masterService : MasterService,
    private fb : FormBuilder,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadShipmentMode();
  }
  initializeForm()
  {
    this.accountService.currentUser$.forEach((element) => {
    this.user = element;
    });
    var authMenus = this.user.permitMenus;

      if(authMenus != null) {
          if (authMenus.filter((x) => x.autoIdx == 2250).length > 0) {
            this.saveButton = true;
          }
        }
        this.shipmentModeForm = this.fb.group({
          shipModeId: [0],
          createUserId: this.user.userId,
          code : ['', [Validators.required, Validators.maxLength(100)]],
          description : ['', [Validators.required, Validators.maxLength(100)]]   
    });  
  }
  clearControlls(){
    this.shipmentModeForm.get('shipModeId').setValue(0);
    this.shipmentModeForm.get('code').setValue('');
    this.shipmentModeForm.get('description').setValue('');
  }
  onEditShipmentMode (event, cellId) {
    this.clearControlls ();
    const ids = cellId.rowID;
    const selectedRowData = this.shipmentModeGrid.data.filter((record) =>{
      return record.shipModeId == ids;
    });
    //console.log(selectedRowData);
    this.shipmentModeForm.get('code').setValue(selectedRowData[0]['code']);
    this.shipmentModeForm.get('description').setValue(selectedRowData[0]['description']);
    this.shipmentModeForm.get('shipModeId').setValue(selectedRowData[0]['shipModeId']);
  }
  resetControlls(){
    this.clearControlls();
  }
  savePaymentMode(){
    if (this.saveButton == true){
      var Obj = {
        createdUserId : this.user.userId, 
        code : this.shipmentModeForm.get('code').value.trim(),
        description : this.shipmentModeForm.get('description').value.trim(),
        shipModeId : this.shipmentModeForm.get('shipModeId').value
      };
      this.masterService.saveShipmentType(Obj).subscribe(
        (result) => {
          if (result == 1){
            this.toastr.success('Shipment Mode Saves Successfully !!!');
            this.loadShipmentMode();
            this.clearControlls ();
          }else if(result == 2){
            this.toastr.success('Shipment Mode Updated Successfully !!!');
            this.loadShipmentMode();
            this.clearControlls (); 
          }else if(result == -1){
            this.toastr.warning('Shipment Mode Alredy Exists !!!');
          }else if(result == -2){
            this.toastr.warning('Shipment Mode Failed, Already In Use  !!!');
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
  loadShipmentMode() {
    this.masterService.getShipmentModes().subscribe(result => {
      this.shipmentModeList = result
    //  console.log(result);
    })
  }
  public onResize(event) {
    this.col = event.column;
    this.oWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }
}
