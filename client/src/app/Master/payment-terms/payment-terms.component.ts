import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { PaymentTerm } from 'src/app/_models/paymentTerm';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-payment-terms',
  templateUrl: './payment-terms.component.html',
  styleUrls: ['./payment-terms.component.css']
})
export class PaymentTermsComponent implements OnInit {
  payTermsForm: FormGroup;
  payTermsList: PaymentTerm[]; 
  user: User;
  validationErrors: string[] = [];
  saveButton:boolean = false;

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

  @ViewChild('payTermsGrid', { static: true })
  public payTermsGrid: IgxGridComponent;
  
  constructor(private accountService: AccountService,
    private masterService: MasterService,
    private fb: FormBuilder,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initilizeForm();
    this.loadPaymentTerms();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 111).length > 0) {
        this.saveButton = true;
      }
    }

    this.payTermsForm = this.fb.group({
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

  loadPaymentTerms() {
    this.masterService.getPaymentTerms().subscribe((result) => {
      this.payTermsList = result;
    });
  }  

  savePaymentTerms() {
    if(this.saveButton == true) {
    var obj = {
      createUserId: this.user.userId,
      name: this.payTermsForm.get('name').value.trim(),
      code: this.payTermsForm.get('code').value.trim(),     
      autoId: this.payTermsForm.get('autoId').value
    };

    // console.log(this.saveobj);
    this.masterService.savePaymentTerms(obj).subscribe(
      (result) => {
        if (result == 1) {
          this.toastr.success('Payment Terms save Successfully !!!');
          this.loadPaymentTerms();
          this.clearControls();
        } else if (result == 2) {
          this.toastr.success('Payment Terms update Successfully !!!');
          this.loadPaymentTerms();
          this.clearControls();
        } else if (result == -1) {
          this.toastr.warning('Payment Terms already exists !!!');
        } else if (result == -2) {
          this.toastr.warning('Payment Terms fail, already in use !!!');
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

  onEditPaymentTerms(event, cellId) {
    this.clearControls();
    //console.log(cellId.rowID);
    const ids = cellId.rowID;
    const selectedRowData = this.payTermsGrid.data.filter((record) => {
      return record.autoId == ids;
    });

    //console.log(selectedRowData);
    this.payTermsForm.get('name').setValue(selectedRowData[0]['name']);
    this.payTermsForm.get('autoId').setValue(selectedRowData[0]['autoId']);
    this.payTermsForm.get('code').setValue(selectedRowData[0]['code']);
    // this.payTermsForm.get('symbol').setValue(selectedRowData[0]['symbol']);
    // this.payTermsForm.get('name').disable();
  }

  clearControls() {
    //this.masterColor.reset();
    this.payTermsForm.get('autoId').setValue(0);
    this.payTermsForm.get('createUserId').setValue(this.user.userId);
    this.payTermsForm.get('name').setValue('');
    this.payTermsForm.get('code').setValue('');
  }

  resetControls() {
    this.clearControls();
    //this.clearGridRows();
  }

}
