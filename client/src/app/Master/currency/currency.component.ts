import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { Currency } from 'src/app/_models/currency';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.css']
})
export class CurrencyComponent implements OnInit {
  currencyForm: FormGroup;
  currencyList: Currency[]; 
  user: User;
  saveButton: boolean = false;
  validationErrors: string[] = [];

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

  @ViewChild('currencyGrid', { static: true })
  public currencyGrid: IgxGridComponent;
  
  constructor(private accountService: AccountService,
    private masterService: MasterService,
    private fb: FormBuilder,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initilizeForm();
    this.loadCurrency();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 109).length > 0) {
        this.saveButton = true;
      }
    }

    this.currencyForm = this.fb.group({
      autoId: [0],
      createUserId: this.user.userId,
      name: ['', [Validators.required, Validators.maxLength(50)]],
      code: ['', [Validators.maxLength(5) ]],
      symbol: ['', [Validators.maxLength(5) ]],
    });
  }

  public onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  loadCurrency() {
    // this.currencyList = [];
    this.masterService.getCurrency().subscribe((result) => {
      this.currencyList = result;
    });
  }  

  saveCurrency() {
    if (this.saveButton == true) {
    // var loc: User = JSON.parse(localStorage.getItem('user'));
    var obj = {
      createUserId: this.user.userId,
      name: this.currencyForm.get('name').value.trim(),
      code: this.currencyForm.get('code').value.trim(),
      symbol: this.currencyForm.get('symbol').value.trim(),
      autoId: this.currencyForm.get('autoId').value,
      locationId: this.user.locationId
    };

    // console.log(this.saveobj);
    this.masterService.saveCurrency(obj).subscribe(
      (result) => {
        if (result == 1) {
          this.toastr.success('Currency save Successfully !!!');
          this.loadCurrency();
          this.clearControls();
        } else if (result == 2) {
          this.toastr.success('Currency update Successfully !!!');
          this.loadCurrency();
          this.clearControls();
        } else if (result == -1) {
          this.toastr.warning('Currency already exists !!!');
        } else if (result == -2) {
          this.toastr.warning('Currency fail, already in use !!!');
        } else {
          this.toastr.error('Contact Admin. Error No:- ' + result.toString());
        }
      },
      (error) => {
        this.validationErrors = error;
      });
    } else {
      this.toastr.error('Save Permission denied !!!');
    }
  }

  onEditCurrency(event, cellId) {
    this.clearControls();
    //console.log(cellId.rowID);
    const ids = cellId.rowID;
    const selectedRowData = this.currencyGrid.data.filter((record) => {
      return record.autoId == ids;
    });

    //console.log(selectedRowData);
    this.currencyForm.get('name').setValue(selectedRowData[0]['name']);
    this.currencyForm.get('autoId').setValue(selectedRowData[0]['autoId']);
    this.currencyForm.get('code').setValue(selectedRowData[0]['code']);
    this.currencyForm.get('symbol').setValue(selectedRowData[0]['symbol']);
    // this.currencyForm.get('name').disable();
  }

  clearControls() {
    //this.masterColor.reset();
    this.currencyForm.get('autoId').setValue(0);
    this.currencyForm.get('createUserId').setValue(this.user.userId);
    this.currencyForm.get('name').setValue('');
    this.currencyForm.get('code').setValue('');
    this.currencyForm.get('symbol').setValue('');
  }

  resetControls() {
    // this.mstrUnits.reset();
    this.clearControls();
    //this.clearGridRows();
  }

}
