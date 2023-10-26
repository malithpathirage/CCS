import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxComboComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { CustomerHd } from 'src/app/_models/customerHd';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-customer-user',
  templateUrl: './customer-user.component.html',
  styleUrls: ['./customer-user.component.css'],
})
export class CustomerUserComponent implements OnInit {
  custUserForm: FormGroup;
  user: User;
  customerList: CustomerHd[];
  cusUserList: any[];
  titleList: any[];
  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;
  cuSaveButton: boolean = false;
  cuDisableButton: boolean = false;
  isEditMode: boolean = false;
  formTitle: string = 'New User';
  validationErrors: string[] = [];
  isCustomerSel: boolean = false;

  @ViewChild('title', { read: IgxComboComponent })
  public title: IgxComboComponent;
  @ViewChild('customerU', { read: IgxComboComponent })
  public customerU: IgxComboComponent;

  @ViewChild('customerUserGrid', { static: true })
  public customerUserGrid: IgxGridComponent;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private masterService: MasterService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initilizeForm();
    this.loadCustomer();
    this.loadTitle();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
      //console.log(this.user.userId);
    });

    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 124).length > 0) {
        this.cuSaveButton = true;
      }  if (authMenus.filter((x) => x.autoIdx == 148).length > 0) {
        this.cuDisableButton = true;
      }
    }

    this.custUserForm = this.fb.group({
      autoId: [0],
      userId: this.user.userId,
      title: ['', [Validators.required]],
      customerUId: ['', [Validators.required]],
      firstName: ['', [Validators.required, Validators.maxLength(30)]],
      lastName: ['', Validators.maxLength(30)],
      designation: ['', [Validators.required, Validators.maxLength(30)]],
      email: [
        '',
        [Validators.required, Validators.maxLength(30), Validators.email],
      ],
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
    });
  }

  loadTitle() {
    this.titleList = [
      { title: 'Mr' },
      { title: 'Mrs' },
      { title: 'Miss' },
      { title: 'Dr' },
      { title: 'Other' },
    ];
  }

  clearCustomerUser() {
    this.isEditMode = false;
    this.custUserForm.get('autoId').setValue(0);
    this.custUserForm.get('userId').setValue(this.user.userId);

    /// reset fileds
    this.custUserForm.get('title').reset();
    this.custUserForm.get('firstName').reset();
    this.custUserForm.get('lastName').reset();
    this.custUserForm.get('designation').reset();
    this.custUserForm.get('email').reset();
    this.formTitle = 'New User';
  }

  onCustomerSelect(event) {
    this.cusUserList = [];
    this.isCustomerSel = false;
    for (const item of event.added) {
      this.isCustomerSel = true;
      this.loadCustomerUserDt(item);
    }
  }

  //// Loads Customer user list based on customer to grid
  loadCustomerUserDt(customerId) {
    this.masterService.getCustomerUserAll(customerId).subscribe((cusList) => {
      this.cusUserList = cusList;
    });
    //console.log(this.cusUserList);
  }

  saveCustmerUser() {
    if(this.cuSaveButton == true) {
    var customerId = this.custUserForm.get('customerUId').value[0];
    var obj = {
      createUserId: this.user.userId,
      title: this.custUserForm.get('title').value[0],
      firstName: this.custUserForm.get('firstName').value.trim(),
      autoId: this.custUserForm.get('autoId').value,
      lastName:
        this.custUserForm.get('lastName').value == undefined
          ? ''
          : this.custUserForm.get('lastName').value.trim(),
      email: this.custUserForm.get('email').value.trim(),
      designation: this.custUserForm.get('designation').value.trim(),
      customerId: customerId
    };

    //console.log(obj);
    this.masterService.saveCustomerUser(obj).subscribe(
      (result) => {
        //console.log(result);
        if (result == 1) {
          this.toastr.success('User save successfully !!!');
          this.loadCustomerUserDt(customerId);
          this.clearCustomerUser();
        } else if (result == 2) {
          this.toastr.success('User update successfully !!!');
          this.loadCustomerUserDt(customerId);
          //this.clearCustomerHd();
        } else if (result == -1 || result == -2) {
          this.toastr.warning('User already exists !!!');
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

  onEditCustomerUser(event, cellId) {
    this.clearCustomerUser();
    this.isEditMode = true;
    //console.log(this.customerHdGrid.data);

    const ids = cellId.rowID;
    const selectedRowData = this.customerUserGrid.data.filter((record) => {
      return record.autoId == ids;
    });

    this.formTitle = 'Update User';
    //console.log(selectedRowData);
    //this.custUserForm.get('title').setValue(selectedRowData[0]['title']);
    this.custUserForm.get('autoId').setValue(selectedRowData[0]['autoId']);
    this.custUserForm
      .get('firstName')
      .setValue(selectedRowData[0]['firstName']);
    this.custUserForm.get('lastName').setValue(selectedRowData[0]['lastName']);
    this.custUserForm.get('email').setValue(selectedRowData[0]['email']);
    this.custUserForm
      .get('designation')
      .setValue(selectedRowData[0]['designation']);

    this.title.setSelectedItem(selectedRowData[0]['title'], true);
    // /// disabled fileds
    // this.custUserForm.get('name').disable();
  }

  deactive(cellValue, cellId) {
    const id = cellId.rowID;
    var obj = {
      createUserId: this.user.userId,
      autoId: id,
      isActive: false,
    };
    this.deactiveUser(obj, 'Deactive');
  }

  active(cellValue, cellId) {
    const id = cellId.rowID;
    var obj = {
      createUserId: this.user.userId,
      autoId: id,
      isActive: true,
    };
    this.deactiveUser(obj, 'Active');
  }

  //// active and deactive customer user
  /// deactive only if user not exists in the sales order header
  deactiveUser(obj, status) {
    if(this.cuDisableButton == true) {
    var customerId = this.custUserForm.get('customerUId').value[0];

    this.masterService.deactiveCustomerUser(obj).subscribe(
      (result) => {
        if (result == 1) {
          this.toastr.success('User ' + status + ' Successfully !!!');
          this.loadCustomerUserDt(customerId);
        } else if (result == 2) {
          this.toastr.success('User ' + status + ' Successfully !!!');
          this.loadCustomerUserDt(customerId);
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
