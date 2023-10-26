import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxComboComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { CustomerLoc } from 'src/app/_models/customerLoc';
import { CustomerHd } from 'src/app/_models/customerHd';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';
import { tick } from '@angular/core/testing';

@Component({
  selector: 'app-customer-locations',
  templateUrl: './customer-locations.component.html',
  styleUrls: ['./customer-locations.component.css'],
})
export class CustomerLocationsComponent implements OnInit {
  customerLocForm: FormGroup;
  customerHdList: CustomerHd[];
  customerDtList: CustomerLoc[];
  user: User;
  saveobj: CustomerLoc;
  validationErrors: string[] = [];
  clSaveButton: boolean = false;
  clDisableButton: boolean = false;
  formTitle: string = 'New Location';
  isEditMode: boolean = false;
  isCustomerSel: boolean = false;

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

  @ViewChild('locationGrid', { static: true })
  public locationGrid: IgxGridComponent;

  @ViewChild('customer', { read: IgxComboComponent })
  public customer: IgxComboComponent;

  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    private masterService: MasterService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initilizeForm();
    this.loadHeaderlist();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 122).length > 0) {
        this.clSaveButton = true;
      } if (authMenus.filter((x) => x.autoIdx == 179).length > 0) {
        this.clDisableButton = true;
      }
    }

    this.customerLocForm = this.fb.group({
      autoId: [0],
      userId: this.user.userId,
      shortCode: ['', [Validators.required, Validators.maxLength(20)]],
      address: [''],
      name: ['', [Validators.required, Validators.maxLength(200)]],
      email: ['', [Validators.maxLength(30), Validators.email]],
      phone: [
        '',
        [
          Validators.maxLength(15),
          Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
        ],
      ],
      customerId: ['', Validators.required],
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

  loadHeaderlist() {
    // var user: User = JSON.parse(localStorage.getItem('user'));
    this.masterService
      .getCustomer(this.user.locationId)
      .subscribe((cardList) => {
        this.customerHdList = cardList.filter(x => x.bActive == true);
      });
  }

  ////// Loads Customer Location to grid view
  loadCustomerLoc(customerId) {
    this.masterService.getCustomerLocations(customerId).subscribe((details) => {
      //console.log(details);
      this.customerDtList = details;
      //console.log(this.customerDtList);
    });
  }

  onSelectCustomer(event) {
    this.isCustomerSel = false;
    this.customerDtList = [];

    for (const item of event.added) {
      this.isCustomerSel = true;
      this.loadCustomerLoc(item);
    }
  }

  // clearGridRows() {
  //   this.locationGrid.deselectAllRows();
  //   this.customerDtList = [];
  // }

  refreshPage() {
    this.customerLocForm.reset();
    this.clearControls();
    this.customerDtList = [];
  }

  saveDetails() {
    if (this.clSaveButton == true) {
      var customerId = this.customerLocForm.get('customerId').value[0];
      //console.log("xx");
      var obj = {
        createUserId: this.user.userId,
        name:
          this.customerLocForm.get('name').value == undefined
            ? ''
            : this.customerLocForm.get('name').value.trim(),
        autoId: this.customerLocForm.get('autoId').value,
        address:
          this.customerLocForm.get('address').value == undefined
            ? ''
            : this.customerLocForm.get('address').value.trim(),
        email:
          this.customerLocForm.get('email').value == undefined
            ? ''
            : this.customerLocForm.get('email').value.trim(),
        tel:
          this.customerLocForm.get('phone').value == undefined
            ? ''
            : this.customerLocForm.get('phone').value.trim(),
        shortCode: this.customerLocForm.get('shortCode').value.trim(),
        customerId: this.customerLocForm.get('customerId').value[0],
      };

      // this.saveobj = Object.assign({}, obj);
      //console.log(obj);
      this.masterService.saveCustomerLocation(obj).subscribe(
        (result) => {
          if (result == 1) {
            this.toastr.success('Customer Location save Successfully !!!');
            this.loadCustomerLoc(customerId);
            this.clearControls();
          } else if (result == 2) {
            this.toastr.success('Customer Location update Successfully !!!');
            this.loadCustomerLoc(customerId);
            //this.clearControls();
          } else if (result == -1) {
            this.toastr.warning('Customer Location already exists !!!');
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

  clearControls() {
    this.isEditMode = false;
    this.formTitle = 'New Location';
    //this.customerLocForm.reset();
    this.customerLocForm.get('autoId').setValue(0);
    this.customerLocForm.get('userId').setValue(this.user.userId);
    this.customerLocForm.get('shortCode').reset();
    this.customerLocForm.get('name').reset();
    this.customerLocForm.get('address').reset();
    this.customerLocForm.get('email').reset();
    this.customerLocForm.get('phone').reset();

    this.customerLocForm.get('shortCode').enable();
    this.customerLocForm.get('name').enable();
  }

  //// EDIT ROW LOADS DETAILS TO CONTROL
  onEditCustomerLoc(event, cellId) {
    this.clearControls();
    this.isEditMode = true;
    //console.log(cellId.rowID);
    const ids = cellId.rowID;
    const selectedRowData = this.locationGrid.data.filter((record) => {
      return record.autoId == ids;
    });

    this.formTitle = 'Update Location';
    //console.log(selectedRowData);
    this.customerLocForm
      .get('shortCode')
      .setValue(selectedRowData[0]['shortCode']);
    this.customerLocForm.get('name').setValue(selectedRowData[0]['name']);
    this.customerLocForm.get('autoId').setValue(selectedRowData[0]['autoId']);
    this.customerLocForm.get('address').setValue(selectedRowData[0]['address']);
    this.customerLocForm.get('email').setValue(selectedRowData[0]['email']);
    this.customerLocForm.get('phone').setValue(selectedRowData[0]['tel']);

    this.customerLocForm.get('shortCode').disable();
    this.customerLocForm.get('name').disable();
  }

  deactive(cellValue, cellId) {
    const id = cellId.rowID;
    var obj = {
      createUserId: this.user.userId,
      autoId: id,
      bActive: false,
    };
    this.deactiveCustomerLoc(obj, 'Deactive');
  }

  active(cellValue, cellId) {
    const id = cellId.rowID;

    var obj = {
      createUserId: this.user.userId,
      autoId: id,
      bActive: true,
    };
    this.deactiveCustomerLoc(obj, 'Active');
  }

  deactiveCustomerLoc(obj, status) {
    if (this.clDisableButton == true) {
      var customerId = this.customerLocForm.get('customerId').value[0];

      this.masterService.deactiveCustomerLoc(obj).subscribe(
        (result) => {
          if (result == 1) {
            this.toastr.success(
              'Customer Location' + status + ' Successfully !!!'
            );
            this.loadCustomerLoc(customerId);
          } else if (result == 2) {
            this.toastr.success(
              'Customer Location' + status + ' Successfully !!!'
            );
            this.loadCustomerLoc(customerId);
          } else if (result == -1) {
            this.toastr.warning("Can't Deactive, Customer Location exists !!!");
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
      this.toastr.error('Disable Permission denied !!!');
    }
  }
}
