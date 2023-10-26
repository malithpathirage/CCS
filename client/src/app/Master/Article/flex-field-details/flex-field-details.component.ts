import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxCheckboxComponent, IgxColumnComponent, IgxComboComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { FlexFieldDetails } from 'src/app/_models/flexFieldDetails';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-flex-field-details',
  templateUrl: './flex-field-details.component.html',
  styleUrls: ['./flex-field-details.component.css'],
})
export class FlexFieldDetailsComponent implements OnInit {
  flexFieldForm: FormGroup;
  categoryList: any[];
  prodTypeList: any[];
  moduleList: any[];
  dataTypeList: any[];
  fdSaveButton: boolean = false;
  fdDisableButton: boolean = false;
  user: User;
  flexFieldDt: FlexFieldDetails[];
  validationErrors: string[] = [];
  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;
  isEditMode: boolean = false;
  isCatSelected: boolean = false;
  formTitle: string = 'New Flex Field';

  @ViewChild('flexFieldGrid', { static: true })
  public flexFieldGrid: IgxGridComponent;

  @ViewChild('category', { read: IgxComboComponent })
  public category: IgxComboComponent;
  @ViewChild('prodType', { read: IgxComboComponent })
  public prodType: IgxComboComponent;
  @ViewChild('module', { read: IgxComboComponent })
  public module: IgxComboComponent;
  @ViewChild('dataType', { read: IgxComboComponent })
  public dataType: IgxComboComponent;

  @ViewChild('chkIsValueList', { read: IgxCheckboxComponent })
  public chkIsValueList: IgxCheckboxComponent;
  @ViewChild('chkMandatory', { read: IgxCheckboxComponent })
  public chkMandatory: IgxCheckboxComponent;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private masterService: MasterService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initilizeForm();
    this.loadCategory();
    this.loadModule();
    this.loadDataType();
    // this.loadFlexFields();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
      //console.log(this.user.userId);
    });
    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 130).length > 0) {
        this.fdSaveButton = true;
      } if (authMenus.filter((x) => x.autoIdx == 146).length > 0) {
        this.fdDisableButton = true;
      }
    }

    this.flexFieldForm = this.fb.group({
      autoId: [0],
      userId: this.user.userId,
      categoryId: ['', Validators.required],
      prodTypeId: ['', Validators.required],
      moduleId: ['', Validators.required],
      flexFieldName: ['', [Validators.required, Validators.maxLength(50)]],
      flexFieldCode: ['', [Validators.required, Validators.maxLength(30)]],
      dataType: ['', Validators.required],
      valueList: [false],
      mandatory: [false],
    });
  }

  //// ALOW SINGLE SILECTION ONLY COMBO EVENT
  singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
    }
  }

  loadCategory() {
    this.masterService.getCategory().subscribe((cat) => {
      this.categoryList = cat;
    });
  }

  loadModule() {
    this.moduleList = [
      { module: 'Inventory', moduleId: 1 },
      { module: 'Costing', moduleId: 2 },
      { module: 'Sales', moduleId: 3 },
      { module: 'Purchase', moduleId: 4 },
    ];
  }

  loadDataType() {
    this.dataTypeList = [
      { type: 'Number', typeId: 'N' },
      { type: 'Boolean', typeId: 'B' },
      { type: 'Text', typeId: 'T' },      
      { type: 'Date', typeId: 'D' },
      { type: 'Decimal', typeId: 'F' }
    ];
  }

  onSelectCategory(event) {
    this.isCatSelected = false;
    for (const item of event.added) {      
      this.isCatSelected = true;
      //// loads product type
      this.masterService.getProductTypeDetils(item).subscribe((prod) => {
        this.prodTypeList = prod;
      });

      this.loadFlexFields(item);
    }
  }

  public onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  ///// LOADS ALL FLEX FIELDS DETAILS
  loadFlexFields(categoryId) {
    
    var flexFieldList = [];
    this.flexFieldDt = [];
    this.masterService.getFlexFieldDetails(categoryId).subscribe((flexList) => {
      flexFieldList = flexList;
    }, (error) => {
      this.validationErrors = error
    } , () => {
      if (flexFieldList.length > 0) {
        for (let index = 0; index < flexFieldList.length; index++) {
          var fieldLine : any = flexFieldList[index];    

          var module = this.moduleList.filter(x => x.moduleId == flexFieldList[index]['moduleId']);
          var dataTypeName = this.dataTypeList.filter(x => x.typeId == flexFieldList[index]['dataType']);

          fieldLine.module = module[0]["module"];
          fieldLine.dataTypeName = dataTypeName[0]["type"];
          // console.log(fieldLine);
        }
        this.flexFieldDt = flexFieldList;
      }
    });
  }

  saveFlexFieldDetails() {
    if(this.fdSaveButton == true) {
    var categoryId =  this.flexFieldForm.get('categoryId').value[0];   
    var obj = {
      createUserId: this.user.userId,
      autoId: this.flexFieldForm.get('autoId').value,
      flexFieldName: this.flexFieldForm.get('flexFieldName').value.trim(),           
      flexFieldCode: this.flexFieldForm.get('flexFieldCode').value.trim(),
      categoryId: categoryId,
      prodTypeId: this.flexFieldForm.get('prodTypeId').value[0],
      moduleId: this.flexFieldForm.get('moduleId').value[0],
      dataType : this.flexFieldForm.get('dataType').value[0],
      valueList: this.chkIsValueList.checked,
      mandatory: this.chkMandatory.checked
    };
    //console.log(obj);

    this.masterService.saveFlexFieldDetails(obj).subscribe(
      (result) => {
        //console.log(result);
        if (result == 1) {
          this.toastr.success('Flex Field save successfully !!!');
          this.loadFlexFields(categoryId);
          this.clearFlexFieldDetails();
        } else if (result == 2) {
          this.toastr.success('Flex Field update successfully !!!');
          this.loadFlexFields(categoryId);
          //this.clearFlexField();
        } else if (result == -1) {
          this.toastr.warning('Flex Field already exists !!!');
        } else {
          this.toastr.error('Contact Admin. Error No:- ' + result.toString());
        }
      },
      (error) => {
        this.validationErrors = error
      }
    );
    } else {
      this.toastr.error('Save Permission denied !!!');
    }
  }

  deactive(cellValue, cellId) {
    const id = cellId.rowID;

    var obj = {
      createUserId: this.user.userId,
      autoId: id,
      isActive: false,
    };
    this.deactiveFlexField(obj, 'Deactive');
  }

  active(cellValue, cellId) {
    const id = cellId.rowID;

    var obj = {
      createUserId: this.user.userId,
      autoId: id,
      isActive: true,
    };
    this.deactiveFlexField(obj, 'Active');
  }

  deactiveFlexField(obj, status) {
    if(this.fdDisableButton == true) {
    // console.log(obj);
    var categoryId =  this.flexFieldForm.get('categoryId').value[0]; 
    this.masterService.deactiveFlexFieldDt(obj).subscribe(
      (result) => {
        if (result == 1) {
          this.toastr.success('Field ' + status + ' Successfully !!!');
          this.loadFlexFields(categoryId);
        } else if (result == 2) {
          this.toastr.success('Field ' + status + ' Successfully !!!');
          this.loadFlexFields(categoryId);
        } else if (result == -1) {
          this.toastr.warning("Can't deactive, Field already assigned !");
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

  clearFlexFieldDetails() {
    this.isEditMode = false;
    this.formTitle = 'New Flex Field';
    // this.flexFieldForm.reset();
    this.flexFieldForm.get('autoId').setValue(0);
    this.flexFieldForm.get('userId').setValue(this.user.userId);

    //// RESET FIELDS
    this.flexFieldForm.get('prodTypeId').reset();
    this.flexFieldForm.get('moduleId').reset();
    this.flexFieldForm.get('flexFieldName').reset();
    this.flexFieldForm.get('flexFieldCode').reset();
    this.flexFieldForm.get('dataType').reset();
    this.flexFieldForm.get('valueList').reset();
    this.flexFieldForm.get('mandatory').reset();

    /// enabled fileds
    this.flexFieldForm.get('flexFieldName').enable();
    this.flexFieldForm.get('flexFieldCode').enable();
    this.flexFieldForm.get('prodTypeId').enable();
    this.flexFieldForm.get('moduleId').enable();  
  }

  onEditFlexFieldDt(event, cellId) {
    this.clearFlexFieldDetails();
    this.isEditMode = true;
    //console.log(this.customerHdGrid.data);

    const ids = cellId.rowID;
    const selectedRowData = this.flexFieldGrid.data.filter((record) => {
      return record.autoId == ids;
    });

    this.formTitle = 'Update Flex Field';
    //console.log(selectedRowData);
    this.flexFieldForm.get('flexFieldName').setValue(selectedRowData[0]['flexFieldName']);
    this.flexFieldForm.get('autoId').setValue(selectedRowData[0]['autoId']);
    this.flexFieldForm.get('flexFieldCode').setValue(selectedRowData[0]['flexFieldCode']);
    this.prodType.setSelectedItem(selectedRowData[0]['prodTypeId'], true);
    this.module.setSelectedItem(selectedRowData[0]['moduleId'], true);
    this.dataType.setSelectedItem(selectedRowData[0]['dataType'], true);
    this.flexFieldForm.get('valueList').setValue(selectedRowData[0]['valueList']);
    this.flexFieldForm.get('mandatory').setValue(selectedRowData[0]['mandatory']);

    /// disabled fileds
    this.flexFieldForm.get('flexFieldName').disable();
    this.flexFieldForm.get('flexFieldCode').disable();
    this.flexFieldForm.get('moduleId').disable();
    this.flexFieldForm.get('prodTypeId').disable();
  }
}
