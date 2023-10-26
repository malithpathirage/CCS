import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxComboComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { AddressType } from 'src/app/_models/addressType';
import { CustomerHd } from 'src/app/_models/customerHd';
import { CustomerLoc } from 'src/app/_models/customerLoc';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-customer-address',
  templateUrl: './customer-address.component.html',
  styleUrls: ['./customer-address.component.css']
})
export class CustomerAddressComponent implements OnInit {
  custAddressForm: FormGroup;
  user: User;
  customerList: CustomerHd[];
  addTypeList: AddressType[];
  currencyList: any[];
  countryList: any[];
  cusAddList: any[];
  cusLocList: CustomerLoc[];
  caSaveButton: boolean = false;
  caDisableButton: boolean = false;
  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;
  isEditMode: boolean = false;
  formTitle: string = 'New Customer Address';
  validationErrors: string[] = [];
  isCustomerSel: boolean = false;

  @ViewChild('cusLocation', { read: IgxComboComponent })
  public cusLocation: IgxComboComponent;
  @ViewChild('addressType', { read: IgxComboComponent })
  public addressType: IgxComboComponent;
  @ViewChild('currency', { read: IgxComboComponent })
  public currency: IgxComboComponent;
  @ViewChild('country', { read: IgxComboComponent })
  public country: IgxComboComponent;
  @ViewChild('customerA', { read: IgxComboComponent })
  public customerA: IgxComboComponent;

  @ViewChild('cusAddressGrid', { static: true })
  public cusAddressGrid: IgxGridComponent;

  constructor(    
    private fb: FormBuilder,
    private accountService: AccountService,
    private masterService: MasterService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.initilizeForm();
    this.loadCustomer();
    this.loadAddressType();
    this.loadCountries();
    this.loadCurrency();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
      //console.log(this.user.userId);
    });

    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 125).length > 0) {
        this.caSaveButton = true;
      } if (authMenus.filter((x) => x.autoIdx == 149).length > 0) {
        this.caDisableButton = true;
      }
    }

    this.custAddressForm = this.fb.group({
      autoId: [0],
      userId: this.user.userId,
      customerAId: ['', [Validators.required]],
      customerLocId: ['', [Validators.required]],
      addressTypeId: ['', [Validators.required]],
      addCode: [{ value: '', disabled: true }],
      addCodeName: [''],
      addressTo: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', Validators.maxLength(20)],
      zipPostalCode: ['', [Validators.maxLength(20)]],      
      countryId: ['', Validators.required], 
      phone: [
        '',
        [
          Validators.maxLength(15),
          Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
        ],
      ],     
      email: ['',[ Validators.maxLength(30), Validators.email]],
      currencyId: [''],      
      vatNo: ['', Validators.maxLength(20)],
      taxNo: ['', Validators.maxLength(20)],
      tinNo: ['', Validators.maxLength(20)]
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

  /// Loads Customer List
  loadCustomer() {
    // var user: User = JSON.parse(localStorage.getItem('user'));
    this.masterService.getCustomer(this.user.locationId).subscribe((cusList) => {
      this.customerList = cusList.filter(x => x.bActive == true);
    });
  }

  /// LOADS ADDRESS TYPE WITH CODE AND CODE NAME
  loadAddressType() {
    this.masterService.getAddressType().subscribe((addList) => {
      this.addTypeList = addList;
    });
  }

  /// LOADS CURRENCY
  loadCurrency() {
    this.masterService.getCurrency().subscribe((curr) => {
      this.currencyList = curr;
    });
  }

  /// LOADS COUNTRIES
  loadCountries() {
    this.masterService.getCountries().subscribe((country) => {
      this.countryList = country;
    });
  }

  loadAddressCode(event){
    this.custAddressForm.get('addCode').reset();
    for (const item of event.added) {
      var address = this.addTypeList.filter(x => x.autoId == item);
      //console.log(address);
      this.custAddressForm.get('addCode').setValue(address[0]["addressCode"]); 
    }
  }

  onCustomerSelect(event) {
    this.cusAddList = [];
    this.isCustomerSel = false;
    for (const item of event.added) {
      this.isCustomerSel = true;
      this.loadCustomerAddressDt(item);
      this.loadCustomerLoc(item);
    }
  }

  loadCustomerLoc(customerId) {
    this.masterService.getCustomerLocation(customerId).subscribe(cusLoc => {
      this.cusLocList = cusLoc
    })
  }

  //// Loads Customer Address list based on customer to grid
  loadCustomerAddressDt(customerId) {
    this.masterService.getCustomerAddressList(customerId).subscribe((cusList) => {
      this.cusAddList = cusList;
      console.log(this.cusAddList);
    });
    
  }

  clearCustomerAddress() {
    this.isEditMode = false;
    //this.custAddressForm.reset();
    this.custAddressForm.get('autoId').setValue(0);
    this.custAddressForm.get('userId').setValue(this.user.userId);

    this.custAddressForm.get('customerLocId').reset();
    this.custAddressForm.get('addressTypeId').reset();
    this.custAddressForm.get('countryId').reset();
    this.custAddressForm.get('currencyId').reset();

    this.custAddressForm.get('addCode').reset();
    this.custAddressForm.get('addressTo').reset();
    this.custAddressForm.get('address').reset();
    this.custAddressForm.get('city').reset();
    this.custAddressForm.get('zipPostalCode').reset();
    this.custAddressForm.get('phone').reset();
    this.custAddressForm.get('email').reset();
    this.custAddressForm.get('vatNo').reset();
    this.custAddressForm.get('taxNo').reset();
    this.custAddressForm.get('tinNo').reset();

    this.formTitle = 'New Customer Address';
  }

  onEditCusAddress(event, cellId) {
    this.clearCustomerAddress();
    this.isEditMode = true;
    //console.log(this.customerHdGrid.data);

    const ids = cellId.rowID;
    const selectedRowData = this.cusAddressGrid.data.filter((record) => {
      return record.autoId == ids;
    });

    this.formTitle = 'Update Customer Address';
    this.custAddressForm.get('autoId').setValue(selectedRowData[0]['autoId']);
    this.custAddressForm.get('addCode').setValue(selectedRowData[0]['addCode']);
    this.custAddressForm.get('addressTo').setValue(selectedRowData[0]['addressTo']);
    this.custAddressForm.get('address').setValue(selectedRowData[0]['address']);
    this.custAddressForm.get('city').setValue(selectedRowData[0]['city']);
    this.custAddressForm.get('zipPostalCode').setValue(selectedRowData[0]['zipPostalCode']);
    this.custAddressForm.get('phone').setValue(selectedRowData[0]['tel']);
    this.custAddressForm.get('email').setValue(selectedRowData[0]['email']);
    this.custAddressForm.get('vatNo').setValue(selectedRowData[0]['vatNo']);
    this.custAddressForm.get('taxNo').setValue(selectedRowData[0]['taxNo']);
    this.custAddressForm.get('tinNo').setValue(selectedRowData[0]['tinNo']);

    this.cusLocation.setSelectedItem(selectedRowData[0]['cusLocationId'], true);
    this.addressType.setSelectedItem(selectedRowData[0]['addressTypeId'], true);
    this.currency.setSelectedItem(selectedRowData[0]['currencyId'], true);
    this.country.setSelectedItem(selectedRowData[0]['countryId'], true);
    // /// disabled fileds
    // this.custAddressForm.get('name').disable();
  }


  saveCustmerAddress() {
    if(this.caSaveButton == true) {
    var customerId = this.custAddressForm.get('customerAId').value[0];
    var obj = {
      autoId: this.custAddressForm.get('autoId').value,
      createUserId: this.user.userId,
      cusLocationId: this.custAddressForm.get('customerLocId').value[0],
      addressTypeId: this.custAddressForm.get('addressTypeId').value[0],
      countryId: this.custAddressForm.get('countryId').value[0],
      currencyId: this.custAddressForm.get('currencyId').value == null ? 0 : this.custAddressForm.get('currencyId').value[0],
      addressTo: this.custAddressForm.get('addressTo').value.trim(),      
      address: this.custAddressForm.get('address').value.trim(),
      city: this.custAddressForm.get('city').value == undefined ? '' : this.custAddressForm.get('city').value.trim(),
      email: this.custAddressForm.get('email').value == undefined ? '' : this.custAddressForm.get('email').value.trim(),
      tel: this.custAddressForm.get('phone').value == undefined ? '' : this.custAddressForm.get('phone').value.trim(),
      vatNo: 
      this.custAddressForm.get('vatNo').value == undefined
          ? ''
          : this.custAddressForm.get('vatNo').value.trim(),
      taxNo:
        this.custAddressForm.get('taxNo').value == undefined
          ? ''
          : this.custAddressForm.get('taxNo').value.trim(),
      tinNo:
        this.custAddressForm.get('tinNo').value == undefined
          ? ''
          : this.custAddressForm.get('tinNo').value.trim(),
      zipPostalCode:
        this.custAddressForm.get('zipPostalCode').value == undefined
          ? ''
          : this.custAddressForm.get('zipPostalCode').value.trim(),
      customerId: customerId
    };

    //console.log(obj);
    this.masterService.saveCustomerAddress(obj).subscribe(
      (result) => {
        //console.log(result);
        if (result == 1) {
          this.toastr.success('Address save successfully !!!');
          this.loadCustomerAddressDt(customerId);
          this.clearCustomerAddress();
        } else if (result == 2) {
          this.toastr.success('Address update successfully !!!');
          this.loadCustomerAddressDt(customerId);
          //this.clearCustomerHd();
        } else if (result == -1) {
          this.toastr.warning('Address already exists !!!');
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

  deactive(cellValue, cellId) {
    const id = cellId.rowID;
    var obj = {
      createUserId: this.user.userId,
      autoId: id,
      bActive: false,
    };
    this.deactiveAddress(obj, 'Deactive');
  }

  active(cellValue, cellId) {
    const id = cellId.rowID;
    var obj = {
      createUserId: this.user.userId,
      autoId: id,
      bActive: true,
    };
    this.deactiveAddress(obj, 'Active');
  }

   //// active and deactive customer ADDRESS
  /// deactive only if user not exists in the sales order header
  deactiveAddress(obj, status) {
    if(this.caDisableButton == true) {
    var customerId = this.custAddressForm.get('customerAId').value[0];

    this.masterService.deactiveCustomerAddress(obj).subscribe(
      (result) => {
        if (result == 1) {
          this.toastr.success('Address ' + status + ' Successfully !!!');
          this.loadCustomerAddressDt(customerId);
        } else if (result == 2) {
          this.toastr.success('Adress ' + status + ' Successfully !!!');
          this.loadCustomerAddressDt(customerId);
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
