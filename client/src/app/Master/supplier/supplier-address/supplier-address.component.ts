import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators,FormBuilder } from '@angular/forms';
import { User } from 'src/app/_models/user';
import { IComboSelectionChangeEventArgs, IgxComboComponent, IgxGridComponent } from 'igniteui-angular';
import { PurchasingService } from '_services/purchasing.service';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';
import { SupplierHeader } from 'src/app/_models/supplierHeader';
import { SupplierAddressList } from 'src/app/_models/supplierAddressList';
import { AddressType } from 'src/app/_models/addressType';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

@Component({
  selector: 'app-supplier-address',
  templateUrl: './supplier-address.component.html',
  styleUrls: ['./supplier-address.component.css']
})
export class SupplierAddressComponent implements OnInit {
  supplierAddressListForm: FormGroup;
  supAddListForm: FormGroup;
  user: User;
  addTypeList: AddressType[];
  countryList: any[];
  saSaveButton: boolean=false;
  saDisableButton : boolean=false;
  supplierList : SupplierHeader[];
  supplierAddressList : SupplierAddressList[];
  validationErrors: string[] = [];
  formTitle: string = 'New Supplier Address';

  @ViewChild('supplierAddGrid', { static: true })
  public supplierAddGrid: IgxGridComponent;
  @ViewChild('supplierC', { read: IgxComboComponent })
  public supplierC: IgxComboComponent;
  @ViewChild('addressType', { read: IgxComboComponent })
  public addressType: IgxComboComponent;
  @ViewChild('country', { read: IgxComboComponent })
  public country: IgxComboComponent;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private masterService: MasterService,
    private purchasingService: PurchasingService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadSupplier();
    this.loadAddressType();
    this.loadCountries();
  }
  initializeForm(){
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
      //console.log(this.user.userId);
    });

    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 125).length > 0) {
        this.saSaveButton = true;
      } if (authMenus.filter((x) => x.autoIdx == 149).length > 0) {
        this.saDisableButton = true;
      }
    }

    this.supplierAddressListForm=this.fb.group({
      suppAddId: [0],
      userId: this.user.userId,
      supplierId: ['', [Validators.required]],
      addressTypeId: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', Validators.maxLength(20)],
      state: ['', Validators.maxLength(20)],
      zipPostalCode: ['', [Validators.maxLength(20)]],      
      countryId: ['', Validators.required], 
      phone: [
        '',
        [
          Validators.maxLength(15),
          Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
        ],
      ],           
      vatNo: ['', Validators.maxLength(20)],
      taxNo: ['', Validators.maxLength(20)],
      tinNo: ['', Validators.maxLength(20)]
    });
  }
  loadSupplier(){
    this.supplierList = [];
    this.purchasingService.getSupplier().subscribe(result => {
      this.supplierList = result
    })
  }
  onSupplierSelect(event){
    this.supplierList = [];
    for (const item of event.added) {
      this.loadSupplierAddressList(item);
     }   
  }
  
  loadSupplierAddressList(supplierId){
    this.supplierAddressList = [];
    this.masterService.getSupplierAddressList(supplierId).subscribe(supCurr =>{
      this.supplierAddressList=supCurr
      //console.log(supCurr);
  });
  }
  singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
    }
  }
  loadAddressType() {
    this.masterService.getAddressType().subscribe((addList) => {
      this.addTypeList = addList;
    });
  }
  loadCountries() {
    this.masterService.getCountries().subscribe((country) => {
      this.countryList = country;
    });
  }
  saveSupplierAddressList(){
    if(this.saSaveButton==true){
      var supplierId=this.supplierAddressListForm.get('supplierId').value[0];
      var Obj ={
        suppAddId : this.supplierAddressListForm.get('suppAddId').value,
        supplierId : supplierId,
        addressTypeId : this.supplierAddressListForm.get('addressTypeId').value[0],
        address : this.supplierAddressListForm.get('address').value.trim(),
        city : this.supplierAddressListForm.get('city').value.trim(),
        state : this.supplierAddressListForm.get('state').value.trim(),
        zipPostalCode : this.supplierAddressListForm.get('zipPostalCode').value.trim(),
        countryId : this.supplierAddressListForm.get('countryId').value[0],
        tel : this.supplierAddressListForm.get('phone').value.trim(),
        vatNo : this.supplierAddressListForm.get('vatNo').value.trim(),
        taxNo : this.supplierAddressListForm.get('taxNo').value.trim(),
        tinNo : this.supplierAddressListForm.get('tinNo').value.trim(),
        userId: this.supplierAddressListForm.get('userId').value
      };
      this.masterService.saveSupplierAddList(Obj).subscribe((result)=>{
        if (result == 1) {
          this.toastr.success('Address save successfully !!!');
        } else if (result == 2) {
          this.toastr.success('Address update successfully !!!');
        } else if (result == -1) {
          this.toastr.warning('Address already exists !!!');
        } else {
          this.toastr.error('Contact Admin. Error No:- ' + result.toString());
        }
      },
      (error) =>{
        this.validationErrors = error;
      });
    }
    else {
      this.toastr.error('Save Permission denied !!!');
    }
  }
  clearSupplierAddress(){
    //this.isEditMode = false;
    //this.custAddressForm.reset();
    this.supplierAddressListForm.get('autoId').setValue(0);
    this.supplierAddressListForm.get('userId').setValue(this.user.userId);

    this.supplierAddressListForm.get('addressTypeId').reset();
    this.supplierAddressListForm.get('countryId').reset();

    this.supplierAddressListForm.get('address').reset();
    this.supplierAddressListForm.get('city').reset();
    this.supplierAddressListForm.get('zipPostalCode').reset();
    this.supplierAddressListForm.get('phone').reset();
    this.supplierAddressListForm.get('state').reset();
    this.supplierAddressListForm.get('email').reset();
    this.supplierAddressListForm.get('vatNo').reset();
    this.supplierAddressListForm.get('taxNo').reset();
    this.supplierAddressListForm.get('tinNo').reset();

    this.formTitle = 'New Customer Address';
  }

  onEditSupAddress(event, cellId) {
    //this.clearSupplierAddress();
    //this.isEditMode = true;

    const ids = cellId.rowID;
    const selectedRowData = this.supplierAddGrid.data.filter((record) => {
      return record.suppAddId == ids;
    });

    //console.log(selectedRowData);

    this.formTitle = 'Update Customer Address';
    this.supplierAddressListForm.get('suppAddId').setValue(selectedRowData[0]['suppAddId']);
    this.supplierAddressListForm.get('address').setValue(selectedRowData[0]['address']);
    this.supplierAddressListForm.get('city').setValue(selectedRowData[0]['city']);
    this.supplierAddressListForm.get('zipPostalCode').setValue(selectedRowData[0]['zipPostalCode']);
    this.supplierAddressListForm.get('phone').setValue(selectedRowData[0]['tel']);
    this.supplierAddressListForm.get('state').setValue(selectedRowData[0]['state']);
    this.supplierAddressListForm.get('vatNo').setValue(selectedRowData[0]['vatNo']);
    this.supplierAddressListForm.get('taxNo').setValue(selectedRowData[0]['taxNo']);
    this.supplierAddressListForm.get('tinNo').setValue(selectedRowData[0]['tinNo']);

    this.addressType.setSelectedItem(selectedRowData[0]['addressTypeId'], true);
    this.country.setSelectedItem(selectedRowData[0]['countryId'], true);
  }
}
