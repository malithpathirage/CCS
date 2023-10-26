import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxComboComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { flatMap } from 'rxjs/operators';
import { UnitConversion } from 'src/app/_models/unitConversion';
import { Units } from 'src/app/_models/units';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-unit-conversion',
  templateUrl: './unit-conversion.component.html',
  styleUrls: ['./unit-conversion.component.css'],
})
export class UnitConversionComponent implements OnInit {
  unitConvForm: FormGroup;
  fromUnitList: Units[];
  toUnitList: Units[];
  unitConvList: UnitConversion[];
  ucSaveButton: boolean = false;
  user: User;
  validationErrors: string[] = [];

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

  @ViewChild('unitConvGrid', { static: true })
  public unitConvGrid: IgxGridComponent;

  @ViewChild('fromUnit', { read: IgxComboComponent })
  public fromUnit: IgxComboComponent;
  @ViewChild('toUnit', { read: IgxComboComponent })
  public toUnit: IgxComboComponent;

  constructor(
    private accountService: AccountService,
    private masterService: MasterService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initilizeForm();
    this.loadUnits();
    this.loadUnitConversion();
  }

  public onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  //// ALOW SINGLE SILECTION ONLY COMBO EVENT
  singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
    }
  }

  loadUnits() {
    this.masterService.getUnits().subscribe((result) => {
      this.fromUnitList = result;
      this.toUnitList = result;
    });
  }

  loadUnitConversion() {
    this.masterService.getUnitConversion().subscribe((result) => {
      this.unitConvList = result;
      console.log(this.unitConvList);
    });
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 102).length > 0) {
        this.ucSaveButton = true;
      }
    }

    this.unitConvForm = this.fb.group(
      {
        autoId: [0],
        createUserId: this.user.userId,
        fromUnit: ['', [Validators.required]],
        toUnit: ['', [Validators.required]],
        value: [0, Validators.required],
      },
      { validators: this.unitCompaire('fromUnit', 'toUnit') }
    );
  }

  /// compaire unit from and to
  unitCompaire(from: string, to: string) {
    return (group: FormGroup): { [key: string]: any } => {
      let f = group.controls[from];
      let t = group.controls[to];
      // console.log(f.value[0]);
      // console.log(t.value[0]);

      if (f.value[0] != undefined && t.value[0] != undefined) {
        if (f.value[0] == t.value[0]) {
          return {
            invalid: 'Unit can not be same',
          };
        }
      }
      return {};
    };
  }

  saveUnit() {
    if(this.ucSaveButton == true) {
    var obj = {
      createUserId: this.user.userId,
      fromUnitId: this.unitConvForm.get('fromUnit').value[0],
      toUnitId: this.unitConvForm.get('toUnit').value[0],
      autoId: this.unitConvForm.get('autoId').value,
      value: this.unitConvForm.get('value').value,
    };

    // this.saveobj = Object.assign({}, obj);
    //console.log(this.saveobj);
    this.masterService.saveUnitConversion(obj).subscribe(
      (result) => {
        if (result == 1) {
          this.toastr.success('Unit Conversion save Successfully !!!');
          this.loadUnitConversion();
          this.clearControls();
        } else if (result == 2) {
          this.toastr.success('Unit Conversion update Successfully !!!');
          this.loadUnitConversion();
          this.clearControls();
        } else if (result == -1) {
          this.toastr.warning('Unit Conversion already exists !!!');
        } else if (result == -2) {
          this.toastr.warning('Conversion edit fail, already in use !!!');
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
    this.clearControls();
    //console.log(cellId.rowID);
    const ids = cellId.rowID;
    const selectedRowData = this.unitConvGrid.data.filter((record) => {
      return record.autoId == ids;
    });

    this.unitConvForm.get('autoId').setValue(selectedRowData[0]['autoId']);
    this.fromUnit.setSelectedItem(selectedRowData[0]['fromUnitId'], true);
    this.toUnit.setSelectedItem(selectedRowData[0]['toUnitId'], true);
    this.unitConvForm.get('value').setValue(selectedRowData[0]['value']);
    this.unitConvForm.get('fromUnit').disable();
    this.unitConvForm.get('toUnit').disable();
  }

  clearControls() {
    this.unitConvForm.get('autoId').setValue(0);
    this.unitConvForm.get('fromUnit').setValue('');
    this.unitConvForm.get('toUnit').setValue('');
    this.unitConvForm.get('value').setValue(0);
    this.unitConvForm.get('fromUnit').enable();
    this.unitConvForm.get('toUnit').enable();
  }

  resetControls() { 
    this.clearControls();   
    this.loadUnits();
  }
}
