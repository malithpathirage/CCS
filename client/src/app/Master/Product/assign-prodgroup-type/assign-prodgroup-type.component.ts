import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { ProdTypeGroup } from 'src/app/_models/prodTypeGroup';
import { ProductType } from 'src/app/_models/productType';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-assign-prodgroup-type',
  templateUrl: './assign-prodgroup-type.component.html',
  styleUrls: ['./assign-prodgroup-type.component.css']
})
export class AssignProdgroupTypeComponent implements OnInit {
  assignPTypeForm: FormGroup;
  assignPGroupList: ProdTypeGroup[];
  nAssignPGroupList: ProdTypeGroup[];
  user: User;
  validationErrors: string[] = [];
  prodTypeList: ProductType[];
  aPGSaveButton: boolean = false;
  aPGDeleteButton: boolean = false;

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

  @ViewChild('assignPGroupGrid', { static: true })
  public assignPGroupGrid: IgxGridComponent;

  @ViewChild('nAssignPGroupGrid', { static: true })
  public nAssignPGroupGrid: IgxGridComponent;

  constructor(private accountService: AccountService,
    private fb: FormBuilder,
    private masterService: MasterService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initilizeForm();
    this.loadProductType();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 116).length > 0) {
        this.aPGSaveButton = true;
      } if (authMenus.filter((x) => x.autoIdx == 145).length > 0) {
        this.aPGDeleteButton = true;
      }
    }

    this.assignPTypeForm = this.fb.group({
      autoId: [0],
      createUserId: this.user.userId,
      prodTypeId: ['', Validators.required]     
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

  onSelectProdType(event) {
    this.clearGridRows();
    for (const item of event.added) {
      this.loadProdTypeGroupDt(item);
    }
  }

  loadProductType() {
    this.masterService.getProductTypeAll().subscribe((result) => {
      this.prodTypeList = result;
      // console.log(this.prodTypeList);
    });
  }

  //// LOADS BOTH ASSIGNED AND NOT ASSIGNED PRODUCT DETAILS
  loadProdTypeGroupDt(prodTypeId) {
    this.masterService.getProdTypeGroup(prodTypeId).subscribe((result) => {
      this.assignPGroupList = result.filter(x => x.isAssign == true);
      this.nAssignPGroupList = result.filter(x => x.isAssign == false);
      // console.log(this.assignPGroupList);
      // console.log(this.nAssignPGroupList);
    })
  } 

  assignProductType() {
    if(this.aPGSaveButton == true) {
    var selectedRows = this.nAssignPGroupGrid.selectedRows;
    var prodTypeId = this.assignPTypeForm.get("prodTypeId").value[0];
    var prodList =[];

    selectedRows.forEach(prodGroupId => {  
      var data = {
        createUserId: this.user.userId,
        prodGroupId: prodGroupId,
        prodTypeId: prodTypeId
      };

      prodList.push(data);
    });

    // console.log(prodList);
    this.masterService.assignProdTypeGroup(prodList).subscribe((result) =>{
      if(result == 1) {
        this.toastr.success("Prod Group save Successfully !!!");
        this.clearGridRows();
        this.loadProdTypeGroupDt(prodTypeId);
      } else if (result == -1) {
        this.toastr.warning("Prod Group save failed !!!");
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
    if(this.aPGDeleteButton == true) {
    var selectedRows = this.assignPGroupGrid.selectedRows;
    var prodTypeId = this.assignPTypeForm.get("prodTypeId").value[0];
    var prodList =[];

    selectedRows.forEach(prodGroupId => {  
      var data = {
        createUserId: this.user.userId,
        prodGroupId: prodGroupId,
        prodTypeId: prodTypeId
      };
      prodList.push(data);
    });

    // console.log(prodList);
    this.masterService.deleteProdTypeGroup(prodList).subscribe((result) =>{
      if(result == 1) {
        this.toastr.success("Prod Group delete Successfully !!!");
        this.clearGridRows();
        this.loadProdTypeGroupDt(prodTypeId);
      } else if (result == -1) {
        this.toastr.warning("Prod Group delete failed !!!");
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
    this.assignPGroupGrid.deselectAllRows();
    this.nAssignPGroupGrid.deselectAllRows();
    this.assignPGroupList = [];
    this.nAssignPGroupList = [];   
  }

  clearControls() {
    this.clearGridRows();
    this.assignPTypeForm.get('prodTypeId').setValue('');   
  }


}
