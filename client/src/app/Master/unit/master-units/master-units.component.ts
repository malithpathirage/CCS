import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/_models/user';
import { Size } from 'src/app/_models/size';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';
import { Units } from 'src/app/_models/units';

@Component({
  selector: 'app-master-units',
  templateUrl: './master-units.component.html',
  styleUrls: ['./master-units.component.css'],
})

export class MasterUnitsComponent implements OnInit {
  mstrUnits: FormGroup;
  unitList: Units[]; 
  user: User;
  saveobj: Units;
  uSaveButton: boolean = false;
  validationErrors: string[] = [];

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

  @ViewChild('unitGrid', { static: true })
  public unitGrid: IgxGridComponent;

  constructor(
    private accountService: AccountService,
    private masterService: MasterService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initilizeForm();
    this.loadUnits();
  }

  public onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  loadUnits() {
    this.masterService.getUnits().subscribe((cardList) => {
      this.unitList = cardList;
    });
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 101).length > 0) {
        this.uSaveButton = true;
      }
    }

    this.mstrUnits = this.fb.group({
      autoId: [0],
      createUserId: this.user.userId,
      code: ['', [Validators.required, Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.maxLength(30)]],
    });
  }

  saveUnit() {
    if(this.uSaveButton == true) {
    var obj = {
      createUserId: this.user.userId,
      code: this.mstrUnits.get('code').value.trim(),
      name: this.mstrUnits.get('name').value.trim(),
      autoId: this.mstrUnits.get('autoId').value,
    };

    this.saveobj = Object.assign({}, obj);
    // console.log(this.saveobj);
    this.masterService.editUnits(this.saveobj).subscribe(
      (result) => {
        if (result == 1) {
          this.toastr.success('Unit save Successfully !!!');
          this.loadUnits();
          this.clearControls();
        } else if (result == 2) {
          this.toastr.success('Unit update Successfully !!!');
          this.loadUnits();
          this.clearControls();
        } else if (result == -1) {
          this.toastr.warning('Unit already exists !!!');
        } else if (result == -2) {
          this.toastr.warning('Unit edit fail, already in use  !!!');
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

  onEdit(event, cellId) {
    //console.log(cellId.rowID);
    const ids = cellId.rowID;
    const selectedRowData = this.unitGrid.data.filter((record) => {
      return record.autoId == ids;
    });

    //console.log(selectedRowData);
    this.mstrUnits.get('name').setValue(selectedRowData[0]['name']);
    this.mstrUnits.get('autoId').setValue(selectedRowData[0]['autoId']);
    this.mstrUnits.get('code').setValue(selectedRowData[0]['code']);
    this.mstrUnits.get('code').disable();
  }

  clearControls() {
    //this.masterColor.reset();
    this.mstrUnits.get('autoId').setValue(0);
    this.mstrUnits.get('createUserId').setValue(this.user.userId);
    this.mstrUnits.get('code').setValue('');
    this.mstrUnits.get('name').setValue('');
    this.mstrUnits.get('code').enable();
  }

  resetControls() {
    // this.mstrUnits.reset();
    this.clearControls();
    //this.clearGridRows();
  }
}
