import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxComboComponent, IgxDialogComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { CustomerHd } from 'src/app/_models/customerHd';
import { CustomerLoc } from 'src/app/_models/customerLoc';
import { DispatchProdDt } from 'src/app/_models/dispatchProdDt';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';
import { SalesorderService } from '_services/salesorder.service';
import { DispatchService } from '_services/dispatch.service';
import { EnumType } from 'src/app/_models/enumType';
import { StoreSite } from 'src/app/_models/storeSite';
import { PurchasingService } from '_services/purchasing.service';
import { Color } from 'src/app/_models/color';
import { Size } from 'src/app/_models/size';
import { DispatchNoteDt } from 'src/app/_models/dispatchNoteDt';

@Component({
  selector: 'app-prod-dispatch',
  templateUrl: './prod-dispatch.component.html',
  styleUrls: ['./prod-dispatch.component.css'],
})
export class ProdDispatchComponent implements OnInit {
  dispatchForm: FormGroup;
  qtyEditForm: FormGroup;
  dispatchListForm: FormGroup;
  stockEditForm: FormGroup;

  user: User;
  custometList: CustomerHd[];
  delLocationList: CustomerLoc[];
  pendDispatchList: DispatchProdDt[];
  dispatchList: any[];
  dispSiteList: any[];
  colorList: Color[];
  sizeList: Size[];
  dispatchTypeList: EnumType[];
  storeSiteList: StoreSite[];
  supplierList: any;
  dispatchNoList: any;
  rowId: number = 0;
  dispatchType: number = 0;
  // isGridDisabled: boolean = false;
  isDisplayMode: boolean = false;
  dispatchStatus: string;
  isActive: boolean = false;
  // clickFPODelete: boolean = false;
  cusLocId: number;
  isCustomer: boolean = false;
  isFromSite: boolean = false;
  article: string = '';
  saveButton: boolean = false;
  cancelButton: boolean = false;
  printButton: boolean = false;
  stockList: any = [];
  type: string = '';

  public dispatchInput: Object = null;

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

  @ViewChild('pendDispatchGrid', { read: IgxGridComponent, static: true })
  public pendDispatchGrid: IgxGridComponent;
  @ViewChild('dispatchGrid', { read: IgxGridComponent, static: true })
  public dispatchGrid: IgxGridComponent;
  @ViewChild('dispListGrid', { static: true })
  public dispListGrid: IgxGridComponent;
  @ViewChild('stockGrid', { static: true })
  public stockGrid: IgxGridComponent;

  @ViewChild('dialog', { read: IgxDialogComponent })
  public dialog: IgxDialogComponent;
  @ViewChild('savedialog', { read: IgxDialogComponent })
  public savedialog: IgxDialogComponent;
  @ViewChild('articleDialog', { read: IgxDialogComponent })
  public articleDialog: IgxDialogComponent;

  @ViewChild('customer', { read: IgxComboComponent })
  public customer: IgxComboComponent;
  @ViewChild('cusLoc', { read: IgxComboComponent })
  public cusLoc: IgxComboComponent;
  @ViewChild('fromSite', { read: IgxComboComponent })
  public fromSite: IgxComboComponent;
  @ViewChild('dispatch', { read: IgxComboComponent })
  public dispatch: IgxComboComponent;
  @ViewChild('toSite', { read: IgxComboComponent })
  public toSite: IgxComboComponent;
  @ViewChild('supplier', { read: IgxComboComponent })
  public supplier: IgxComboComponent;
  @ViewChild('cmbcolor', { read: IgxComboComponent })
  public cmbcolor: IgxComboComponent;
  @ViewChild('cmbsize', { read: IgxComboComponent })
  public cmbsize: IgxComboComponent;

  // Date options
  public dateOptions = {
    format: 'yyyy-MM-dd',
    //timezone: 'UTC+0',
  };
  public formatDateOptions = this.dateOptions;

  constructor(
    private accountService: AccountService,
    private masterServices: MasterService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private salesOrderServices: SalesorderService,
    private dispatchService: DispatchService,
    private purchasingService: PurchasingService
  ) {}

  ngOnInit(): void {
    this.initilizeForm();
    this.getDispatchNo(null);
    this.loadCustomer();
    this.loadDispatchSite();
    this.getDispatchType();
    this.setInitialItem();
    this.loadStoreSite();
    this.loadSupplier();
    this.setDipatchTypeValidator();
  }

  setDipatchTypeValidator() {
    const supplierControl = this.dispatchForm.get('supplier');
    const customerControl = this.dispatchForm.get('customer');
    const cusLocControl = this.dispatchForm.get('cusLocation');
    const toSiteControl = this.dispatchForm.get('toSite');

    this.dispatchForm.get('dispatchType').valueChanges.subscribe((value) => {
      if (value[0] == 1) {
        customerControl.setValidators([Validators.required]);
        cusLocControl.setValidators([Validators.required]);
        supplierControl.setValidators(null);
        supplierControl.setValue(0);
        toSiteControl.setValidators(null);
        toSiteControl.setValue(0);
      } else if (value[0] == 2 ) {
        toSiteControl.setValidators([Validators.required]);
        customerControl.setValidators(null);
        cusLocControl.setValidators(null);
        supplierControl.setValidators(null);
        customerControl.setValue(0);
        cusLocControl.setValue(0);
        supplierControl.setValue(0);
      } else if ( value == 3) {
        customerControl.setValidators(null);
        cusLocControl.setValidators(null);
        supplierControl.setValidators(null);
        customerControl.setValue(0);
        cusLocControl.setValue(0);
        supplierControl.setValue(0);
        toSiteControl.setValidators(null);
        toSiteControl.setValue(0);
      } else if (value[0] == 4) {
        customerControl.setValidators(null);
        cusLocControl.setValidators(null);
        customerControl.setValue(0);
        cusLocControl.setValue(0);
        toSiteControl.setValidators(null);
        toSiteControl.setValue(0);
        supplierControl.setValidators([Validators.required]);
      }
    });
  }

  setInitialItem(): void {
    setTimeout(() => {
      this.dispatch.setSelectedItem(1, true);
      this.dispatchType = 1;
    }, 1000);
  }

  //// LOADS STORE SITE
  loadStoreSite() {
    this.masterServices.getStoreSite().subscribe((cardList) => {
      this.storeSiteList = cardList;
    });
  }

  initilizeForm() {
    var date: Date = new Date(Date.now());
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 163).length > 0) {
        this.saveButton = true;
      }
      if (authMenus.filter((x) => x.autoIdx == 164).length > 0) {
        this.cancelButton = true;
      }
      if (authMenus.filter((x) => x.autoIdx == 165).length > 0) {
        this.printButton = true;
      }
    }

    this.dispatchForm = this.fb.group({
      autoId: [0],
      userId: this.user.userId,
      dispatchNo: [
        { value: '', disabled: true },
        [Validators.required, Validators.maxLength(30)],
      ],
      customer: [null],
      cusLocation: [null],
      fromSite: [null, Validators.required],
      toSite: [null, Validators.required],
      supplier: [null],
      dispatchType: [null, Validators.required],
      reason: ['', Validators.maxLength(50)],
      vehicleNo: ['', Validators.maxLength(30)],
      transDate: [{ value: date, disabled: true }],
    }, { validators: this.siteCompaire('fromSite', 'toSite') });

    this.qtyEditForm = this.fb.group({
      autoId: [0],
      soItemId: [0],
      soDelivDtId: [0],
      orderRef: [{ value: '', disabled: true }],
      deliveryRef: [{ value: '', disabled: true }],
      article: [{ value: '', disabled: true }],
      color: [{ value: '', disabled: true }],
      size: [{ value: '', disabled: true }],
      prodQty: [{ value: 0, disabled: true }],
      balQty: [{ value: 0, disabled: true }],
      lastDispQty: [{ value: 0, disabled: true }],
      dispatchQty: [0, Validators.required],
    });

    this.stockEditForm = this.fb.group({
      stockId: [0],
      starticle: [{ value: '', disabled: true }],
      stcolor: [{ value: 0, disabled: true }],
      stsize: [{ value: 0, disabled: true }],
      grnId: [0],
      grnNo: [{ value: '', disabled: true }],
      grnDate: [{ value: '', disabled: true }],
      mrId: [0],
      price: [0],
      grnDetailsId: [0],
      mrNo: [{ value: '', disabled: true }],
      indentNo: [{ value: '', disabled: true }],
      // uom: [{ value: '', disabled: true }],
      stockQty: [{ value: 0, disabled: true }],
      transQty: [0, Validators.required],
      // transuom: [0, Validators.required],
    });

    this.dispatchListForm = this.fb.group({
      customerPO: ['', [Validators.maxLength(15)]],
      dispatchNo: ['', [Validators.maxLength(15)]],
    });
  }

  siteCompaire(from: string, to: string) {
    return (group: FormGroup): { [key: string]: any } => {
      let f = group.controls[from];
      let t = group.controls[to];

      if (f.value != null && t.value != null) {
        if (f.value[0] == t.value[0]) {
          return {
            invalid: 'Site can not be same',
          };
        }
      }
      return {};
    };
  }

  ///// GET DISPATCH NO
  getDispatchNo(item) {
    this.dispatchForm.get('dispatchNo').setValue('');
    if (this.dispatchType == 1) {
      this.salesOrderServices.getRefNumber('DispatchNo').subscribe((result) => {
        this.dispatchForm.get('dispatchNo').setValue(result.refNo.toString());
      });
    } else if (item != null) {
      var obj = {
        siteId: item,
        transType: 'DIS',
        createUserId: this.user.userId,
      };
      this.masterServices.getInventorySerialNo(obj).subscribe((res) => {
        this.dispatchForm.get('dispatchNo').setValue(res.refNo.toString());
      });
    }
  }

  loadSupplier() {
    this.purchasingService.getSupplier().subscribe((result) => {
      this.supplierList = result;
    });
  }

  //// GET CUSTOMER LIST REALTED TO THE LOGGING LOACTION
  loadCustomer() {
    var locationId = this.user.locationId;
    this.masterServices.getCustomer(locationId).subscribe((result) => {
      this.custometList = result.filter((x) => x.bActive == true);
    });
  }

  loadDispatchSite() {
    this.masterServices.getDispatchSite().subscribe((result) => {
      this.dispSiteList = result;
    });
  }

  /// LOAD DELIVERY LOCATION
  onCustomerSelect(event) {
    this.isCustomer = false;
    for (const item of event.added) {
      this.isCustomer = true;
      this.masterServices.getCustomerLocation(item).subscribe((result) => {
        this.delLocationList = result;
      });
    }
  }

  /// FROM SITE SELECTED
  onFromSiteSelect(event) {
    this.isFromSite = false;
    
    for (const item of event.added) {
      this.isFromSite = true;
      if (this.dispatchType != 1 && !this.isDisplayMode) {
        this.stockList = [];
        this.clearStockForm();
        this.dispatchInput = { fromSite: 0 };
        this.dispatchForm.get('dispatchNo').setValue('');
        this.getDispatchNo(item);
      }
    }
  }

  clearStockForm() {
    this.stockEditForm.reset();
  }

  singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
    }
  }

  onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  /// DISPATCH NO NO KEY PRESS EVENT
  onKey(event: any) {
    if (event.keyCode != 13) {
      var date: Date = new Date(Date.now());

      this.dispatchForm.get('autoId').reset();
      this.dispatchForm.get('customer').reset();
      this.dispatchForm.get('cusLocation').reset();
      this.dispatchForm.get('fromSite').reset();
      this.dispatchForm.get('reason').reset();
      this.dispatchForm.get('vehicleNo').reset();
      this.dispatchForm.get('transDate').setValue(date);

      this.qtyEditForm.reset();
      this.pendDispatchList = [];
      this.dispatchList = [];
      this.isDisplayMode = false;
      this.isCustomer = false;
      this.isFromSite = false;
      this.isActive = false;
      this.dispatchStatus = '';
      this.enableControls();
    } else {
      this.loadDipatchDetails();
    }
  }

  /// LOADS PENDING DISPATCH DETAILS
  getPendDispatchDetails() {
    if (!this.isDisplayMode && this.validateDispatchControls()) {
      if (this.dispatchType == 1) {
        this.pendDispatchList = [];
        this.dispatchList = [];
        this.qtyEditForm.reset();

        let obj = {
          dispatchSiteId: this.dispatchForm.get('fromSite').value[0],
          customerId: this.dispatchForm.get('customer').value[0],
        };

        this.dispatchService.getPendDispatchDetails(obj).subscribe((result) => {
          this.pendDispatchList = result;
        });
      } else {
        this.articleDialog.open();
        this.dispatchInput = {
          fromSite: this.dispatchForm.get('fromSite').value[0],
        };
      }
    }
  }

  validateDispatchControls() {
    const fromSite = this.dispatchForm.get('fromSite')?.value?.[0] || 0;
    const customer = this.dispatchForm.get('customer')?.value?.[0] || 0;
    if (fromSite == 0) {
      this.toastr.warning('from site is required !!!');
      return false;
    } else if (this.dispatchType == 1 && customer == 0) {
      this.toastr.warning('customer is required !!!');
      return false;
    }
    return true;
  }

  ///// SHOW SELECTED LINE TO EDIT
  onPendingDispatchDown(event, cellId) {
    const ids = cellId.rowID;
    const selectedRowData = this.pendDispatchList.filter((record) => {
      return record.autoId == ids;
    });

    this.qtyEditForm.reset();
    this.qtyEditForm.get('autoId').setValue(selectedRowData[0]['autoId']);
    this.qtyEditForm.get('orderRef').setValue(selectedRowData[0]['orderRef']);
    this.qtyEditForm
      .get('deliveryRef')
      .setValue(selectedRowData[0]['deliveryRef']);
    this.qtyEditForm.get('article').setValue(selectedRowData[0]['articleName']);
    this.qtyEditForm.get('color').setValue(selectedRowData[0]['color']);
    this.qtyEditForm.get('size').setValue(selectedRowData[0]['size']);
    this.qtyEditForm.get('soItemId').setValue(selectedRowData[0]['soItemId']);
    this.qtyEditForm
      .get('soDelivDtId')
      .setValue(selectedRowData[0]['soDelivDtId']);
    this.qtyEditForm.get('prodQty').setValue(selectedRowData[0]['prodQty']);
    this.qtyEditForm.get('balQty').setValue(selectedRowData[0]['balQty']);
    this.qtyEditForm
      .get('lastDispQty')
      .setValue(selectedRowData[0]['dispatchedQty']);
  }

  onDispatchEdit(event, cellId) {
    const ids = cellId.rowID;
    const selectedRowData = this.dispatchList.filter((record) => {
      return record.autoId == ids;
    });

    var balQty =
      selectedRowData[0]['prodQty'] - selectedRowData[0]['lastDispQty'];

    this.qtyEditForm.reset();
    this.qtyEditForm.get('autoId').setValue(selectedRowData[0]['autoId']);
    this.qtyEditForm.get('orderRef').setValue(selectedRowData[0]['orderRef']);
    this.qtyEditForm
      .get('deliveryRef')
      .setValue(selectedRowData[0]['deliveryRef']);
    this.qtyEditForm.get('article').setValue(selectedRowData[0]['articleName']);
    this.qtyEditForm.get('color').setValue(selectedRowData[0]['color']);
    this.qtyEditForm.get('size').setValue(selectedRowData[0]['size']);
    this.qtyEditForm.get('soItemId').setValue(selectedRowData[0]['soItemId']);
    this.qtyEditForm
      .get('soDelivDtId')
      .setValue(selectedRowData[0]['soDelivDtId']);
    this.qtyEditForm.get('prodQty').setValue(selectedRowData[0]['prodQty']);
    this.qtyEditForm.get('balQty').setValue(balQty);
    this.qtyEditForm
      .get('lastDispQty')
      .setValue(selectedRowData[0]['lastDispQty']);
  }

  ////// VALIDATE DISPATCH QTY AND ADD TO DISPATCHED GRID
  addDispatchQtyGrid() {
    var balQty = this.qtyEditForm.get('balQty').value;
    var dispatchQty = this.qtyEditForm.get('dispatchQty').value;

    ///// CHECK DISPATCH QTY IS VALID
    if (balQty < dispatchQty) {
      this.toastr.warning('Invalid Dispatch Qty !!!');
      return;
    } else {
      var autoId = this.qtyEditForm.get('autoId').value;

      var dipatchLine = this.dispatchGrid.data.filter((details) => {
        return details.autoId == autoId;
      });

      var newBalQty = balQty - dispatchQty;

      //// EXISTING LINE UPDATE QTYP
      if (dipatchLine.length > 0) {
        this.pendDispatchGrid.updateCell(true, autoId, 'status');
        this.dispatchGrid.updateCell(dispatchQty, autoId, 'dispatchedQty');
        this.dispatchGrid.updateCell(newBalQty, autoId, 'balQty');
        // return;
      } else {
        this.pendDispatchGrid.updateCell(true, autoId, 'status');
        /// INSERT NEW DISPATCH LINE
        var obj = {
          autoId: autoId,
          orderRef: this.qtyEditForm.get('orderRef').value,
          deliveryRef: this.qtyEditForm.get('deliveryRef').value,
          sOItemId: this.qtyEditForm.get('soItemId').value,
          sODelivDtId: this.qtyEditForm.get('soDelivDtId').value,
          articleName: this.qtyEditForm.get('article').value,
          color: this.qtyEditForm.get('color').value,
          size: this.qtyEditForm.get('size').value,
          prodQty: this.qtyEditForm.get('prodQty').value,
          lastDispQty: this.qtyEditForm.get('lastDispQty').value,
          balQty: newBalQty,
          dispatchedQty: dispatchQty,
        };
        this.dispatchGrid.addRow(obj);
      }
      this.qtyEditForm.reset();
    }
  }

  clearDipatchQtyForm() {
    this.qtyEditForm.reset();
  }

  //// save dialog confirmation to save
  onSaveSelected(event) {
    this.savedialog.close();
    this.saveDispatchNote();
  }

  setDispatchHeader() {
    let DispHeader = {};
    if (this.dispatchType == 1) {
      DispHeader = {
        dispatchNo: this.dispatchForm.get('dispatchNo').value.trim(),
        customerId: this.dispatchForm.get('customer').value[0],
        cusLocationId: this.dispatchForm.get('cusLocation').value[0],
        dispatchSiteId: this.dispatchForm.get('fromSite').value[0],
        reason:
          this.dispatchForm.get('reason').value == undefined
            ? ''
            : this.dispatchForm.get('reason').value.trim(),
        locationId: this.user.locationId,
        vehicleNo: this.dispatchForm.get('vehicleNo').value.trim(),
        createUserId: this.user.userId,
        dispatchType: this.dispatchType,
      };
    } else if (this.dispatchType == 2 || this.dispatchType == 3) {
      DispHeader = {
        dispatchNo: this.dispatchForm.get('dispatchNo').value.trim(),
        dispatchSiteId: this.dispatchForm.get('fromSite').value[0],
        toSiteId: this.dispatchForm.get('toSite').value[0],
        reason:
          this.dispatchForm.get('reason').value == undefined
            ? ''
            : this.dispatchForm.get('reason').value.trim(),
        createUserId: this.user.userId,
        dispatchType: this.dispatchType,
      };
    } else if (this.dispatchType == 3) {
      DispHeader = {
        dispatchNo: this.dispatchForm.get('dispatchNo').value.trim(),
        dispatchSiteId: this.dispatchForm.get('fromSite').value[0],
        toSiteId: 0,
        reason:
          this.dispatchForm.get('reason').value == undefined
            ? ''
            : this.dispatchForm.get('reason').value.trim(),
        createUserId: this.user.userId,
        dispatchType: this.dispatchType,
      };
    } else if (this.dispatchType == 4) {
      DispHeader = {
        dispatchNo: this.dispatchForm.get('dispatchNo').value.trim(),
        dispatchSiteId: this.dispatchForm.get('fromSite').value[0],
        supplierId: this.dispatchForm.get('supplier').value[0],
        reason:
          this.dispatchForm.get('reason').value == undefined
            ? ''
            : this.dispatchForm.get('reason').value.trim(),
        createUserId: this.user.userId,
        dispatchType: this.dispatchType,
      };
    }
    return DispHeader;
  }

  setDispatchDetails() {
    let dispatchList = [];
    if (this.dispatchType == 1) {
      var itemRows = this.dispatchGrid.data;
      itemRows.forEach((items) => {
        var itemdata = {
          soItemId: items.sOItemId,
          soDelivDtId: items.sODelivDtId,
          producedQty: items.prodQty,
          dispatchedQty: items.dispatchedQty,
          balDispatchQty: items.balQty,
        };
        dispatchList.push(itemdata);
      });
    } else {
      var itemRows = this.stockGrid.data;
      itemRows.forEach((items) => {
        var itemdata = {
          soItemId: null,
          soDelivDtId: null,
          grnHeaderId: items.grnHeaderId,
          grnDetailsId: items.grnDetailsId,
          producedQty: items.stockQty,
          dispatchedQty: items.transferQty,
          balDispatchQty: items.stockQty - items.transferQty,
          stockId: items.stockId,
          price: items.price,
        };
        dispatchList.push(itemdata);
      });
    }
    return dispatchList;
  }

  /////// SAVE DISPATCH NOTE
  saveDispatchNote() {
    if (this.saveButton == true) {
      //// CHECK DISPATCH DETAILS IS EXISTS
      if (!this.isDisplayMode) {
        if (this.validateGrid()) {
          const dispatchList = {
            DispatchHeader: this.setDispatchHeader(),
            DispatchDetails: this.setDispatchDetails(),
          };
          this.dispatchService
            .saveDispatchDetails(dispatchList)
            .subscribe((result) => {
              if (result['result'] == 1) {
                this.toastr.success('Dispatch save Successfully !!!');
                this.pendDispatchList = [];
                this.dispatchForm.get('autoId').setValue(result['refNumId']);
                this.dispatchForm.get('dispatchNo').setValue(result['refNum']);
                this.loadDipatchDetails();
              } else {
                this.toastr.warning(
                  'Contact Admin. Error No:- ' + result['result'].toString()
                );
              }
            });
        }
      } else {
        this.toastr.warning('Dispatch Note already Saved !!!');
      }
    } else {
      this.toastr.error('Save Permission denied !!!');
    }
  }

  validateGrid() {
    if (this.dispatchType == 1) {
      if (this.dispatchGrid.dataLength == 0) {
        this.toastr.warning('Dispatch details is required !!!');
        return false;
      }
    } else if (this.stockGrid.dataLength == 0) {
      this.toastr.warning('Dispatch details is required !!!');
      return false;
    }
    return true;
  }

  cancelDispatchNote() {
    if (this.cancelButton == true) {
      if (this.dispatchForm.get('autoId').value > 0) {
        var obj = {
          autoId: this.dispatchForm.get('autoId').value,
          createUserId: this.user.userId,
        };

        this.dispatchService.cancelDispatchDetails(obj).subscribe((result) => {
          if (result == 1) {
            this.isActive = false;
            this.dispatchStatus = 'Cancel Note';
            this.toastr.success('Dispatch Note Cancel Successfully !!!');
          } else if (result == 2) {
            this.toastr.error('Already Invoiced !!!!');
          } else {
            this.toastr.error('Contact Admin. Error No:- ' + result.toString());
          }
        });
      }
    } else {
      this.toastr.error('Cancel Permission denied !!!');
    }
  }

  refreshControls() {
    this.clearDispatchForm();
    this.clearStockForm();
    this.qtyEditForm.reset();
    this.pendDispatchList = [];
    this.stockList = [];
    this.dispatchList = [];
    this.isDisplayMode = false;
    this.isCustomer = false;
    this.isFromSite = false;
    this.isActive = false;
    this.dispatchStatus = '';
    this.enableControls();
    this.getDispatchNo(null);
  }

  clearDispatchForm() {
    var date: Date = new Date(Date.now());

    this.dispatchForm.get('autoId').reset();
    this.dispatchForm.get('customer').reset();
    this.dispatchForm.get('cusLocation').reset();
    this.dispatchForm.get('fromSite').reset();
    this.dispatchForm.get('reason').reset();
    this.dispatchForm.get('vehicleNo').reset();
    this.dispatchForm.get('transDate').setValue(date);
    this.dispatchForm.get('toSite').reset();
    this.dispatchForm.get('supplier').reset();
  }

  /// LOADS DISPATCH NOTE DETAILS
  loadDipatchDetails() {
    this.isDisplayMode = true;

    let obj = {
      dispatchNo: this.dispatchForm.get('dispatchNo').value.trim(),
      dispatchType: this.dispatchType,
    };

    this.dispatchService.getDispatchDetails(obj).subscribe(
      (result) => {
        if (result.length > 0) {
          ////------=========== LOADS HEADER ===========-------------------
          var transDate: Date = new Date(
            this.datePipe.transform(result[0]['transDate'], 'yyyy-MM-dd')
          );
          if (result[0]['isActive'] == false) {
            this.isActive = false;
            this.dispatchStatus = 'Cancel Note';
          } else {
            this.isActive = true;
            this.dispatchStatus = 'Active Note';
          }

          this.dispatchForm.get('autoId').setValue(result[0]['autoId']);
          this.fromSite.setSelectedItem(result[0]['dispatchSiteId']);
          this.dispatchForm.get('reason').setValue(result[0]['reason']);
          this.dispatchForm.get('transDate').setValue(transDate);

          if (this.dispatchType == 1) {
            this.setDispatchSalesDetails(result);
          } else {
            this.setDispatchStockDetails(result);
          }
        }
      },
      (err) => console.error(err),
      () => {
        if (this.dispatchType == 1) {
          this.setComboValues();
        }        
        this.disableControls();
      }
    );
  }

  setDispatchSalesDetails(result: DispatchNoteDt[]) {
    let dispatchDt = [];
    this.cusLocId = result[0]['cusLocationId'];
    this.customer.setSelectedItem(result[0]['customerId']);
    this.cusLoc.setSelectedItem(result[0]['cusLocationId']);
    this.dispatchForm.get('vehicleNo').setValue(result[0]['vehicleNo']);

    for (let index = 0; index < result.length; index++) {
      var obj = {
        autoId: result[index]['soDelivDtId'],
        orderRef: result[index]['orderRef'],
        deliveryRef: result[index]['deliveryRef'],
        sOItemId: result[index]['soItemId'],
        sODelivDtId: result[index]['soDelivDtId'],
        articleName: result[index]['articleName'],
        color: result[index]['color'],
        size: result[index]['size'],
        prodQty: result[index]['producedQty'],
        lastDispQty: 0,
        balQty: result[index]['balDispatchQty'],
        dispatchedQty: result[index]['dispatchedQty'],
      };
      dispatchDt.push(obj);
    }
    this.dispatchList = dispatchDt;
  }

  setDispatchStockDetails(result: DispatchNoteDt[]) {
    let stockDT = [];

    if (this.dispatchType == 2 ) {
      this.toSite.setSelectedItem(result[0]['toSiteId']);
    } else if (this.dispatchType == 4 )  {
      this.supplier.setSelectedItem(result[0]['supplierId']);
    }
    
    this.dispatchForm.get('dispatchNo').setValue(result[0]['dispatchNo']);
    for (let index = 0; index < result.length; index++) {
      var obj = {
        stockId: result[index]['stockId'],
        grnNo: result[index]['grnNo'],
        grnDate: result[index]['grnDate'],
        indentNo: result[index]['indentNo'],
        mrNo: result[index]['mrNo'],
        articleName: result[index]['articleName'],
        color: result[index]['color'],
        size: result[index]['size'],
        grnDetailsId: result[index]['grnDetailsId'],
        grnHeaderId: result[index]['grnHeaderId'],
        price: result[index]['price'],
        transferQty: result[index]['dispatchedQty'],
        stockQty: result[index]['producedQty'],
      };
      stockDT.push(obj);
    }
    this.stockList = stockDT;
  }

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  setComboValues() {
    setTimeout(() => {
      this.cusLoc.setSelectedItem(this.cusLocId, true);
      this.cusLoc.disabled = true;
    }, 1000);
  }

  /// PROD DISPATCH CONFIRMATION DIALOG
  openConfirmDialog(event, cellId) {
    this.rowId = cellId.rowID;
    this.type = 'Dispatch';
    this.dialog.open();
  }

  disableControls() {
    this.dispatch.disabled = true;
    this.fromSite.disabled = true;
    this.dispatchForm.get('reason').disable();
    if (this.dispatchType == 1) {
      this.cusLoc.disabled = true;
      this.customer.disabled = true;
      this.fromSite.disabled = true;
    } else if (this.dispatchType == 4) {
      this.supplier.disabled = true;
    } else if ( this.dispatchType == 2) {
      this.toSite.disabled = true;
    }
  }

  enableControls() {
    this.dispatch.disabled = false;
    this.fromSite.disabled = false;
    this.dispatchForm.get('reason').enable();
    if (this.dispatchType == 1) {
      this.cusLoc.disabled = false;
      this.customer.disabled = false;
      this.fromSite.disabled = false;
    } else if (this.dispatchType == 4) {
      this.supplier.disabled = false;
    } else if ( this.dispatchType == 2) {
      this.toSite.disabled = false;
    }
  }

  //// DELETE DISPATCH LINE
  public onDialogOKSelected(event) {
    event.dialog.close();

    if (this.rowId > 0) {
      if (this.type == 'Dispatch') {
        /// ADJUST THE PENDING DISPATCH STATUS
        this.pendDispatchGrid.updateCell(false, this.rowId, 'status');
        //// DELETE DISPATCH ITEM
        this.dispatchGrid.deleteRow(this.rowId);
      } else if (this.type == 'Stock') {
        this.stockGrid.deleteRow(this.rowId);
      }
    }
  }

  printDispatchNote() {
    if (this.printButton == true) {
      var obj = {
        dispatchNo: this.dispatchForm.get('dispatchNo').value.trim(),
        reportName: 'DispatchNoteFormat',
      };
      /// STORE OBJECT IN LOCAL STORAGE
      localStorage.setItem('params', JSON.stringify(obj));
      window.open('/boldreport', '_blank');
    } else {
      this.toastr.error('Print Permission denied !!!');
    }
  }

  /// FILER AND GET JOB CARD DETAILS BY CUSTOMER REF
  public filterByCusRef(term) {
    if (term != '') {
      this.dispatchService.getDispatchNoList(term).subscribe((result) => {
        this.dispatchNoList = result.filter(
          (x) => x.dispatchType == this.dispatchType
        );
      });
    }
  }

  /// FILER AND GET JOB CARD DETAILS BY Dispatch NO
  public filterDispatchNo(term) {
    if (term != '') {
      this.dispatchService.getDispatchNoLists(term).subscribe((result) => {
        this.dispatchNoList = result.filter(
          (x) => x.dispatchType == this.dispatchType
        );
      });
    }
  }

  //// CLICK EVENT OF FPO LIST GRID ROW
  onViewDispatchDetails(event, cellId) {
    var date: Date = new Date(Date.now());

    this.dispatchForm.get('autoId').reset();
    this.dispatchForm.get('customer').reset();
    this.dispatchForm.get('cusLocation').reset();
    this.dispatchForm.get('fromSite').reset();
    this.dispatchForm.get('reason').reset();
    this.dispatchForm.get('transDate').setValue(date);

    this.qtyEditForm.reset();
    this.pendDispatchList = [];
    this.dispatchList = [];
    this.isDisplayMode = false;
    this.isCustomer = false;
    this.isFromSite = false;
    this.isActive = false;
    this.dispatchStatus = '';
    this.enableControls();

    var headerId = cellId.rowID;
    const ItemRowData = this.dispListGrid.data.filter((record) => {
      return record.dispatchHdId == headerId;
    });

    this.dispatchForm.get('autoId').setValue(headerId);
    this.dispatchForm.get('dispatchNo').setValue(ItemRowData[0]['dispatchNo']);

    this.loadDipatchDetails();
  }

  getDispatchType() {
    this.masterServices.getEnumType('DispatchType').subscribe((res) => {
      this.dispatchTypeList = res;
      this.dispatch.setSelectedItem(1, true);
    });
  }

  onDispatchTypeSelect(event) {
    this.dispatchType = 0;    
    this.dispatchListForm.reset();
    this.dispatchNoList = [];
    for (const item of event.added) {
      this.dispatchType = item;
      this.dispatchForm.get('fromSite').setValue(null);
      this.getDispatchNo(null);
    }
  }

  getSupplier() {
    this.purchasingService.getSupplier().subscribe((result) => {
      this.supplierList = result;
    });
  }

  addNewArticle(event) {
    this.articleDialog.close();
    const grnDate = this.datePipe.transform(event[0]['grnDate'], 'yyyy-MM-dd');

    this.stockEditForm.get('grnId').setValue(event[0]['grnHeaderId']);
    this.stockEditForm.get('grnDetailsId').setValue(event[0]['grnDetailsId']);
    this.stockEditForm.get('price').setValue(event[0]['price']);
    this.stockEditForm.get('grnNo').setValue(event[0]['grnNo']);
    this.stockEditForm.get('grnDate').setValue(grnDate);
    this.stockEditForm.get('indentNo').setValue(event[0]['indentNo']);
    this.stockEditForm.get('mrNo').setValue(event[0]['mrNo']);
    this.stockEditForm.get('stockId').setValue(event[0]['stockId']);
    this.stockEditForm.get('stockQty').setValue(event[0]['stockQty']);
    this.stockEditForm.get('stcolor').setValue(event[0]['color']);
    this.stockEditForm.get('stsize').setValue(event[0]['size']);
    this.stockEditForm
      .get('starticle')
      .setValue(event[0]['articleName'] + ' - ' + event[0]['stockCode']);
  }

  addStockGrid() {
    const stockQty = this.stockEditForm.get('stockQty').value;
    const transQty = this.stockEditForm.get('transQty').value;
    const stockId = this.stockEditForm.get('stockId').value;

    if (stockQty < transQty) {
      this.toastr.warning('Invalid Quentity');
    } else {
      let stockLine = this.stockGrid.data.filter((details) => {
        return details.stockId == stockId;
      });

      if (stockLine.length > 0) {
        this.pendDispatchGrid.updateCell(transQty, stockId, 'transferQty');
      } else {
        var obj = {
          stockId: stockId,
          grnNo: this.stockEditForm.get('grnNo').value,
          grnDate: this.stockEditForm.get('grnDate').value,
          indentNo: this.stockEditForm.get('indentNo').value,
          mrNo: this.stockEditForm.get('mrNo').value,
          articleName: this.stockEditForm.get('starticle').value,
          color: this.stockEditForm.get('stcolor').value,
          size: this.stockEditForm.get('stsize').value,
          grnDetailsId: this.stockEditForm.get('grnDetailsId').value,
          grnHeaderId: this.stockEditForm.get('grnId').value,
          price: this.stockEditForm.get('price').value,
          transferQty: transQty,
          stockQty: stockQty,
        };
        this.stockGrid.addRow(obj);
      }
      this.stockEditForm.reset();
    }
  }

  onStockEdit(_event, cellId) {
    const ids = cellId.rowID;
    const selectedRowData = this.stockGrid.data.filter((record) => {
      return record.stockId == ids;
    });

    this.stockEditForm.reset();
    this.stockEditForm.get('stockId').setValue(selectedRowData[0]['stockId']);
    this.stockEditForm
      .get('starticle')
      .setValue(selectedRowData[0]['articleName']);
    this.stockEditForm.get('stcolor').setValue(selectedRowData[0]['color']);
    this.stockEditForm.get('stsize').setValue(selectedRowData[0]['size']);
    this.stockEditForm.get('grnNo').setValue(selectedRowData[0]['grnNo']);
    this.stockEditForm.get('grnDate').setValue(selectedRowData[0]['grnDate']);
    this.stockEditForm.get('indentNo').setValue(selectedRowData[0]['indentNo']);
    this.stockEditForm.get('mrNo').setValue(selectedRowData[0]['mrNo']);
    this.stockEditForm.get('stockQty').setValue(selectedRowData[0]['stockQty']);
  }

  /// PROD DISPATCH CONFIRMATION DIALOG
  openStockDialog(_event, cellId) {
    this.rowId = cellId.rowID;
    this.type = 'Stock';
    this.dialog.open();
  }
}
