import { Component, OnInit ,ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxComboComponent, IgxDialogComponent, IgxGridComponent } from 'igniteui-angular';
import { AccountService } from '_services/account.service';
import { PurchasingService } from '_services/purchasing.service';
import { User } from 'src/app/_models/user';
import { SupplierHeader } from 'src/app/_models/supplierHeader';
import { MasterService } from '_services/master.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-supplier-currency',
  templateUrl: './supplier-currency.component.html',
  styleUrls: ['./supplier-currency.component.css']
})
export class SupplierCurrencyComponent implements OnInit {
  supplierCurrencyForm: FormGroup;
  user: User;
  scSaveButton: boolean=false;
  scRemoveButton: boolean=false;
  supplierList: SupplierHeader[];
  supplierCList: any[];
  currencyList: any[];
  validationErrors: string[] = [];
  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;
  rowId: number = 0;

  @ViewChild('supplierC', { read: IgxComboComponent })
  public supplierC: IgxComboComponent;
  @ViewChild('currency', { read: IgxComboComponent })
  public currency: IgxComboComponent;
  @ViewChild('supCurrencyGrid', { static: true })
  public supCurrencyGrid: IgxGridComponent;
  @ViewChild('dialog', { read: IgxDialogComponent })
  public dialog: IgxDialogComponent;

  constructor(private accountService: AccountService,
    private fb: FormBuilder,
    private purchasingService: PurchasingService,
    private masterService: MasterService,
    private toastr: ToastrService
    ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadSupplier();

  }
  initializeForm(){
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
      //console.log(this.user.userId);
    });
    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 2241).length > 0) {
        this.scSaveButton = true;
      } if (authMenus.filter((x) => x.autoIdx == 2242).length > 0) {
        this.scRemoveButton = true;
      }
    }
    this.supplierCurrencyForm = this.fb.group({
      supplierCId: [0],
      userId: this.user.userId,
      currencyId: ['', [Validators.required]],
      supplierId: ['', [Validators.required]]      
    });
  }
  loadSupplier() {
    this.purchasingService.getSupplier().subscribe(result => {
      this.supplierList = result
    })
    this.loadCurrency();
  }
  loadCurrency() {
    this.masterService.getCurrency().subscribe(currency => {
      this.currencyList=currency;
    });
  }
  singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
    }
  }
  onSupplierSelect(event){
    this.supplierCList=[];
    for (const item of event.added) {
     this.loadSupplierCurrency(item);
    }   
  }
  loadSupplierCurrency(supplierId){
    this.masterService.getSupplierCurrency(supplierId).subscribe(supCurr =>{
      this.supplierCList=supCurr
    //  console.log(supCurr);
  });
}
  public onResize(event) {
  this.col = event.column;
  this.pWidth = event.prevWidth;
  this.nWidth = event.newWidth;
  }
  clearSupplierCurrency() {
    this.supplierCurrencyForm.get('supplierCId').setValue(0);
    this.supplierCurrencyForm.get('userId').setValue(this.user.userId);

    /// reset fileds
    this.supplierCurrencyForm.get('currencyId').reset();
    this.supplierCurrencyForm.get('supplierId').enable();
  }
  saveSupplierCurrency(){
    if(this.scSaveButton==true){
      var supplierId = this.supplierCurrencyForm.get('supplierId').value[0];
      var obj={
        createUserId: this.user.userId,
        currencyId: this.supplierCurrencyForm.get('currencyId').value[0],
        supplierCId: this.supplierCurrencyForm.get('supplierCId').value,
        supplierId: supplierId
      };
      this.masterService.saveSupplierCurrency(obj).subscribe((result) =>{
        if (result == 1) {
          this.toastr.success('Currency assign successfully !!!');
          this.loadSupplierCurrency(supplierId);
          this.clearSupplierCurrency();
        }  else if (result == -1) {
          this.toastr.warning('Currency already exists !!!');
        } else {
          this.toastr.error('Contact Admin. Error No:- ' + result.toString());
        }
      },
      (error) => {
        this.validationErrors = error;
      });
    }else {
      this.toastr.error('Save Permission denied !!!');
    }
  }
  resetControlls(){
    this.clearSupplierCurrency()
  }
  /// delete currency event 
  onDeleteSupCurrency(event, cellId) {
    if(this.scRemoveButton == true) {
   var supplierId = this.supplierCurrencyForm.get('supplierId').value[0];
    const ids = cellId.rowID;
    const selectedRowData = this.supCurrencyGrid.data.filter((record) => {
      return record.supplierCId == ids;
    });
    //console.log(selectedRowData);

    var obj = {
      createUserId: this.user.userId,
      currencyId: selectedRowData[0]['currencyId'],
      SuppCurId: selectedRowData[0]['supplierCId']
    };
    // console.log(obj);
    this.masterService.deleteSupplierCurrency(obj).subscribe(
      (result) => {
        //console.log(result);
        if (result == 1) {
          this.toastr.success('Currency delete successfully !!!');
          this.loadSupplierCurrency(supplierId);
          this.clearSupplierCurrency();
        }  else if (result == -1) {
          this.toastr.warning('Delete Fail !! Currency already assign !!!');
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
  //// delete confirmation ok buttun click event
  onDialogOKSelected(event) {
    event.dialog.close();
    this.onDeleteSupCurrency(event, this.rowId);
  }
  //// delete confirmation open dialog
  openDelivDialog(event, cellId) {
    this.rowId = cellId;
    this.dialog.open();    
  }
}
