import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxComboComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { CustomerHd } from 'src/app/_models/customerHd';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-customer-division',
  templateUrl: './customer-division.component.html',
  styleUrls: ['./customer-division.component.css']
})
export class CustomerDivisionComponent implements OnInit {
  custDivisionForm: FormGroup;
  user: User;
  customerList: CustomerHd[];
  //brandList: Brand[];
  cusDivisionList: any[];
  cdSaveButton: boolean = false;
  cdDisableButton: boolean = false;
  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;
  validationErrors: string[] = [];

  @ViewChild('customerD', { read: IgxComboComponent })
  public customerD: IgxComboComponent;

  @ViewChild('cusDivisionGrid', { static: true })
  public cusDivisionGrid: IgxGridComponent;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private masterService: MasterService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.initilizeForm();
    this.loadCustomer();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
      //console.log(this.user.userId);
    });

    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 128).length > 0) {
        this.cdSaveButton = true;
      } if (authMenus.filter((x) => x.autoIdx == 150).length > 0) {
        this.cdDisableButton = true;
      }
    }
    
    this.custDivisionForm = this.fb.group({
      autoId: [0],
      userId: this.user.userId,
      customerDId: ['', [Validators.required]],
      details: ['', [Validators.required , Validators.maxLength(50)]]     
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
    this.masterService.getCustomer(this.user.locationId).subscribe((cusList) => {
      this.customerList = cusList.filter(x => x.bActive == true);
      //console.log(this.customerList);
    });
  }

  onCustomerSelect(event) {
    this.cusDivisionList = [];
    for (const item of event.added) {
      this.loadCustomerDivisionDt(item);
    }
  }

  //// Loads Customer Division list based on customer to grid
  loadCustomerDivisionDt(customerId) {
    this.masterService.getCustomerDivision(customerId).subscribe((cusList) => {
      this.cusDivisionList = cusList;
      //console.log(this.cusDivisionList);
    });
    
  }

  clearCustomerDivision() {
    this.custDivisionForm.get('autoId').setValue(0);
    this.custDivisionForm.get('userId').setValue(this.user.userId);

    /// reset fileds
    this.custDivisionForm.get('details').reset();
    this.custDivisionForm.get('customerDId').enable();
  }

  saveCustomerDivision() {
    if(this.cdSaveButton == true) {
    var customerId = this.custDivisionForm.get('customerDId').value[0];
    var customer = this.customerList.filter(x => x.autoId == customerId);
    var shortCode = customer[0]["shortCode"];

    var obj = {
      createUserId: this.user.userId,
      details: shortCode + '-' + this.custDivisionForm.get('details').value.trim(),
      autoId: this.custDivisionForm.get('autoId').value,
      customerId: customerId
    };
    //console.log(obj);
    this.masterService.saveCustomerDivision(obj).subscribe(
      (result) => {
        //console.log(result);
        if (result == 1) {
          this.toastr.success('Division save successfully !!!');
          this.loadCustomerDivisionDt(customerId);
          this.clearCustomerDivision();
        } else if (result == 2) {
          this.toastr.success('Division update successfully !!!');
          this.loadCustomerDivisionDt(customerId);
          //this.clearCustomerHd();
        } else if (result == -1) {
          this.toastr.warning('Division already exists !!!');
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

  onEditCustomerDivision(event, cellId) {
    this.clearCustomerDivision();
    //console.log(this.customerHdGrid.data);

    const ids = cellId.rowID;
    const selectedRowData = this.cusDivisionGrid.data.filter((record) => {
      return record.autoId == ids;
    });

    var str = selectedRowData[0]['details'];
    var splitted = str.split("-", 2); 

    console.log(splitted);
    this.custDivisionForm.get('autoId').setValue(selectedRowData[0]['autoId']);
    this.custDivisionForm.get('details').setValue(splitted[1]);
    this.custDivisionForm.get('customerDId').disable();
  }

  deactive(cellValue, cellId) {
    const id = cellId.rowID;
    var obj = {
      createUserId: this.user.userId,
      autoId: id,
      bActive: false,
    };
    this.deactiveCusDivision(obj, 'Deactive');
  }

  active(cellValue, cellId) {
    const id = cellId.rowID;
    var obj = {
      createUserId: this.user.userId,
      autoId: id,
      bActive: true,
    };
    this.deactiveCusDivision(obj, 'Active');
  }

  //// active and deactive customer DIVISION
  /// deactive only if user not exists in the sales order header
  deactiveCusDivision(obj, status) {
    if(this.cdDisableButton == true) {
    var customerId = this.custDivisionForm.get('customerDId').value[0];

    this.masterService.disableCustomerDivision(obj).subscribe(
      (result) => {
        if (result == 1) {
          this.toastr.success('Division ' + status + ' Successfully !!!');
          this.loadCustomerDivisionDt(customerId);
        } else if (result == 2) {
          this.toastr.success('Division ' + status + ' Successfully !!!');
          this.loadCustomerDivisionDt(customerId);
        } else if (result == -1) {
          this.toastr.warning("Can't Deactive! User already assign !");
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
