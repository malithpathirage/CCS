import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';

import { Product } from 'src/app/_models/product';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-master-prod',
  templateUrl: './master-prod.component.html',
  styleUrls: ['./master-prod.component.css']
})
export class MasterProdComponent implements OnInit {
  productForm: FormGroup;
  ProductList: Product[];
  user: User;
  ptSaveButton: boolean = false;
  ptDisableButton: boolean = false;
  validationErrors: string[] = [];

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

  @ViewChild('ProductGrid', { static: true })
  public ProductGrid: IgxGridComponent;

  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    private masterService: MasterService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.initilizeForm();
    this.loadProducts();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 113).length > 0) {
        this.ptSaveButton = true;
      } if (authMenus.filter((x) => x.autoIdx == 142).length > 0) {
        this.ptDisableButton = true;
      }       
    }

    this.productForm = this.fb.group({
      productId: [0],
      createUserId: this.user.userId,
      companyId: this.user.locations[0].companyId,
      moduleId: this.user.moduleId,
      productName: ['', [Validators.required, Validators.maxLength(50)]],
    
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

  saveProduct() {
    if(this.ptSaveButton == true) {
    
      var obj = {
        createUserId: this.user.userId,
        Description: this.productForm.get('productName').value.trim(),
        productId: this.productForm.get('productId').value,
        CompanyId: this.productForm.get('companyId').value,
        ModuleId: this.productForm.get('moduleId').value
      };
  
      console.log(obj);
      this.masterService.saveProduct(obj).subscribe(
        (result) => {
          if (result == 1) {
            this.toastr.success('Product Type save Successfully !!!');
            this.loadProducts();
            this.clearControls();
          } else if (result == 2) {
            this.toastr.success('Product Type update Successfully !!!');
            this.loadProducts();
            this.clearControls();
          } else if (result == -1) {
            this.toastr.warning('Product Type already exists !!!');
          } else {
            this.toastr.error('Contact Admin. Error No:- ' + result.toString());
          }
        },
        (error) => {
          this.validationErrors = error;
        }
      );
    } else {
      this.toastr.error('Save Permission denied !!!');
    }  
  }

  clearControls() {
    this.productForm.get('productId').setValue(0);
    this.productForm.get('createUserId').setValue(this.user.userId);
    this.productForm.get('productName').reset();
    this.productForm.get('productName').enable();
    
  }

  loadProducts() {
    this.masterService.getProductsAll().subscribe((cardList) => {
      this.ProductList = cardList;
    })
  }  

  //// EDIT ROW LOADS DETAILS TO CONTROL
  onEdit(event, cellId) {
    const ids = cellId.rowID;
    const selectedRowData = this.ProductGrid.data.filter((record) => {
      return record.productId == ids;
    });

    this.productForm.get('productName').setValue(selectedRowData[0]['description']);
    this.productForm.get('productId').setValue(selectedRowData[0]['productId']);
    
  }

  active(cellValue, cellId) {
    const id = cellId.rowID;

    var obj = {
      createUserId: this.user.userId,
      productId: id,
      bActive: true,
    };
    this.deactiveProducts(obj, 'Active');
  }


  deactive(cellValue, cellId) {
    const id = cellId.rowID;

    var obj = {
      createUserId: this.user.userId,
      productId: id,
      bActive: false,
    };
    this.deactiveProducts(obj, 'Deactive');
  }


  deactiveProducts(obj, status) {
    if(this.ptDisableButton == true ) {
      this.masterService.deactiveProduct(obj).subscribe(
        (result) => {
          if (result == 1) {
            this.toastr.success('Product ' + status + ' Successfully !!!');
            this.loadProducts();
          } else if (result == 2) {
            this.toastr.success('Product ' + status + ' Successfully !!!');
            this.loadProducts();
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
    } else {
      this.toastr.error('Disable Permission denied !!!');
    }
  }

}
