import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxComboComponent, IgxDialogComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { Brand } from 'src/app/_models/brand';
import { CustomerHd } from 'src/app/_models/customerHd';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-customer-brand',
  templateUrl: './customer-brand.component.html',
  styleUrls: ['./customer-brand.component.css'],
})
export class CustomerBrandComponent implements OnInit {
  custBrandForm: FormGroup;
  user: User;
  customerList: CustomerHd[];
  brandList: Brand[];
  cusBrandList: any[];
  cbSaveButton: boolean = false;
  cbDeleteButton: boolean = false;
  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;
  validationErrors: string[] = [];
  rowId: number = 0;

  @ViewChild('customerB', { read: IgxComboComponent })
  public customerB: IgxComboComponent;
  @ViewChild('brand', { read: IgxComboComponent })
  public brand: IgxComboComponent;

  @ViewChild('customerBrandGrid', { static: true })
  public customerBrandGrid: IgxGridComponent;

  @ViewChild('dialog', { read: IgxDialogComponent })
  public dialog: IgxDialogComponent;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private masterService: MasterService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initilizeForm();
    this.loadBrand();
    this.loadCustomer();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
      //console.log(this.user.userId);
    });

    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 126).length > 0) {
        this.cbSaveButton = true;
      }
      if (authMenus.filter((x) => x.autoIdx == 127).length > 0) {
        this.cbDeleteButton = true;
      }
    }

    this.custBrandForm = this.fb.group({
      autoId: [0],
      userId: this.user.userId,
      brandId: ['', [Validators.required]],
      customerBId: ['', [Validators.required]],
    });
  }

  loadBrand() {
    // var user: User = JSON.parse(localStorage.getItem('user'));
    this.masterService.getBrand(this.user.locationId).subscribe((cardList) => {
      this.brandList = cardList;
    });
  }

  //// ALOW SINGLE SILECTION ONLY COMBO EVENT
  singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
    }
  }

  public onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  loadCustomer() {
    // var user: User = JSON.parse(localStorage.getItem('user'));
    this.masterService
      .getCustomer(this.user.locationId)
      .subscribe((cusList) => {
        this.customerList = cusList.filter(x => x.bActive == true);
      });
  }

  onCustomerSelect(event) {
    this.cusBrandList = [];
    for (const item of event.added) {
      this.loadCustomerBrandDt(item);
    }
  }

  //// Loads Customer Brand list based on customer to grid
  loadCustomerBrandDt(customerId) {
    this.masterService.getCustomerBrand(customerId).subscribe((cusList) => {
      this.cusBrandList = cusList;
    });
   // console.log(this.cusBrandList);
  }

  clearCustomerBrand() {
    this.custBrandForm.get('autoId').setValue(0);
    this.custBrandForm.get('userId').setValue(this.user.userId);

    /// reset fileds
    this.custBrandForm.get('brandId').reset();
    this.custBrandForm.get('customerBId').enable();
  }

  saveCustomerBrand() {
    if (this.cbSaveButton == true) {
      var customerId = this.custBrandForm.get('customerBId').value[0];
      var obj = {
        createUserId: this.user.userId,
        brandId: this.custBrandForm.get('brandId').value[0],
        autoId: this.custBrandForm.get('autoId').value,
        customerId: customerId,
      };

      //console.log(obj);
      this.masterService.saveCustomerBrand(obj).subscribe(
        (result) => {
          //console.log(result);
          if (result == 1) {
            this.toastr.success('Brand assign successfully !!!');
            this.loadCustomerBrandDt(customerId);
            this.clearCustomerBrand();
          } else if (result == 2) {
            this.toastr.success('Brand update successfully !!!');
            this.loadCustomerBrandDt(customerId);
            //this.clearCustomerHd();
          } else if (result == -1) {
            this.toastr.warning('Brand already exists !!!');
          } else {
            this.toastr.warning(
              'Contact Admin. Error No:- ' + result.toString()
            );
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

  onEditCustomerBrand(event, cellId) {
    this.clearCustomerBrand();
    //console.log(this.customerHdGrid.data);

    const ids = cellId.rowID;
    const selectedRowData = this.customerBrandGrid.data.filter((record) => {
      return record.autoId == ids;
    });

    //console.log(selectedRowData);
    this.custBrandForm.get('autoId').setValue(selectedRowData[0]['autoId']);
    this.brand.setSelectedItem(selectedRowData[0]['brandId'], true);
    this.custBrandForm.get('customerBId').disable();
  }

  //// delete confirmation open dialog
  openDelivDialog(event, cellId) {
    this.rowId = cellId;
    this.dialog.open();
  }

  //// delete confirmation ok buttun click event
  onDialogOKSelected(event) {
    event.dialog.close();
    this.onDeleteCusBrand(event, this.rowId);
  }

   /// delete brand event 
   onDeleteCusBrand(event, cellId) {
    if(this.cbDeleteButton == true) {
    var customerId = this.custBrandForm.get('customerBId').value[0];

    const ids = cellId.rowID;
    const selectedRowData = this.customerBrandGrid.data.filter((record) => {
      return record.autoId == ids;
    });

    var obj = {
      createUserId: this.user.userId,
      brandId: selectedRowData[0]['brandId'],
      customerId: customerId,
      autoId: selectedRowData[0]['autoId']
    };

    // console.log(obj);
    this.masterService.deleteCustomerBrand(obj).subscribe(
      (result) => {
        //console.log(result);
        if (result == 1) {
          this.toastr.success('Brand delete successfully !!!');
          this.loadCustomerBrandDt(customerId);
        }  else if (result == -1) {
          this.toastr.warning('Delete Fail !! Brand already assign !!!');
        } else {
          this.toastr.error('Contact Admin. Error No:- ' + result.toString());
        }
      },
      (error) => {
        this.validationErrors = error;
      }
    );
    } else {
      this.toastr.error('Delete Permission denied !!!');
    }
  }

}
