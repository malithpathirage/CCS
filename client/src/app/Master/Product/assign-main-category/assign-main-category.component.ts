import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '_services/account.service';
import { User } from 'src/app/_models/user';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxGridComponent,IgxComboComponent } from 'igniteui-angular';
import { MasterService } from '_services/master.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-assign-main-category',
  templateUrl: './assign-main-category.component.html',
  styleUrls: ['./assign-main-category.component.css']
})
export class AssignMainCategoryComponent implements OnInit {
  CategoryAssignForm: FormGroup;
  user: User;
  specialCategoryList: any[];
  assignCatList: any[];
  nAssignCatList: any[];
  aPTSaveButton: boolean = false;
  aPTDeleteButton: boolean = false;


  @ViewChild('subcat', { read: IgxComboComponent })
  public subcat: IgxComboComponent;
  @ViewChild('assigncatGrid', { static: true })
  public assigncatGrid: IgxGridComponent;
  @ViewChild('nAssignCatGrid', { static: true })
  public nAssignCatGrid: IgxGridComponent;

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

  constructor(private accountService: AccountService,
    private fb: FormBuilder,
    private masterService: MasterService,
    private toastr: ToastrService
    ) { }

  ngOnInit(): void {
    this.initilizeForm();
    this.loadSubCategory();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 2274).length > 0) {
        this.aPTSaveButton = true;
      } if (authMenus.filter((x) => x.autoIdx == 2274).length > 0) {
        this.aPTDeleteButton = true;
      }
    }

    this.CategoryAssignForm = this.fb.group({
      autoId: [0],
      createUserId: this.user.userId,
      subCatId: ['', Validators.required]     
    });
  }
  public singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
    }
  }
  public onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  loadSubCategory(){
    this.specialCategoryList = [];
    this.masterService.getSubCategory().subscribe((result) =>{
      this.specialCategoryList = result;
    });
  }

  onSelectSubCategory(event){
    for(const item of event.added ){
      this.loadProdSubCatCategory(item);
    }
  }
  loadProdSubCatCategory(subcatId){
    this.masterService.getProdSubCatCategoryDetails(subcatId).subscribe((result)=>{
      this.assignCatList = result.filter(x => x.isAssign == true);
      this.nAssignCatList = result.filter(x => x.isAssign == false);
    })
  }

  assignCategory() {
    if(this.aPTSaveButton == true) {
    var selectedRows = this.nAssignCatGrid.selectedRows;
    var subCatId = this.CategoryAssignForm.get("subCatId").value[0];
    var prodList =[];

    selectedRows.forEach(catId => {  
      var data = {
        createUserId: this.user.userId,
        catId: catId,
        subCatId: subCatId,
        moduleId: this.user.moduleId,
        locationId: this.user.locationId
      };
      prodList.push(data);
    });

    this.masterService.assignSubCatCategory(prodList).subscribe((result) =>{
      if(result == 1) {
        this.toastr.success("Category save Successfully !!!");
        this.clearGridRows();
        this.loadProdSubCatCategory(subCatId);
      } else if (result == -1) {
        this.toastr.warning("Category save failed !!!");
        this.clearGridRows();
      } else {
        this.toastr.warning("Contact Admin. Error No:- " + result.toString());
      }
    })
  } else {
    this.toastr.error('Save Permission denied !!!');
    }
  }

  deleteCat() {
    if(this.aPTDeleteButton == true) {
    var selectedRows = this.assigncatGrid.selectedRows;
    var subCatId = this.CategoryAssignForm.get("subCatId").value[0];
    var prodList =[];

    selectedRows.forEach(CatId => {  
      var data = {
        createUserId: this.user.userId,
        subCatId: subCatId,
        CatId: CatId,
      };
      prodList.push(data);
    });

    this.masterService.deleteSubCatCategory(prodList).subscribe((result) =>{
      if(result == 1) {
        this.toastr.success("Category delete Successfully !!!");
        this.clearGridRows();
        this.loadProdSubCatCategory(subCatId);
      } else if (result == -1) {
        this.toastr.warning("Category delete failed !!!");
        this.clearGridRows();
      } else {
        this.toastr.warning("Contact Admin. Error No:- " + result.toString());
      }
    })
  } else {
    this.toastr.error('Delete permission denied !!!');
  }
  }

  clearGridRows() {
    this.assigncatGrid.deselectAllRows();
    this.nAssignCatGrid.deselectAllRows();
    this.assignCatList = [];
    this.nAssignCatList = [];   
  }

  clearControls() {
    this.clearGridRows();
    this.CategoryAssignForm.get("subCatId").setValue('');   
  }
}
