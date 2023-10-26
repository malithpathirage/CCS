import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxComboComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { CustomerHd } from 'src/app/_models/customerHd';
import { CustomerType } from 'src/app/_models/customerType';
import { InvoiceType } from 'src/app/_models/invoiceType';
import { Tax } from 'src/app/_models/tax';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { FinanceService } from '_services/finance.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-customer-header',
  templateUrl: './customer-header.component.html',
  styleUrls: ['./customer-header.component.css'],
})
export class CustomerHeaderComponent implements OnInit {
  customerHdForm: FormGroup;
  currencyList: any[];
  countryList: any[];
  taxList: Tax[];
  invoiceTypeList: InvoiceType[];
  customerTypeList: CustomerType[];
  user: User;
  customerHdList: CustomerHd[];
  validationErrors: string[] = [];
  chSaveButton: boolean = false;
  chDisableButton: boolean = false;
  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;
  isEditMode: boolean = false;
  formTitle: string = "New Customer";

  @ViewChild('customerHdGrid', { static: true })
  public customerHdGrid: IgxGridComponent;

  @ViewChild('country', { read: IgxComboComponent })
  public country: IgxComboComponent;
  @ViewChild('currency', { read: IgxComboComponent })
  public currency: IgxComboComponent;
  @ViewChild('customerType', { read: IgxComboComponent })
  public customerType: IgxComboComponent;
  @ViewChild('invoiceType', { read: IgxComboComponent })
  public invoiceType: IgxComboComponent;
  @ViewChild('tax', { read: IgxComboComponent })
  public tax: IgxComboComponent;

  @ViewChild('closeModal') closeModal: ElementRef

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private masterService: MasterService,
    private toastr: ToastrService,
    private financeServices: FinanceService
  ) {}

  ngOnInit(): void {
    this.initilizeForm();
    this.loadCountries();
    this.loadCurrency();
    this.loadCustomerheader();
    this.loadCustomerType();
    this.loadInvoiceType();
    this.loadTax();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
      //console.log(this.user.userId);
    });

    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 122).length > 0) {
        this.chSaveButton = true;
      } if (authMenus.filter((x) => x.autoIdx == 147).length > 0) {
        this.chDisableButton = true;
      }
    }

    this.customerHdForm = this.fb.group({
      autoId: [0],
      userId: this.user.userId,
      shortCode: ['', [Validators.required, Validators.maxLength(20)]],
      customerId: ['', [Validators.required, Validators.maxLength(20)]],
      city: ['', Validators.maxLength(30)],
      countryId: [''],
      currencyId: ['', Validators.required],
      invoiceType:['', Validators.required],
      customerType: ['', Validators.required],
      taxId: ['' , Validators.required],
      name: ['', [Validators.required, Validators.maxLength(200)]],
      address: [''],
      email: ['', [Validators.maxLength(30), Validators.email]],
      phone: [
        '',
        [
          Validators.maxLength(15),
          Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
        ],
      ],
      attention: ['', Validators.maxLength(100)],
      vatNo: ['', Validators.maxLength(20)],
      taxNo: ['', Validators.maxLength(20)],
      tinNo: ['', Validators.maxLength(20)],
      zipPostalCode: ['', Validators.maxLength(20)],
      creditDays: [0],
    });
  }

  //// ALOW SINGLE SILECTION ONLY COMBO EVENT
  singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
    }
  }

  loadTax() {
    this.financeServices.getTax().subscribe(result => {
      this.taxList = result
    })
  }

  loadCurrency() {
    this.masterService.getCurrency().subscribe((curr) => {
      this.currencyList = curr;
    });
  }

  loadCountries() {
    this.masterService.getCountries().subscribe((country) => {
      this.countryList = country;
    });
  }

  loadInvoiceType() {
    this.masterService.getInvoiceType().subscribe(result => {
      this.invoiceTypeList = result
    })
  }

  loadCustomerType() {
    this.masterService.getCustomerType().subscribe(result => {
      this.customerTypeList = result
    })
  }

  public onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  loadCustomerheader() {
    // var user: User = JSON.parse(localStorage.getItem('user'));
    this.masterService.getCustomerHdAll(this.user.locationId).subscribe((cusList) => {
      this.customerHdList = cusList;
    });
  }

  saveCustomerHd() {
    if(this.chSaveButton == true) {
    // var user: User = JSON.parse(localStorage.getItem('user'));
    //console.log(this.customerHdForm.get('countryId').value);

    var obj = {
      createUserId: this.user.userId,
      name: this.customerHdForm.get('name').value == undefined ? '' : this.customerHdForm.get('name').value.trim(),
      autoId: this.customerHdForm.get('autoId').value,
      address:
        this.customerHdForm.get('address').value == undefined
          ? ''
          : this.customerHdForm.get('address').value.trim(),
      attention:
          this.customerHdForm.get('attention').value == undefined
            ? ''
            : this.customerHdForm.get('attention').value.trim(),
      email:
        this.customerHdForm.get('email').value == undefined
          ? ''
          : this.customerHdForm.get('email').value.trim(),
      tel:
        this.customerHdForm.get('phone').value == undefined
          ? ''
          : this.customerHdForm.get('phone').value.trim(),
      shortCode: this.customerHdForm.get('shortCode').value.trim(),
      customerId: this.customerHdForm.get('customerId').value.trim(),
      city:
        this.customerHdForm.get('city').value == undefined
          ? ''
          : this.customerHdForm.get('city').value.trim(),
      taxId: 
        this.customerHdForm.get('taxId').value == null
          ? 0
          : this.customerHdForm.get('taxId').value[0],
      countryId:
        this.customerHdForm.get('countryId').value == null
          ? 0
          : this.customerHdForm.get('countryId').value[0],
      currencyId: this.customerHdForm.get('currencyId').value[0],
      vatNo:
        this.customerHdForm.get('vatNo').value == undefined
          ? ''
          : this.customerHdForm.get('vatNo').value.trim(),
      taxNo:
        this.customerHdForm.get('taxNo').value == undefined
          ? ''
          : this.customerHdForm.get('taxNo').value.trim(),
      tinNo:
        this.customerHdForm.get('tinNo').value == undefined
          ? ''
          : this.customerHdForm.get('tinNo').value.trim(),
      zipPostalCode:
        this.customerHdForm.get('zipPostalCode').value == undefined
          ? ''
          : this.customerHdForm.get('zipPostalCode').value.trim(),
      creditDays:
        this.customerHdForm.get('creditDays').value == null
          ? 0
          : this.customerHdForm.get('creditDays').value,
      invTypeId: this.customerHdForm.get('invoiceType').value == null 
          ? 0 
          : this.customerHdForm.get('invoiceType').value[0],
      cusTypeId: this.customerHdForm.get('customerType').value == null  
          ? 0
          : this.customerHdForm.get('customerType').value[0],
      locationId: this.user.locationId,
    };

    //console.log(obj);
    this.masterService.saveCustomerHeader(obj).subscribe(
      (result) => {
        //console.log(result);
        if (result == 1) {
          this.toastr.success('Customer save successfully !!!');
          this.loadCustomerheader();
          this.clearCustomerHd();
          // this.closeModal.nativeElement.click();
        } else if (result == 2) {
          this.toastr.success('Customer update successfully !!!');
          this.loadCustomerheader();
          this.closeModal.nativeElement.click();
          //this.clearCustomerHd();
        } else if (result == -1) {
          this.toastr.warning('Customer already exists !!!');
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
    // const selectedRowData = this.customerHdGrid.data.filter((record) => {
    //   return record.autoId == id;
    // });

    var obj = {
      createUserId: this.user.userId,
      autoId: id,
      bActive: false,
    };
    this.deactiveCustomer(obj, 'Deactive');
  }

  active(cellValue, cellId) {
    const id = cellId.rowID;
    // const selectedRowData = this.customerHdGrid.data.filter((record) => {
    //   return record.autoId == id;
    // });

    var obj = {
      createUserId: this.user.userId,
      autoId: id,
      bActive: true,
    };
    this.deactiveCustomer(obj, 'Active');
  }

  deactiveCustomer(obj, status) {
    if(this.chDisableButton == true) {
    this.masterService.deactiveCustomerHeader(obj).subscribe(
      (result) => {
        if (result == 1) {
          this.toastr.success('Customer ' + status + ' Successfully !!!');
          this.loadCustomerheader();
        } else if (result == 2) {
          this.toastr.success('Customer ' + status + ' Successfully !!!');
          this.loadCustomerheader();
        } else if (result == -1) {
          this.toastr.warning("Can't Deactive, Customer details exists !!!");
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

  clearCustomerHd() {
    this.isEditMode = false;
    this.customerHdForm.reset();
    this.customerHdForm.get('autoId').setValue(0);
    this.customerHdForm.get('userId').setValue(this.user.userId);

    /// enabled fileds
    this.customerHdForm.get('name').enable();
    this.customerHdForm.get('shortCode').enable();
    this.customerHdForm.get('currencyId').enable();
    this.customerHdForm.get('customerId').enable();
    this.customerHdForm.get('creditDays').enable();
    this.formTitle = "New Customer";
  }

  onEditCustomerHd(event, cellId) {
    this.clearCustomerHd();
    this.isEditMode = true;
    //console.log(this.customerHdGrid.data);

    const ids = cellId.rowID;
    const selectedRowData = this.customerHdGrid.data.filter((record) => {
      return record.autoId == ids;
    });

    this.formTitle = "Update Customer";
    //console.log(selectedRowData);
    this.customerHdForm.get('name').setValue(selectedRowData[0]['name']);
    this.customerHdForm.get('autoId').setValue(selectedRowData[0]['autoId']);
    this.customerHdForm.get('address').setValue(selectedRowData[0]['address']);
    this.customerHdForm.get('email').setValue(selectedRowData[0]['email']);
    this.customerHdForm.get('phone').setValue(selectedRowData[0]['tel']);
    this.customerHdForm.get('attention').setValue(selectedRowData[0]['attention']);
    this.customerHdForm
      .get('shortCode')
      .setValue(selectedRowData[0]['shortCode']);
    this.customerHdForm
      .get('customerId')
      .setValue(selectedRowData[0]['customerID']);
    this.customerHdForm.get('city').setValue(selectedRowData[0]['city']);
    this.customerHdForm.get('vatNo').setValue(selectedRowData[0]['vatNo']);
    this.customerHdForm.get('taxNo').setValue(selectedRowData[0]['taxNo']);
    this.customerHdForm.get('tinNo').setValue(selectedRowData[0]['tinNo']);
    this.customerHdForm
      .get('zipPostalCode')
      .setValue(selectedRowData[0]['zipPostalCode']);
    this.customerHdForm
      .get('creditDays')
      .setValue(selectedRowData[0]['creditDays']);
    this.currency.setSelectedItem(selectedRowData[0]['currencyId'], true);
    this.country.setSelectedItem(selectedRowData[0]['countryId'], true);
    this.customerType.setSelectedItem(selectedRowData[0]['cusTypeId'], true);
    this.invoiceType.setSelectedItem(selectedRowData[0]['invTypeId'], true);
    this.tax.setSelectedItem(selectedRowData[0]["taxId"], true);

    /// disabled fileds
    this.customerHdForm.get('name').disable();
    this.customerHdForm.get('shortCode').disable();
    this.customerHdForm.get('currencyId').disable();
    this.customerHdForm.get('customerId').disable();
    this.customerHdForm.get('creditDays').disable();
  }
}
