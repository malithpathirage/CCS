import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/_models/category';
import { CatProdType } from 'src/app/_models/catProdType';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-assign-prodtype-cat',
  templateUrl: './assign-prodtype-cat.component.html',
  styleUrls: ['./assign-prodtype-cat.component.css']
})
export class AssignProdtypeCatComponent implements OnInit {
  assignPTypeForm: FormGroup;
  assignPTypeList: CatProdType[];
  nAssignPTypeList: CatProdType[];
  user: User;
  aPTSaveButton: boolean = false;
  aPTDeleteButton: boolean = false;
  validationErrors: string[] = [];
  CategoryList: Category[];

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

  @ViewChild('assignPTypeGrid', { static: true })
  public assignPTypeGrid: IgxGridComponent;

  @ViewChild('nAssignPTypeGrid', { static: true })
  public nAssignPTypeGrid: IgxGridComponent;
  
  constructor(private accountService: AccountService,
    private fb: FormBuilder,
    private masterService: MasterService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initilizeForm();
    this.loadCategory();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 115).length > 0) {
        this.aPTSaveButton = true;
      } if (authMenus.filter((x) => x.autoIdx == 144).length > 0) {
        this.aPTDeleteButton = true;
      }
    }

    this.assignPTypeForm = this.fb.group({
      autoId: [0],
      createUserId: this.user.userId,
      categoryId: ['', Validators.required]     
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

  onSelectCategory(event) {
    this.clearGridRows();
    for (const item of event.added) {
      this.loadCatProdTypeDt(item);
    }
  }

  loadCategory() {
    this.masterService.getCategory().subscribe((cardList) => {
      this.CategoryList = cardList;
    });
  }

  //// LOADS BOTH ASSIGNED AND NOT ASSIGNED PRODUCT DETAILS
  loadCatProdTypeDt(catId) {
    this.masterService.getCatProdTypeDetails(catId).subscribe((result) => {
      this.assignPTypeList = result.filter(x => x.isAssign == true);
      this.nAssignPTypeList = result.filter(x => x.isAssign == false);
      // console.log(this.assignPTypeList);
      // console.log(this.nAssignPTypeList);
    })
  } 

  assignProductType() {
    if(this.aPTSaveButton == true) {
    var selectedRows = this.nAssignPTypeGrid.selectedRows;
    var categoryId = this.assignPTypeForm.get("categoryId").value[0];
    var prodList =[];

    selectedRows.forEach(prodTypeId => {  
      var data = {
        createUserId: this.user.userId,
        prodTypeId: prodTypeId,
        categoryId: categoryId
      };

      prodList.push(data);
    });

    // console.log(prodList);
    this.masterService.assignCatProdType(prodList).subscribe((result) =>{
      if(result == 1) {
        this.toastr.success("Prod Type save Successfully !!!");
        this.clearGridRows();
        this.loadCatProdTypeDt(categoryId);
      } else if (result == -1) {
        this.toastr.warning("Prod Type save failed !!!");
        this.clearGridRows();
      } else {
        this.toastr.warning("Contact Admin. Error No:- " + result.toString());
      }
    })
  } else {
    this.toastr.error('Save Permission denied !!!');
  }
  }

  deleteProductType() {
    if(this.aPTDeleteButton == true) {
    var selectedRows = this.assignPTypeGrid.selectedRows;
    var categoryId = this.assignPTypeForm.get("categoryId").value[0];
    var prodList =[];

    selectedRows.forEach(prodTypeId => {  
      var data = {
        createUserId: this.user.userId,
        prodTypeId: prodTypeId,
        categoryId: categoryId
      };
      prodList.push(data);
    });

    // console.log(prodList);
    this.masterService.deleteCatProdType(prodList).subscribe((result) =>{
      if(result == 1) {
        this.toastr.success("Prod Type delete Successfully !!!");
        this.clearGridRows();
        this.loadCatProdTypeDt(categoryId);
      } else if (result == -1) {
        this.toastr.warning("Prod Type delete failed !!!");
        // this.clearGridRows();
      } else {
        this.toastr.warning("Contact Admin. Error No:- " + result.toString());
      }
    })
  } else {
    this.toastr.error('Delete permission denied !!!');
  }
  }

  clearGridRows() {
    this.assignPTypeGrid.deselectAllRows();
    this.nAssignPTypeGrid.deselectAllRows();
    this.assignPTypeList = [];
    this.nAssignPTypeList = [];   
  }

  clearControls() {
    this.clearGridRows();
    this.assignPTypeForm.get('categoryId').setValue('');   
  }

}
