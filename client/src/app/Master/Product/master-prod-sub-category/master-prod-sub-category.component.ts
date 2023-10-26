import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/_models/category';
import { ProdSubCategory } from 'src/app/_models/prodSubCategory';
import { ProductGroup } from 'src/app/_models/productGroup';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-master-prod-sub-category',
  templateUrl: './master-prod-sub-category.component.html',
  styleUrls: ['./master-prod-sub-category.component.css']
})
export class MasterProdSubCategoryComponent implements OnInit {
  prodSubCatForm: FormGroup;
  prodSubCatList: ProdSubCategory[];
  prodGroupList: ProductGroup[];
  user: User;

  validationErrors: string[] = [];
  // categoryList: Category[];

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

  @ViewChild("prodSubCatGrid", { static: true }) 
  public prodSubCatGrid: IgxGridComponent;

  constructor(private accountService: AccountService, private fb: FormBuilder
    ,private masterService: MasterService ,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initilizeForm();
    this.loadProductGroupAll();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach(element => {
      this.user = element;
      });

    this.prodSubCatForm = this.fb.group ({
      autoId : [0],
      createUserId : this.user.userId,
      prodGroupId: ['', Validators.required ],
      prodSubCatName: ['', [Validators.required , Validators.maxLength(50)]],
      prodSubCatCode: ['', [Validators.required , Validators.maxLength(10)]]
    })
  } 

  public singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
    }
  }

  loadProductGroupAll(){
    this.masterService.getProductGroupAll().subscribe(groupList => {
      this.prodGroupList = groupList;
    })
  }

  public onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  onSelectProdGroup(event) {
    this.prodSubCatList = [];
    for (const item of event.added) {
      this.loadProdSubCategory(item);
    }
  }

  loadProdSubCategory(groupId) {    
    this.masterService.getProductSubCatDt(groupId).subscribe(subCatList => {
      this.prodSubCatList = subCatList;
      //console.log(this.prodSubCatList);
    })
  }

  saveProdSubCategory() {
    var prodGroupId = this.prodSubCatForm.get('prodGroupId').value[0];

    var obj = {
      createUserId: this.user.userId,
      prodSubCatName: this.prodSubCatForm.get('prodSubCatName').value.trim(),
      prodSubCatCode: this.prodSubCatForm.get('prodSubCatCode').value.trim(),
      autoId: this.prodSubCatForm.get('autoId').value,
      prodGroupId: prodGroupId,
    };

    this.masterService.saveProductSubCat(obj).subscribe((result) => {    
      if (result == 1) {
        this.toastr.success("Product Sub Category save Successfully !!!");
        this.loadProdSubCategory(prodGroupId);
        this.clearControls();
      } else if (result == 2) {
        this.toastr.success("Product Sub Category update Successfully !!!");
        this.loadProdSubCategory(prodGroupId);
        this.clearControls();
      } else if (result == -1) {
        this.toastr.warning("Product Sub Category already exists !!!");
      } else {
        this.toastr.warning("Contact Admin. Error No:- " + result.toString());
      }    
       
    }, error => {
      this.validationErrors = error;
    }) 
  }

  clearControls() {
    this.prodSubCatForm.get('autoId').setValue(0);
    this.prodSubCatForm.get('createUserId').setValue(this.user.userId);
    this.prodSubCatForm.get('prodSubCatName').reset();
    this.prodSubCatForm.get('prodSubCatCode').reset();

    this.prodSubCatForm.get('prodGroupId').enable();
    this.prodSubCatForm.get('prodSubCatName').enable();
    this.prodSubCatForm.get('prodSubCatCode').enable();
    this.loadProductGroupAll();
  }

  deactive(cellValue, cellId) {
    const id = cellId.rowID;

    var obj = {
      createUserId: this.user.userId,
      autoId: id,
      isActive: false,
    };

    this.deactiveProdSubCat(obj, 'Deactive');
  }

  active(cellValue, cellId) {
    const id = cellId.rowID;

    var obj = {
      createUserId: this.user.userId,
      autoId: id,
      isActive: true,
    };
    this.deactiveProdSubCat(obj, 'Active');
  }

  deactiveProdSubCat(obj, status) {
    // console.log(obj);
    var prodGroupId = this.prodSubCatForm.get('prodGroupId').value[0];

    this.masterService.deactiveProductSubCat(obj).subscribe(
      (result) => {
        if (result == 1) {
          this.toastr.success('Product Sub Cat ' + status + ' Successfully !!!');
          this.loadProdSubCategory(prodGroupId);
        } else if (result == 2) {
          this.toastr.success('Product Sub Cat ' + status + ' Successfully !!!');
          this.loadProdSubCategory(prodGroupId);
        } else if (result == -1) {
          this.toastr.warning('Deactive failed, already allocated !!!');
        } else {
          this.toastr.error('Contact Admin. Error No:- ' + result.toString());
        }
      },
      (error) => {
        this.validationErrors = error;
      }
    );
  }

  //  //// EDIT ROW LOADS DETAILS TO CONTROL 
  //  onEdit(event,cellId) {

  //   const ids = cellId.rowID;    
  //   const selectedRowData = this.prodSubCatGrid.data.filter((record) => {
  //       return record.autoId == ids;
  //   });
  //   this.prodSubCatForm.get('prodSubCatName').setValue(selectedRowData[0]["prodSubCatName"]);
  //   this.prodSubCatForm.get('prodSubCatCode').setValue(selectedRowData[0]["prodSubCatCode"]);
  //   // this.prodSubCatForm.get('prodGroupId').setValue(selectedRowData[0]["prodGroupId"]);
  //   this.prodSubCatForm.get('autoId').setValue(selectedRowData[0]["autoId"]);

  //   this.prodSubCatForm.get('prodGroupId').disable();
  //   this.prodSubCatForm.get('prodSubCatName').disable();
  //   this.prodSubCatForm.get('prodSubCatCode').disable(); 
  // }

}
