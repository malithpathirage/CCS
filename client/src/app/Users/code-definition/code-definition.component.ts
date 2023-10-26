import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxCheckboxComponent, IgxColumnComponent, IgxComboComponent, IgxDialogComponent, IgxGridComponent, IgxRadioGroupDirective } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/_models/category';
import { CodeDefinition } from 'src/app/_models/codeDefinition';
import { ProductGroup } from 'src/app/_models/productGroup';
import { ProductType } from 'src/app/_models/productType';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { AdminService } from '_services/admin.service';
import { MasterService } from '_services/master.service';
import { RegisterService } from '_services/register.service';

@Component({
  selector: 'app-code-definition',
  templateUrl: './code-definition.component.html',
  styleUrls: ['./code-definition.component.css'],
})
export class CodeDefinitionComponent implements OnInit {
  codeDefForm: FormGroup;
  validationErrors: string[] = [];
  categoryList: Category[];
  prodTypeList: ProductType[];
  prodGroupList: ProductGroup[];
  codeDefList: CodeDefinition[];
  fieldList: any[];
  isProdChecked: boolean = false;
  rowId: number = 0;
  saveButton: boolean = false;
  removeButton: boolean = false;

  flexFieldList: any[];
  user: User;

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

  @ViewChild('codeDefGrid', { static: true })
  public codeDefGrid: IgxGridComponent;

  @ViewChild('category', { read: IgxComboComponent })
  public category: IgxComboComponent;
  @ViewChild('prodType', { read: IgxComboComponent })
  public prodType: IgxComboComponent;
  @ViewChild('prodGroup', { read: IgxComboComponent })
  public prodGroup: IgxComboComponent;
  @ViewChild('cmbFieldName', { read: IgxComboComponent })
  public cmbFieldName: IgxComboComponent;

  @ViewChild('chkIsProdField', { read: IgxCheckboxComponent })
  public chkIsProdField: IgxCheckboxComponent;
  @ViewChild('chkIsSeperator', { read: IgxCheckboxComponent })
  public chkIsSeperator: IgxCheckboxComponent;
  @ViewChild('chkIsCounter', { read: IgxCheckboxComponent })
  public chkIsCounter: IgxCheckboxComponent;
  @ViewChild('chkIsValue', { read: IgxCheckboxComponent })
  public chkIsValue: IgxCheckboxComponent;

  @ViewChild('dialog', { read: IgxDialogComponent })
  public dialog: IgxDialogComponent;

  // @ViewChild('numbering', { read: IgxRadioGroupDirective })
  // public numbering: IgxRadioGroupDirective;

  constructor(
    public registerService: RegisterService,
    private fb: FormBuilder,
    private accountService: AccountService,
    public adminService: AdminService,
    public masterService: MasterService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initilizeForm();
    this.loadCategory();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 93).length > 0) {
        this.saveButton = true;
      }
      if (authMenus.filter((x) => x.autoIdx == 94).length > 0) {
        this.removeButton = true;
      }
    }

    this.codeDefForm = this.fb.group(
      {
        autoId: [0],
        category: ['', Validators.required],
        prodType: ['', Validators.required],
        prodGroup: ['', Validators.required],
        isProdField: [''],
        flexField: [''],
        fieldName: [''],
        display: ['c'],
        // numbering: ['v'],
        isCode: [false],
        isName: [true],
        isCounter: [false],
        isValue: [false],
        counterPad: [{ value: 0, disabled: true }],
        counterStart: [{ value: 0, disabled: true }],
        // seqNo: [{value: 0, disabled: true}],
        isSeperator: [''],
        seperator: [{ value: '', disabled: true } , Validators.maxLength(1)],
      },
      { validators: this.checkSeperator('isSeperator', 'seperator') }
    );
  }

  /// VALIDATE SEPERATOR
  checkSeperator(from: string, to: string) {
    return (group: FormGroup): { [key: string]: any } => {
      let f = group.controls[from];
      let t = group.controls[to];
      // console.log(f.value);
      // console.log(t.value);

      if (f.value == true && t.value == '') {
        return {
          invalid: 'Seperator is required',
        };
      }
      return {};
    };
  }

  public onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  public singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
      //console.log(event.newSelection);
    }
  }

  loadCategory() {
    this.masterService.getCategory().subscribe((result) => {
      this.categoryList = result;
    });
  }

  onSelectCategory(event) {
    this.codeDefForm.get('prodType').reset();
    this.codeDefForm.get('prodGroup').reset();
    this.prodTypeList = [];
    this.prodGroupList = [];
    this.codeDefList = [];
    
    for (const item of event.added) {
      this.loadProductType(item);
    }
  }

  loadProductType(catId: number) {
    this.masterService.getProductTypeDetils(catId).subscribe((result) => {
      this.prodTypeList = result;
      //  console.log(this.prodTypeList);
    });
  }

  onSelectProdType(event) {
    this.flexFieldList = [];
    this.fieldList = [];
    this.prodGroupList = [];
    this.codeDefList = [];

    this.codeDefForm.get('prodGroup').reset();

    for (const item of event.added) {
      this.loadProductGroup(item);
      this.loadFlexFields(item);
    }
  }

  loadCodeDefinition(prodGroup) {
    var obj = {
      categoryId: this.codeDefForm.get('category').value[0],
      prodTypeId: this.codeDefForm.get('prodType').value[0],
      prodGroupId: prodGroup,
    };

    this.masterService.getCodeDefinition(obj).subscribe((result) => {
      this.codeDefList = result;
      console.log(this.codeDefList);
    });
  }

  loadProductGroup(typeId: number) {
    this.masterService.getProductGroupDt(typeId).subscribe((result) => {
      this.prodGroupList = result;
    });
    // console.log(this.prodGroupList);
  }

  onSelectProductGroup(event) {
    this.codeDefList = [];
    for (const item of event.added) {
      this.loadCodeDefinition(item);
    }
  }

  ///// LOADS FLEX FIELD BASED ON CATEGORY AND PRODUCT TYPE
  loadFlexFields(item) {
    var obj = {
      categoryId: this.codeDefForm.get('category').value[0],
      prodTypeId: item,
    };

    // console.log(obj);
    this.masterService.getFlexFieldCatPTWise(obj).subscribe((result) => {
      this.flexFieldList = result;
      this.fieldList = this.flexFieldList;
      // console.log(result);
    });
  }

  saveCodeDefinition() {
    if (this.saveButton == true) {
      if (this.validateControls()) {
        // console.log(this.codeDefForm.get('isCounter').value);
        var flexField = 0,
          fieldName = '',
          sortOrder = 0,
          prodGroup = 0;

        sortOrder = this.codeDefGrid.data.length + 1;
        prodGroup = this.codeDefForm.get('prodGroup').value[0];

        if (this.chkIsProdField.checked == true) {
          fieldName = this.cmbFieldName.value;
        } else {
          flexField = this.codeDefForm.get('fieldName').value[0];
          fieldName = this.cmbFieldName.value;
        }

        var obj = {
          autoId: this.codeDefForm.get('autoId').value,
          userId: this.user.userId,
          categoryId: this.codeDefForm.get('category').value[0],
          prodTypeId: this.codeDefForm.get('prodType').value[0],
          prodGroupId: this.codeDefForm.get('prodGroup').value[0],
          sortOrder: sortOrder,
          IsProductField: this.chkIsProdField.checked,
          flexFieldId: flexField,
          fieldName: fieldName,
          isCode: this.codeDefForm.get('display').value == 'c' ? true : false,
          isName: this.codeDefForm.get('display').value == 'n' ? true : false,
          isCounter: this.chkIsCounter.checked,
            // this.codeDefForm.get('numbering').value == 'c' ? true : false,
          isValue: this.chkIsValue.checked,
            // this.codeDefForm.get('numbering').value == 'v' ? true : false,
          counterPad:
            this.codeDefForm.get('counterPad').value == null
              ? 0
              : this.codeDefForm.get('counterPad').value,
          counterStart:
            this.codeDefForm.get('counterStart').value == null
              ? 0
              : this.codeDefForm.get('counterStart').value,
          seqNo:
            this.codeDefForm.get('counterStart').value == null
              ? 0
              : this.codeDefForm.get('counterStart').value,
          isSeperator: this.chkIsSeperator.checked,
          seperator: this.codeDefForm.get('seperator').value,
        };

        // console.log(obj);
        this.masterService.saveCodeDefinition(obj).subscribe(
          (result) => {
            if (result == 1) {
              this.toastr.success('Code Definition save Successfully !!!');
              this.loadCodeDefinition(prodGroup);
              this.clearControls();
            } else if (result == 2) {
              this.toastr.success('Code Definition update Successfully !!!');
              this.loadCodeDefinition(prodGroup);
              this.clearControls();
            } else if (result == -1) {
              this.toastr.warning('Code Definition already exists !!!');
            } else if (result == -2) {
              this.toastr.warning('Update fail, already in use !!!');
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
      this.toastr.error('Save Permission denied !!!');
    }
  }

  validateControls() {
    if (this.chkIsCounter.checked == true) {
      if (
        this.codeDefForm.get('counterPad').value == 0 ||
        this.codeDefForm.get('counterStart').value == null
      ) {
        this.toastr.error('Counter values are required !!!');
        return false;
      }
    }
    return true;
  }

  /// CLEAR CODE DEFINITION
  clearControls() {
    // this.codeDefForm.reset();
    // console.log(this.flexFieldList);
    this.codeDefForm.get('autoId').setValue(0);
    this.codeDefForm.get('isValue').setValue(false);
    this.codeDefForm.get('isCounter').setValue(false);
    this.codeDefForm.get('display').setValue('c');
    this.codeDefForm.get('isProdField').setValue(false);
    this.codeDefForm.get('seperator').setValue('');
    this.codeDefForm.get('counterPad').setValue(0);
    this.codeDefForm.get('counterStart').setValue(0);
    this.codeDefForm.get('isSeperator').setValue(false);
    this.codeDefForm.get('seperator').setValue('');
    this.codeDefForm.get('fieldName').setValue('');

    //// CHECK PRODUCT FIELD OR FLEX FIELD
    if (this.chkIsProdField.checked == true) {
      this.loadProdFields();
    } else {
      this.fieldList = this.flexFieldList;
    }
    // this.codeDefList = [];
    // this.prodGroupList = [];
    // this.prodTypeList = [];
    // this.fieldList = [];
    // this.flexFieldList = [];
  }

  //// EDIT ROW LOADS DETAILS TO CONTROL
  onEditCodeDef(event, cellId) {
    //console.log(cellId.rowID);
    const ids = cellId.rowID;

    const selectedRowData = this.codeDefGrid.data.filter((record) => {
      return record.autoId == ids;
    });

    // console.log(selectedRowData);
    this.codeDefForm.get('autoId').setValue(selectedRowData[0]['autoId']);
    this.codeDefForm
      .get('isProdField')
      .setValue(selectedRowData[0]['isProductField']);
    this.codeDefForm.get('seperator').setValue(selectedRowData[0]['seperator']);

    this.codeDefForm
      .get('counterPad')
      .setValue(selectedRowData[0]['counterPad']);
    this.codeDefForm
      .get('counterStart')
      .setValue(selectedRowData[0]['counterStart']);
    // this.codeDefForm.get('seqNo').setValue(selectedRowData[0]['seqNo']);

    this.codeDefForm
      .get('isSeperator')
      .setValue(selectedRowData[0]['isSeperator']);
    this.codeDefForm.get('seperator').setValue(selectedRowData[0]['seperator']);

    // console.log(this.codeDefForm.get('numbering').value);

    this.codeDefForm
      .get('isCounter')
      .setValue(selectedRowData[0]['isCounter']);
    this.codeDefForm
      .get('isValue')
      .setValue(selectedRowData[0]['isValue']);
    ///// SET COUNTER OR VALUE RADIO BUTTON
    // if (selectedRowData[0]['isCounter'] == true) {
    //   this.codeDefForm.get('numbering').setValue('c');
    // } else {
    //   this.codeDefForm.get('numbering').setValue('v');
    // }

    ///// SET NAME OR CODE RADIO BUTTON
    if (selectedRowData[0]['isCode'] == true) {
      this.codeDefForm.get('display').setValue('c');
    } else {
      this.codeDefForm.get('display').setValue('n');
    }

    //// CHECK PRODUCT FIELD OR FLEX FIELD
    if (selectedRowData[0]['isProductField'] == true) {
      this.loadProdFields();
    } else {
      this.fieldList = this.flexFieldList;
    }

    /// CHECK IS SEPERATOR OR NOT
    if (selectedRowData[0]['isSeperator'] == true) {
      this.codeDefForm.get('seperator').enable();
    } else {
      this.codeDefForm.get('seperator').disable();
    }
    this.setComboValues(selectedRowData[0]['fieldName']);
  }

  /// SET FIELD NAME
  setComboValues(fieldName) {
    setTimeout(() => {
      var selectrow = this.fieldList.filter(
        (x) => x.flexFieldName == fieldName
      );
      this.cmbFieldName.setSelectedItem(selectrow[0]['autoId'], true);
    }, 500);
  }

  //// IS PRODUCT FIELD CHECK BOX CHANGED EVENT
  onChangeProdField(event) {
    // console.log(event);
    this.fieldList = [];
    this.codeDefForm.get('fieldName').setValue('');

    if (event.checked == true) {
      this.loadProdFields();
    } else {
      this.fieldList = this.flexFieldList;
    }
  }

  loadProdFields() {
    var obj = [
      { autoId: 1, flexFieldName: 'Category' },
      { autoId: 2, flexFieldName: 'ProductType' },
      { autoId: 3, flexFieldName: 'ProductGroup' },
    ];

    this.fieldList = obj;
  }

  ///// value radio group checked changed event
  onChangeValue(event) {
    // console.log(event);
    if (event.checked == true) {
      this.codeDefForm.get('counterPad').enable();
      this.codeDefForm.get('counterStart').enable();
      // this.codeDefForm.get("seqNo").enable();
    } else {
      this.codeDefForm.get('counterPad').disable();
      this.codeDefForm.get('counterStart').disable();
      // this.codeDefForm.get("seqNo").disable();
    }
  }

  /// SEPERATOR CHANGE EVENT
  onChangeSeperator(event) {
    if (event.checked == true) {
      this.codeDefForm.get('seperator').enable();
    } else {
      this.codeDefForm.get('seperator').disable();
    }
  }

  openDeleteDialog(event, cellId) {
    this.rowId = cellId.rowID;
    this.dialog.open();
  }

  onDialogOKSelected(event) {
    event.dialog.close();
    if (this.removeButton == true) {      
      // console.log(this.rowId);
      var prodGroup = this.codeDefForm.get('prodGroup').value[0];
      //  this.onItemDelete(event, this.rowId);

      var obj = {
        autoId: this.rowId,
        userId: this.user.userId,
      };

      this.masterService.deleteCodeDefinition(obj).subscribe(
        (result) => {
          if (result == 1) {
            this.toastr.success('Code Definition delete Successfully !!!');
            this.loadCodeDefinition(prodGroup);
            this.clearControls();
          } else if (result == -1) {
            this.toastr.warning('Delete fail, already in use !!!');
          } else {
            this.toastr.warning(
              'Contact Admin. Error No:- ' + result.toString()
            );
          }
        },(error) => {
          this.validationErrors = error;
        }
      );
    } else {
      this.toastr.error('Delete permission denied !!!');
    }
  }

}
