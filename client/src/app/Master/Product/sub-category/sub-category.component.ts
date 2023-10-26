import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { AccountService } from '_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { MasterService } from '_services/master.service';
import { User } from 'src/app/_models/user';
import { SubCategory } from 'src/app/_models/subCategory';

@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.css']
})
export class SubCategoryComponent implements OnInit {
  subCategoryForm: FormGroup;
  user  : User;
  saveButton : Boolean = false;
  subCategoryList: any;
  validationErrors: string[] = [];
  cDeactiveButton: Boolean = false;

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
    this.loadSubCategory();
  }

  initializeForm()
  {
    this.accountService.currentUser$.forEach((element) => {
    this.user = element;
    });
    var authMenus = this.user.permitMenus;

      if(authMenus != null) {
          if (authMenus.filter((x) => x.autoIdx == 2269).length > 0) {
            this.saveButton = true;
          }
          if (authMenus.filter((x) => x.autoIdx == 2267).length > 0) {
            this.cDeactiveButton = true;
          }
        }
        this.subCategoryForm = this.fb.group({
          autoId: [0],
          code : ['', [Validators.required, Validators.maxLength(10)]],
          description : ['', [Validators.required, Validators.maxLength(50)]]   
    });  
  }
  loadSubCategory(){
    this.subCategoryList = [];
    this.masterService.getSubCategory().subscribe((payModeList) =>{
      this.subCategoryList = payModeList;
      //console.log(payModeList);
    });
  }

  public onResize(event) {
    this.col = event.column;
    this.oWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }
  saveCategory(){
    if(this.saveButton == true){
      var obj = {
        autoId: this.subCategoryForm.get('autoId').value,
        code: this.subCategoryForm.get('code').value.trim(),
        description: this.subCategoryForm.get('description').value.trim(),
        createUserId: this.user.userId,
        moduleId: this.user.moduleId,
        locationId: this.user.locationId
      };
      this.masterService.saveSubCategory(obj).subscribe(
        (result) => {
          if (result == 1){
            this.toastr.success('Sub Category Saves Successfully !!!');
            this.loadSubCategory();
            this.clearControlls ();
          }else if(result == 2){
            this.toastr.success('Sub Category Updated Successfully !!!');
            this.loadSubCategory();
            this.clearControlls (); 
          }else if(result == -1){
            this.toastr.warning('Sub Category Alredy Exists !!!');
          }else if(result == -2){
            this.toastr.warning('Sub Category Failed, Already In Use  !!!');
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
    this.subCategoryForm.get('autoId').setValue(0);
    this.subCategoryForm.get('code').setValue('');
    this.subCategoryForm.get('description').setValue('');
  }
  resetControlls (){
    this.clearControlls();
  }

  onEditSubCategory (event, cellId) {
    //this.clearControlls ();
    const ids = cellId.rowID;
    const selectedRowData = this.paymentModeGrid.data.filter((record) =>{
      return record.autoId == ids;
    });
    this.subCategoryForm.get('code').setValue(selectedRowData[0]['code']);
    this.subCategoryForm.get('description').setValue(selectedRowData[0]['description']);
    this.subCategoryForm.get('autoId').setValue(selectedRowData[0]['autoId']);
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
      //var AutoId = this.categoryForm.get('AutoId').value[0];
      this.masterService.deactiveSpecialCategory(obj).subscribe((result) =>{
        if (result == 1) {
          this.toastr.success('Category' + status + 'Successfully !!!');
          this.loadSubCategory;
        }else if (result == 2) {
          this.toastr.success('Category' + status + 'Successfully !!!');
          this.loadSubCategory;
        }else if (result == -1) {
          this.toastr.warning('Category already in use !!!');
          this.loadSubCategory;
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
