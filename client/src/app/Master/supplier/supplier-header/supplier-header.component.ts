import { Component, OnInit , ViewChild} from '@angular/core';
import { IComboSelectionChangeEventArgs, IgxComboComponent, IgxGridComponent } from 'igniteui-angular';
import { FormGroup ,FormBuilder,Validators} from '@angular/forms';
import { SupplierHeader } from 'src/app/_models/supplierHeader';
import { AccountService } from '_services/account.service';
import { PurchasingService } from '_services/purchasing.service';
import { User } from 'src/app/_models/user';
import { ToastrService } from 'ngx-toastr';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-supplier-header',
  templateUrl: './supplier-header.component.html',
  styleUrls: ['./supplier-header.component.css']
})
export class SupplierHeaderComponent implements OnInit {
  supplierHeaderForm: FormGroup;
  supplierList: SupplierHeader[];
  validationErrors: string[] = [];
  countryList: any[];
  currencyList: any[];
  supplierTList: any[];
  accountGList: any[];
  masterCompanyList: any[];
  SaveButton: boolean=false;
  isEditMode: boolean = false;
  chDisableButton: boolean=false;
  user: User;
  formTitle: string = "New Supplier";

  @ViewChild('supplierHdGrid', { static: true })
  public supplierHdGrid: IgxGridComponent;
  @ViewChild('country', { read: IgxComboComponent })
  public country: IgxComboComponent;
  @ViewChild('currency', { read: IgxComboComponent })
  public currency: IgxComboComponent;
  @ViewChild('supplierType', { read: IgxComboComponent })
  public supplierType: IgxComboComponent;
  @ViewChild('company', { read: IgxComboComponent })
  public company: IgxComboComponent;

  constructor(
    private purchasingService: PurchasingService,
    private accountService: AccountService,
    private fb: FormBuilder,
    private masterService: MasterService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadSupplier();
    this.loadCountries();
    this.loadCurrency();
    this.loadSupplierType();
    this.loadCompanydt();
  }
  initializeForm(){
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });
    var authMenus = this.user.permitMenus;
    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 2239).length > 0) {
        this.SaveButton = true;
      }
      if (authMenus.filter((x) => x.autoIdx == 2239).length > 0) {
        this.chDisableButton = true;
      }
    }
    this.supplierHeaderForm = this.fb.group({
      supplierId: [0],
      name: ['', [Validators.required, Validators.maxLength(200)]],
      shortCode: ['', [Validators.required, Validators.maxLength(20)]],
      address: [''],
      city: ['', Validators.maxLength(30)],
      state:['', [Validators.required, Validators.maxLength(50)]],
      zipPostalCode: ['', Validators.maxLength(50)],
      countryId: ['', Validators.required],
      tel: [
        '',
        [
          Validators.maxLength(15),
          Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
        ],
      ],
      email: ['', [Validators.maxLength(30), Validators.email]],
      currencyId: ['', Validators.required],
      supTypeId:['', Validators.required],
      companyId:['', Validators.required],
      vatNo: ['', Validators.maxLength(20)],
      taxNo: ['', Validators.maxLength(20)],
      tinNo: ['', Validators.maxLength(20)],
      creditDays: [0],
      shipmentTolerence:[''],
      accountGroupId:['', Validators.required],
      locationId:['', Validators.required],
      userId: this.user.userId 
    });
  }
  singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
    }
  }
  loadSupplier() {
    this.purchasingService.getSupplier().subscribe(result => {
      this.supplierList = result
    }); 
  }
  loadCountries() {
    this.masterService.getCountries().subscribe((country) => {
      this.countryList = country;
      //console.log(country);
    });
  }
  loadCurrency() {
    this.masterService.getCurrency().subscribe((curr) => {
      this.currencyList = curr;
    });
  }
  loadSupplierType() {
    this.masterService.getSupplierType().subscribe((sup) => {
      this.supplierTList = sup;
     // console.log(sup);
    });
  }
  loadCompanydt(){
    this.masterService.getMasterCompany().subscribe((strCompanyList) =>{
      this.masterCompanyList = strCompanyList
    // console.log(this.masterCompanyList);
    }); 
  }
  saveSupplier(){
    if(this.SaveButton==true){
      //console.log(this.SaveButton);
      var obj={
        createUserId: this.user.userId,
        supplierId: this.supplierHeaderForm.get('supplierId').value,
        name: this.supplierHeaderForm.get('name').value == undefined 
        ? '' : this.supplierHeaderForm.get('name').value.trim(),
        shortCode: this.supplierHeaderForm.get('shortCode').value == undefined
        ? '' : this.supplierHeaderForm.get('shortCode').value.trim(),
        address: this.supplierHeaderForm.get('address').value == undefined
        ? '' : this.supplierHeaderForm.get('address').value.trim(),
        city: this.supplierHeaderForm.get('city').value == undefined
        ? '' : this.supplierHeaderForm.get('city').value.trim(),
        state: this.supplierHeaderForm.get('state').value == undefined
        ? '' : this.supplierHeaderForm.get('state').value.trim(),
        zipPostalCode: this.supplierHeaderForm.get('zipPostalCode').value == undefined
        ? '' : this.supplierHeaderForm.get('zipPostalCode').value.trim(),
        countryId: this.supplierHeaderForm.get('countryId').value == undefined
        ? '' : this.supplierHeaderForm.get('countryId').value[0],
        companyId: this.supplierHeaderForm.get('companyId').value == undefined
        ? '' : this.supplierHeaderForm.get('companyId').value[0],
        tel: this.supplierHeaderForm.get('tel').value == undefined
        ? '' : this.supplierHeaderForm.get('tel').value.trim(),
        email: this.supplierHeaderForm.get('email').value == undefined
        ? '' : this.supplierHeaderForm.get('email').value.trim(),
        currencyId: this.supplierHeaderForm.get('currencyId').value == undefined
        ? '' : this.supplierHeaderForm.get('currencyId').value[0],
        supTypeId: this.supplierHeaderForm.get('supTypeId').value == undefined
        ? '' : this.supplierHeaderForm.get('supTypeId').value[0],
        vatNo: this.supplierHeaderForm.get('vatNo').value == undefined
        ? '' : this.supplierHeaderForm.get('vatNo').value.trim(),
        taxNo: this.supplierHeaderForm.get('taxNo').value == undefined
        ? '' : this.supplierHeaderForm.get('taxNo').value.trim(),
        tinNo: this.supplierHeaderForm.get('tinNo').value == undefined
        ? '' : this.supplierHeaderForm.get('tinNo').value.trim(),
        creditDays: this.supplierHeaderForm.get('creditDays').value == undefined
        ? '' : this.supplierHeaderForm.get('creditDays').value,
        shipmentTolorence: this.supplierHeaderForm.get('shipmentTolerence').value == undefined
        ? '' : this.supplierHeaderForm.get('shipmentTolerence').value,
        accountGroupId: 0
        //locationId: this.supplierHeaderForm.get('locationId').value == undefined
        //? '' : this.supplierHeaderForm.get('locationId').value.trim()
      };
      //console.log(obj);
      this.masterService.saveSupplierHd(obj).subscribe(
       (result)=>{
        if (result == 1) {
          this.toastr.success('Supplier save successfully !!!');
          this.loadSupplier();
          this.clearSuplierHd();
        } else if (result == 2) {
          this.toastr.success('Supplier update successfully !!!');
          this.loadSupplier();
          this.clearSuplierHd();
        } else if (result == -1) {
          this.toastr.warning('Supplier already exists !!!');
        } else {
          this.toastr.error('Contact Admin. Error No:- ' + result.toString());
        }
      },
      (error) => {
        this.validationErrors = error;
       });
    }
  }
  clearSuplierHd(){
    this.isEditMode = false;
    this.supplierHeaderForm.get('supplierId').setValue(0);
    this.supplierHeaderForm.get('name').setValue('');
    this.supplierHeaderForm.get('shortCode').setValue('');
    this.supplierHeaderForm.get('address').setValue('');
    this.supplierHeaderForm.get('city').setValue('');
    this.supplierHeaderForm.get('state').setValue('');
    this.supplierHeaderForm.get('zipPostalCode').setValue('');
    this.supplierHeaderForm.get('countryId').setValue('');
    this.supplierHeaderForm.get('companyId').setValue('');
    this.supplierHeaderForm.get('tel').setValue('');
    this.supplierHeaderForm.get('email').setValue('');
    this.supplierHeaderForm.get('currencyId').setValue('');
    this.supplierHeaderForm.get('supTypeId').setValue('');
    this.supplierHeaderForm.get('vatNo').setValue('');
    this.supplierHeaderForm.get('taxNo').setValue('');
    this.supplierHeaderForm.get('tinNo').setValue('');
    this.supplierHeaderForm.get('creditDays').setValue('');
    this.supplierHeaderForm.get('shipmentTolerence').setValue('');
    this.supplierHeaderForm.get('locationId').setValue('');
    this.formTitle = "New Supplier";
  }
  onEditSupplierHd(event, cellId) {
    this.clearSuplierHd();
    this.isEditMode = true;
    //console.log(this.supplierHdGrid.data);
    const ids = cellId.rowID;
    const selectedRowData = this.supplierHdGrid.data.filter((record) => {
    return record.supplierId == ids;  
    }); 
    //console.log(selectedRowData);
    this.formTitle = "Update Supplier";
    this.supplierHeaderForm.get('name').setValue(selectedRowData[0]['name']);
    this.supplierHeaderForm.get('supplierId').setValue(selectedRowData[0]['supplierId']);
    this.supplierHeaderForm.get('address').setValue(selectedRowData[0]['address']);
    this.supplierHeaderForm.get('shortCode').setValue(selectedRowData[0]['shortCode']);
    this.supplierHeaderForm.get('city').setValue(selectedRowData[0]['city']);
    this.supplierHeaderForm.get('email').setValue(selectedRowData[0]['email']);
    this.supplierHeaderForm.get('state').setValue(selectedRowData[0]['state']);
    this.supplierHeaderForm.get('zipPostalCode').setValue(selectedRowData[0]['zipPostalCode']);
    this.country.setSelectedItem(selectedRowData[0]['countryId'], true);
    this.supplierHeaderForm.get('tel').setValue(selectedRowData[0]['tel']);
    this.currency.setSelectedItem(selectedRowData[0]['currencyId'], true);
    this.supplierType.setSelectedItem(selectedRowData[0]['supTypeId'], true);
    this.company.setSelectedItem(selectedRowData[0]['companyId'], true);
    this.supplierHeaderForm.get('vatNo').setValue(selectedRowData[0]['vatNo']);
    this.supplierHeaderForm.get('taxNo').setValue(selectedRowData[0]['taxNo']);
    this.supplierHeaderForm.get('tinNo').setValue(selectedRowData[0]['tinNo']);
    this.supplierHeaderForm.get('creditDays').setValue(selectedRowData[0]['creditDays']);
    this.supplierHeaderForm.get('shipmentTolerence').setValue(selectedRowData[0]['shipmentTolorence']);
   // this.currency.setSelectedItem(selectedRowData[0]['currencyId'], true);
   
   /// Disabled fileds
   this.supplierHeaderForm.get('name').disable();
   this.supplierHeaderForm.get('shortCode').disable();
   this.supplierHeaderForm.get('currencyId').disable();
   this.supplierHeaderForm.get('supplierId').disable();
  }
  deactive(cellValue, cellId) {
    const id = cellId.rowID;
    var obj = {
      createUserId: this.user.userId,
      supplierId: id,
      bActive: false,
    };
    this.deactiveCustomer(obj, 'Deactive');
  }

  active(cellValue, cellId) {
    const id = cellId.rowID;
    var obj = {
      createUserId: this.user.userId,
      supplierId: id,
      bActive: true,
    };
    this.deactiveCustomer(obj, 'Active');
  }
  deactiveCustomer(obj, status) {
    if(this.chDisableButton == true) {
    this.masterService.deactiveSupplier(obj).subscribe(
      (result) => {
        if (result == 1) {
          this.toastr.success('Supplier ' + status + ' Successfully !!!');
          this.loadSupplier();
        } else if (result == 2) {
          this.toastr.success('Supplier ' + status + ' Successfully !!!');
          this.loadSupplier();
        } else if (result == -1) {
          this.toastr.warning("Can't Deactive, Supplier details exists !!!");
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
