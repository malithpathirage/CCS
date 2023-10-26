import { Component, OnInit,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { AccountService } from '_services/account.service';
import { User } from 'src/app/_models/user';
import { ToastrService } from 'ngx-toastr';
import { MasterService } from '_services/master.service';
import { DeliveryTerms } from 'src/app/_models/deliveryTerms';

@Component({
  selector: 'app-delivery-terms',
  templateUrl: './delivery-terms.component.html',
  styleUrls: ['./delivery-terms.component.css']
})
export class DeliveryTermsComponent implements OnInit {
  deliveryTermForm : FormGroup;
  user  : User;
  saveButton : Boolean = false;
  validationErrors: string[] = [];
  deliveryTermList: DeliveryTerms[];

  public col : IgxColumnComponent;
  public oWidth : string;
  public nWidth : string;

  @ViewChild('deliveryTermGrid' , {static : true})
  public deliveryTermGrid: IgxGridComponent;

  constructor(private accountService : AccountService,
    private masterService : MasterService,
    private fb : FormBuilder,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadDeliveryTerm();
  }
  initializeForm()
  {
    this.accountService.currentUser$.forEach((element) => {
    this.user = element;
    });
    var authMenus = this.user.permitMenus;

      if(authMenus != null) {
          if (authMenus.filter((x) => x.autoIdx == 2261).length > 0) {
            this.saveButton = true;
          }
        }
        this.deliveryTermForm = this.fb.group({
          deliTermsId: [0],
          createUserId: this.user.userId,
          code : ['', [Validators.required, Validators.maxLength(100)]],
          description : ['', [Validators.required, Validators.maxLength(100)]]   
    });  
  }
  clearControlls(){
    this.deliveryTermForm.get('deliTermsId').setValue(0);
    this.deliveryTermForm.get('code').setValue('');
    this.deliveryTermForm.get('description').setValue('');
  }
  onEditDeliveryTerm (event, cellId) {
    this.clearControlls ();
    const ids = cellId.rowID;
    const selectedRowData = this.deliveryTermGrid.data.filter((record) =>{
      return record.deliTermsId == ids;
    });
    //console.log(selectedRowData);
    this.deliveryTermForm.get('code').setValue(selectedRowData[0]['code']);
    this.deliveryTermForm.get('description').setValue(selectedRowData[0]['description']);
    this.deliveryTermForm.get('deliTermsId').setValue(selectedRowData[0]['deliTermsId']);
  }
  resetControlls(){
    this.clearControlls();
  }
  saveDeliveryTerm(){
    if (this.saveButton == true){
      var Obj = {
        createdUserId : this.user.userId, 
        code : this.deliveryTermForm.get('code').value.trim(),
        description : this.deliveryTermForm.get('description').value.trim(),
        shipModeId : this.deliveryTermForm.get('deliTermsId').value
      };
      this.masterService.saveDeliveryTerm(Obj).subscribe(
        (result) => {
          if (result == 1){
            this.toastr.success('Delivery Term Saves Successfully !!!');
            this.loadDeliveryTerm();
            this.clearControlls ();
          }else if(result == 2){
            this.toastr.success('Delivery Term Updated Successfully !!!');
            this.loadDeliveryTerm();
            this.clearControlls (); 
          }else if(result == -1){
            this.toastr.warning('Delivery Term Alredy Exists !!!');
          }else if(result == -2){
            this.toastr.warning('Delivery Term Failed, Already In Use  !!!');
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
  loadDeliveryTerm() {
    this.masterService.getDeliveryTerms().subscribe(result => {
      this.deliveryTermList = result
    //  console.log(result);
    })
  }
  public onResize(event) {
    this.col = event.column;
    this.oWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }
}
