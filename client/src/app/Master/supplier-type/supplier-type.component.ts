import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '_services/account.service';
import { IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { User } from 'src/app/_models/user';
import { ToastrService } from 'ngx-toastr';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-supplier-type',
  templateUrl: './supplier-type.component.html',
  styleUrls: ['./supplier-type.component.css']
})
export class SupplierTypeComponent implements OnInit {
  supplierTypeForm: FormGroup;
  user  : User;
  saveButton: boolean=false;
  supplierTList: any[];
  validationErrors: string[] = [];

  public col : IgxColumnComponent;
  public oWidth : string;
  public nWidth : string;

  constructor(private accountService : AccountService,
    private fb : FormBuilder,
    private masterService : MasterService,
    private toastr: ToastrService) { }

    @ViewChild('supplierTypeGrid' , {static : true})
    public supplierTypeGrid: IgxGridComponent;

  ngOnInit(): void {
    this.initializeForm();
    this.loadSupplierType();
  }
  initializeForm(){
    
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
      });
      var authMenus = this.user.permitMenus;
  
        if(authMenus != null) {
            if (authMenus.filter((x) => x.autoIdx == 2244).length > 0) {
              this.saveButton = true;
            }
          }
          this.supplierTypeForm = this.fb.group({
            suppTypeId: [0],
            createUserId: this.user.userId,
            description : ['', [Validators.required, Validators.maxLength(100)]]
      });  
  }
  loadSupplierType() {
    this.masterService.getSupplierType().subscribe((sup) => {
      this.supplierTList = sup;
     // console.log(sup);
    });
  }
  public onResize(event) {
    this.col = event.column;
    this.oWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }
  saveSupplierType (){
    if (this.saveButton == true){
      var Obj = {
        createUserId : this.user.userId, 
        description : this.supplierTypeForm.get('description').value.trim(),
        suppTypeId : this.supplierTypeForm.get('suppTypeId').value
      };
     // console.log(Obj);
      this.masterService.saveSupplieType(Obj).subscribe(
        (result) => {
          if (result == 1){
            this.toastr.success('Supplier Type Saves Successfully !!!');
            this.loadSupplierType();
            this.clearControlls ();
          }else if(result == 2){
            this.toastr.success('Supplier Type Updated Successfully !!!');
            this.loadSupplierType();
            this.clearControlls (); 
          }else if(result == -1){
            this.toastr.warning('Supplier Type Alredy Exists !!!');
          }else if(result == -2){
            this.toastr.warning('Supplier Type Failed, Already In Use  !!!');
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
    this.supplierTypeForm.get('suppTypeId').setValue(0);
    this.supplierTypeForm.get('description').setValue('');
  }
  resetControls(){
    this.clearControlls();
  }
  onEditSupplierType (event, cellId) {
    this.clearControlls ();
    const ids = cellId.rowID;
    const selectedRowData = this.supplierTypeGrid.data.filter((record) =>{
      return record.suppTypeId == ids;
    });
    this.supplierTypeForm.get('description').setValue(selectedRowData[0]['description']);
    this.supplierTypeForm.get('suppTypeId').setValue(selectedRowData[0]['suppTypeId']);
  } 
}
