import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { AddressType } from 'src/app/_models/addressType';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-address-type',
  templateUrl: './address-type.component.html',
  styleUrls: ['./address-type.component.css']
})
export class AddressTypeComponent implements OnInit {
  addTypeForm: FormGroup;
  addTypeList: AddressType[]; 
  user: User;
  validationErrors: string[] = [];
  saveButton: boolean = false;

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

  @ViewChild('addTypeGrid', { static: true })
  public addTypeGrid: IgxGridComponent;
  
  constructor(private accountService: AccountService,
    private masterService: MasterService,
    private fb: FormBuilder,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initilizeForm();
    this.loadAddressType();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 121).length > 0) {
        this.saveButton = true;
      }
    }

    this.addTypeForm = this.fb.group({
      autoId: [0],
      createUserId: this.user.userId,
      addressCode: ['', [Validators.required, Validators.maxLength(50)]],
      addressCodeName: ['', [Validators.required, Validators.maxLength(50) ]]    
    });
  }

  public onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  loadAddressType() {
    this.masterService.getAddressType().subscribe((result) => {
      this.addTypeList = result;
    });
  }  

  saveAddressType() {
    if(this.saveButton == true) {
    var obj = {
      createUserId: this.user.userId,
      addressCode: this.addTypeForm.get('addressCode').value.trim(),
      addressCodeName: this.addTypeForm.get('addressCodeName').value.trim(),
      autoId: this.addTypeForm.get('autoId').value
    };

    // console.log(obj);
    this.masterService.saveAddressType(obj).subscribe(result => {
        if (result == 1) {
          this.toastr.success('Address Type save Successfully !!!');
          this.loadAddressType();
          this.clearControls();
        } else if (result == 2) {
          this.toastr.success('Address Type update Successfully !!!');
          this.loadAddressType();
          this.clearControls();
        } else if (result == -1) {
          this.toastr.warning('Address Type already exists !!!');
        } else if (result == -2) {
          this.toastr.warning('Address Type fail, already in use !!!');
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

  onEditAddressType(event, cellId) {
    this.clearControls();
    //console.log(cellId.rowID);
    const ids = cellId.rowID;
    const selectedRowData = this.addTypeGrid.data.filter((record) => {
      return record.autoId == ids;
    });

    //console.log(selectedRowData);
    this.addTypeForm.get('addressCode').setValue(selectedRowData[0]['addressCode']);
    this.addTypeForm.get('autoId').setValue(selectedRowData[0]['autoId']);
    this.addTypeForm.get('addressCodeName').setValue(selectedRowData[0]['addressCodeName']);

  }

  clearControls() {
    //this.masterColor.reset();
    this.addTypeForm.get('autoId').setValue(0);
    this.addTypeForm.get('addressCode').setValue('');
    this.addTypeForm.get('addressCodeName').setValue('');
  }

  resetControls() {
    // this.mstrUnits.reset();
    this.clearControls();
    //this.clearGridRows();
  }

}
