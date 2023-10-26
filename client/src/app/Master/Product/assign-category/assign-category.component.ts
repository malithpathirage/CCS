import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxGridComponent,IgxComboComponent } from 'igniteui-angular';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';
import { ToastrService } from 'ngx-toastr';
import { ProductGroup } from 'src/app/_models/productGroup';
import { SubCategory } from 'src/app/_models/subCategory';

@Component({
  selector: 'app-assign-category',
  templateUrl: './assign-category.component.html',
  styleUrls: ['./assign-category.component.css']
})
export class AssignCategoryComponent implements OnInit {
  subCategoryAssignForm: FormGroup;
  user: User;
  prodGroupList: ProductGroup[];
  assignSubCatList: SubCategory[];
  nAssignSubCatList: SubCategory[];
  aPTSaveButton: boolean = false;
  aPTDeleteButton: boolean = false;

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

  @ViewChild('group', { read: IgxComboComponent })
  public group: IgxComboComponent;

  @ViewChild('assignSubcatGrid', { static: true })
  public assignSubcatGrid: IgxGridComponent;

  @ViewChild('nAssignSubCatGrid', { static: true })
  public nAssignSubCatGrid: IgxGridComponent;

  constructor(private accountService: AccountService,
    private fb: FormBuilder,
    private masterService: MasterService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initilizeForm();
    this.loadProductGroup();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 2273).length > 0) {
        this.aPTSaveButton = true;
      } if (authMenus.filter((x) => x.autoIdx == 2273).length > 0) {
        this.aPTDeleteButton = true;
      }
    }

    this.subCategoryAssignForm = this.fb.group({
      autoId: [0],
      createUserId: this.user.userId,
      groupId: ['', Validators.required]     
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

  loadProductGroup(){
    this.masterService.getProductGroupAll().subscribe(groupList => {
      this.prodGroupList = groupList;
    })
  }

  loadProdGroupSubcatDt(groupId) {
    this.masterService.getProdGroupSubCatDetails(groupId).subscribe((result) => {
      this.assignSubCatList = result.filter(x => x.isAssign == true);
      this.nAssignSubCatList = result.filter(x => x.isAssign == false);
      //console.log(result);
    });
  }
  
  onSelectGroup(event){
    this.clearGridRows();
    for(const item of event.added){
      this.loadProdGroupSubcatDt(item);
    }
  }

  clearGridRows() {
    this.assignSubcatGrid.deselectAllRows();
    this.nAssignSubCatGrid.deselectAllRows();
    this.assignSubCatList = [];
    this.nAssignSubCatList = [];   
  }

  assignSubCategory() {
    if(this.aPTSaveButton == true) {
    var selectedRows = this.nAssignSubCatGrid.selectedRows;
    var groupId = this.subCategoryAssignForm.get("groupId").value[0];
    var prodList =[];

    selectedRows.forEach(subCatId => {  
      var data = {
        createUserId: this.user.userId,
        subCatId: subCatId,
        prodGroupId: groupId,
        moduleId: this.user.moduleId,
        locationId: this.user.locationId
      };
      prodList.push(data);
    });

    // console.log(prodList);
    this.masterService.assignProGroupSubCat(prodList).subscribe((result) =>{
      if(result == 1) {
        this.toastr.success("Sub Category save Successfully !!!");
        this.clearGridRows();
        this.loadProdGroupSubcatDt(groupId);
      } else if (result == -1) {
        this.toastr.warning("Sub Category save failed !!!");
        this.clearGridRows();
      } else {
        this.toastr.warning("Contact Admin. Error No:- " + result.toString());
      }
    })
  } else {
    this.toastr.error('Save Permission denied !!!');
    }
  }

  deleteSubCat() {
    if(this.aPTDeleteButton == true) {
    var selectedRows = this.assignSubcatGrid.selectedRows;
    var groupId = this.subCategoryAssignForm.get("groupId").value[0];
    var prodList =[];

    selectedRows.forEach(subCatId => {  
      var data = {
        createUserId: this.user.userId,
        subCatId: subCatId,
        prodGroupId: groupId,
      };
      prodList.push(data);
    });

    this.masterService.deleteProGroupSubCat(prodList).subscribe((result) =>{
      if(result == 1) {
        this.toastr.success("Sub Category delete Successfully !!!");
        this.clearGridRows();
        this.loadProdGroupSubcatDt(groupId);
      } else if (result == -1) {
        this.toastr.warning("Sub Category delete failed !!!");
        this.clearGridRows();
      } else {
        this.toastr.warning("Contact Admin. Error No:- " + result.toString());
      }
    })
  } else {
    this.toastr.error('Delete permission denied !!!');
  }
  }
  clearControls() {
    this.clearGridRows();
    this.subCategoryAssignForm.get("groupId").setValue('');   
  }
}
