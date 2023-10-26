import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { User } from 'src/app/_models/user';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';
import { SpecialCategory } from 'src/app/_models/specialCategory';

@Component({
  selector: 'app-special-category',
  templateUrl: './special-category.component.html',
  styleUrls: ['./special-category.component.css']
})
export class SpecialCategoryComponent implements OnInit {

  categoryForm: FormGroup;
  user  : User;
  saveButton : Boolean = false;
  specialCategoryList : any[];
  cDeactiveButton: Boolean = false;
  validationErrors: string[] = [];

  public col : IgxColumnComponent;
  public oWidth : string;
  public nWidth : string;

  @ViewChild('paymentModeGrid' , {static : true})
  public paymentModeGrid: IgxGridComponent;

  constructor(private accountService : AccountService,
    private masterService : MasterService,
    private fb : FormBuilder,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadCategory();
  }

  initializeForm()
  {
    this.accountService.currentUser$.forEach((element) => {
    this.user = element;
    });
    var authMenus = this.user.permitMenus;

      if(authMenus != null) {
          if (authMenus.filter((x) => x.autoIdx == 2267).length > 0) {
            this.saveButton = true;
          }
          if (authMenus.filter((x) => x.autoIdx == 2267).length > 0) {
            this.cDeactiveButton = true;
          }
        }
        this.categoryForm = this.fb.group({
          autoId: [0],
          code : ['', [Validators.required, Validators.maxLength(10)]],
          description : ['', [Validators.required, Validators.maxLength(50)]]   
    });  
  }
  public onResize(event) {
    this.col = event.column;
    this.oWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  loadCategory(){
    this.specialCategoryList = [];
    this.masterService.getSpecialCategory().subscribe((payModeList) =>{
      this.specialCategoryList = payModeList;
    });
  }

  saveCategory(){
    if(this.saveButton == true){
      var obj = {
        autoId: this.categoryForm.get('autoId').value,
        code: this.categoryForm.get('code').value.trim(),
        description: this.categoryForm.get('description').value.trim(),
        createUserId: this.user.userId,
        moduleId: this.user.moduleId,
        locationId: this.user.locationId
      };
      this.masterService.saveSpecialCategory(obj).subscribe(
        (result) => {
          if (result == 1){
            this.toastr.success('Category Saves Successfully !!!');
            this.loadCategory();
            this.clearControlls ();
          }else if(result == 2){
            this.toastr.success('Category Updated Successfully !!!');
            this.loadCategory();
            this.clearControlls (); 
          }else if(result == -1){
            this.toastr.warning('Category Alredy Exists !!!');
          }else if(result == -2){
            this.toastr.warning('Category Failed, Already In Use  !!!');
          }else{
            this.toastr.error('Contact Admin. Error No:- ' + result.toString());
          }
        },(error) => {
          this.validationErrors = error;
        });
      }
      else {
        this.toastr.error('Save Permission Denied !!!');
      }   
  }
  clearControlls(){
    this.categoryForm.get('autoId').setValue(0);
    this.categoryForm.get('code').setValue('');
    this.categoryForm.get('description').setValue('');
  }
  resetControlls (){
    this.clearControlls();
  }

  onEditSpecialCategory (event, cellId) {
    //this.clearControlls ();
    const ids = cellId.rowID;
    const selectedRowData = this.paymentModeGrid.data.filter((record) =>{
      return record.autoId == ids;
    });
    this.categoryForm.get('code').setValue(selectedRowData[0]['code']);
    this.categoryForm.get('description').setValue(selectedRowData[0]['description']);
    this.categoryForm.get('autoId').setValue(selectedRowData[0]['autoId']);
  }

  deactive(cellValue, cellId) {
    const id = cellId.rowID;

    var obj = {
      createUserId: this.user.userId,
      autoId: id,
      isActive: false,
    };
    this.deactiveCategory(obj, 'Deactive');
  }

  active(cellValue, cellId) {
    const id = cellId.rowID;
    var obj = {
      createUserId: this.user.userId,
      autoId: id,
      isActive: true,
    };
    this.deactiveCategory(obj, 'Active');
  }

  deactiveCategory(obj, status){
    if(this.cDeactiveButton  == true){
      this.masterService.deactiveSpecialCategory(obj).subscribe((result) =>{
        if (result == 1) {
          this.toastr.success('Category' + status + 'Successfully !!!');
          this.loadCategory;
        }else if (result == 2) {
          this.toastr.success('Category' + status + 'Successfully !!!');
          this.loadCategory;
        }else if (result == -1) {
          this.toastr.warning('Category already in use !!!');
          this.loadCategory;
        }else{
          this.toastr.error('Contact Admin. Error No:- ' + result.toString());
        }
      },
      (error) => {
        this.validationErrors = error;
      });
    }
    else {
      this.toastr.error('Disable Permission denied !!!');
    }   
  }
}
