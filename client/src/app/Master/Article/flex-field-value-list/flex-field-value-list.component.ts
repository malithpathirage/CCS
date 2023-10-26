import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxComboComponent, IgxDialogComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { resourceUsage } from 'node:process';
import { FlexFieldDetails } from 'src/app/_models/flexFieldDetails';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-flex-field-value-list',
  templateUrl: './flex-field-value-list.component.html',
  styleUrls: ['./flex-field-value-list.component.css'],
})
export class FlexFieldValueListComponent implements OnInit {
  flexFieldValForm: FormGroup;
  flexFieldList: any[];
  user: User;
  fvSaveButton: boolean = false;
  fvRemoveButton: boolean = false;
  flexFieldValList: FlexFieldDetails[];
  validationErrors: string[] = [];
  rowId: number = 0;

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

  @ViewChild('flexFieldValGrid', { static: true })
  public flexFieldValGrid: IgxGridComponent;

  @ViewChild('flexFieldDt', { read: IgxComboComponent })
  public flexFieldDt: IgxComboComponent;

  @ViewChild('dialog', { read: IgxDialogComponent })
  public dialog: IgxDialogComponent;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private masterService: MasterService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initilizeForm();
    this.loadFlexFieldList();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
      //console.log(this.user.userId);
    });

    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 131).length > 0) {
        this.fvSaveButton = true;
      }
      if (authMenus.filter((x) => x.autoIdx == 132).length > 0) {
        this.fvRemoveButton = true;
      }
    }

    this.flexFieldValForm = this.fb.group({
      autoId: [0],
      userId: this.user.userId,
      flexFieldId: ['', Validators.required],
      flexFieldValue: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  loadFlexFieldList() {
    this.masterService.getFlexFieldDtList().subscribe((result) => {
      this.flexFieldList = result;
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

  onSelectFlexFieldDt(event) {
    for (const item of event.added) {
      this.loadsFlexFieldValList(item);
    }
  }

  ///LOADS FLEX FIELD VALUE LIST
  loadsFlexFieldValList(flexFldId) {
    this.masterService.getFlexFieldValList(flexFldId).subscribe((result) => {
      this.flexFieldValList = result;
    });
  }

  saveFlexFieldValue() {
    if (this.fvSaveButton == true) {
      var flexFieldId = this.flexFieldValForm.get('flexFieldId').value[0];
      var obj = {
        createUserId: this.user.userId,
        flexFieldId: flexFieldId,
        autoId: this.flexFieldValForm.get('autoId').value,
        flexFeildVlaue: this.flexFieldValForm
          .get('flexFieldValue')
          .value.trim(),
      };
      //console.log(obj);
      this.masterService.saveFlexFieldValList(obj).subscribe(
        (result) => {
          //console.log(result);
          if (result == 1) {
            this.toastr.success('Flex Field ValueList save successfully !!!');
            this.loadsFlexFieldValList(flexFieldId);
            this.clearFlexFieldValue();
          } else if (result == 2) {
            this.toastr.success('Flex Field ValueList update successfully !!!');
            this.loadsFlexFieldValList(flexFieldId);
            this.clearFlexFieldValue();
          } else if (result == -1) {
            this.toastr.warning('Flex Field Value already exists !!!');
          } else if (result == -2) {
            this.toastr.warning('Update fail, value already assigned !!!');
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

  clearFlexFieldValue() {
    this.flexFieldValForm.get('flexFieldValue').reset();
    this.flexFieldValForm.get('autoId').setValue(0);
    this.flexFieldValForm.get('userId').setValue(this.user.userId);
    this.flexFieldValForm.get('flexFieldId').enable();
  }

  onEditFlexFieldValList(event, cellId) {
    this.clearFlexFieldValue();

    const ids = cellId.rowID;
    const selectedRowData = this.flexFieldValGrid.data.filter((record) => {
      return record.autoId == ids;
    });

    this.flexFieldValForm
      .get('flexFieldValue')
      .setValue(selectedRowData[0]['flexFeildVlaue']);
    this.flexFieldValForm.get('autoId').setValue(selectedRowData[0]['autoId']);
    this.flexFieldValForm.get('flexFieldId').disable();
  }

  openConfirmDialog(event, cellId) {
    this.rowId = cellId.rowID;
    //console.log(cellId);
    this.dialog.open();
  }

  //// DELETE FLEX FIELD VALUE
  public onDialogOKSelected(event) {
    event.dialog.close();
    if (this.fvRemoveButton == true) {
      var flexFieldId = this.flexFieldValForm.get('flexFieldId').value[0];      
      //console.log(this.rowId);

      if (this.rowId > 0) {
        var obj = {
          createUserId: this.user.userId,
          autoId: this.rowId,
        };

        this.masterService.deleteFlexFieldValList(obj).subscribe(
          (result) => {
            //console.log(result);
            if (result == 1) {
              this.toastr.success(
                'Flex Field ValueList Delete successfully !!!'
              );
              this.loadsFlexFieldValList(flexFieldId);
              this.clearFlexFieldValue();
            } else if (result == -1) {
              this.toastr.warning('Delete fail, Value already assigned !!!');
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
      }
    } else {
      this.toastr.error('Delete Permission denied !!!');
    }
  }
}
