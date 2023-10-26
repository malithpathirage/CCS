import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxComboComponent, IgxDialogComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { GrnType } from 'src/app/_models/grnType';
import { StoreSite } from 'src/app/_models/storeSite';
import { SupplierHeader } from 'src/app/_models/supplierHeader';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';
import { PurchasingService } from '_services/purchasing.service';
import { SalesorderService } from '_services/salesorder.service';

@Component({
  selector: 'app-grn',
  templateUrl: './grn.component.html',
  styleUrls: ['./grn.component.css'],
})
export class GrnComponent implements OnInit {
  grnHeaderForm: FormGroup;
  grnDetailsForm: FormGroup;
  receivingForm: FormGroup;
  grnListForm: FormGroup;

  saveButton: boolean = false;
  printButton: boolean = false;
  isSite: boolean = false;
  issupplier: boolean = false;
  ginPreviewButton: boolean=false;

  user: User;
  grnTypeList: GrnType[];
  receivingList: any;
  supplierList: SupplierHeader[];
  siteList: StoreSite[];
  grnDetailsList: any;
  grnHeadeList: any;
  isActive: boolean = false;
  isSaved: boolean = true;
  isIsuued: boolean = false;
  rowId: number = 0;

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;
  validationErrors: string[] = [];

  @ViewChild('supplier', { read: IgxComboComponent })
  public supplier: IgxComboComponent;
  @ViewChild('type', { read: IgxComboComponent })
  public type: IgxComboComponent;
  @ViewChild('fromSite', { read: IgxComboComponent })
  public fromSite: IgxComboComponent;
  @ViewChild('receivingSite', { read: IgxComboComponent })
  public receivingSite: IgxComboComponent;
  @ViewChild('searchType', { read: IgxComboComponent })
  public searchType: IgxComboComponent;
  @ViewChild('searchRecSite', { read: IgxComboComponent })
  public searchRecSite: IgxComboComponent;

  @ViewChild('dialog', { read: IgxDialogComponent })
  public dialog: IgxDialogComponent;
  @ViewChild('savedialog', { read: IgxDialogComponent })
  public savedialog: IgxDialogComponent;
  @ViewChild('receivingDialog', { read: IgxDialogComponent })
  public receivingDialog: IgxDialogComponent;

  @ViewChild('grnDetailsGrid', { static: true })
  public grnDetailsGrid: IgxGridComponent;
  @ViewChild('receivingGrid', { static: true })
  public receivingGrid: IgxGridComponent;
  @ViewChild('grnHeaderGrid', { static: true })
  public grnHeaderGrid: IgxGridComponent;

  //// FORMAT PRICE
  public options = {
    digitsInfo: '1.2-2',
    currencyCode: '',
  };
  public formatPrice = this.options;

  // Date options
  public dateOptions = {
    format: 'yyyy-MM-dd',
  };

  public formatDateOptions = this.dateOptions;

  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private purchasingService: PurchasingService,
    private masterServices: MasterService
  ) {}

  ngOnInit() {
    this.initilizeForm();
    this.loadGRNType();
    this.loadSupplier();
    this.loadStoreSite();
  }

  initilizeForm() {
    var date: Date = new Date(Date.now());
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    var authMenus = this.user.permitMenus;
    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 2212).length > 0) {
        this.saveButton = true;
      }
      if (authMenus.filter((x) => x.autoIdx == 2212).length > 0) {
        this.ginPreviewButton = true;
      }
    }

    this.grnHeaderForm = this.fb.group({
      grnHeaderId: [0],
      grnNo: [{ value: '', disabled: true }, [Validators.maxLength(30)]],
      type: [null, Validators.required],
      supplier: [''],
      receivingSite: ['', Validators.required],
      transDate: [{ value: date, disabled: true }],
      fromSite: [''],
      docNo: ['', Validators.required],
      isActive: [false],
    });

    this.grnDetailsForm = this.fb.group({
      grnDetailsId: [0],
      articleId: [0],
      articleName: [{ value: '', disabled: true }],
      articleCode: [{ value: '', disabled: true }],
      colorId: [0],
      sizeId: [0],
      color: [{ value: '', disabled: true }],
      size: [{ value: '', disabled: true }],
      poNo: [{ value: '', disabled: true }],
      storgeUnit: [''],
      uom: [{ value: '', disabled: true }],
      unitPrice: [
        { value: 0, decimalScale: 2, disabled: true },
        Validators.required,
      ],
      poQty: [{ value: 0, disabled: true }],
      prevReceQty: [0],
      receivedQty: [0, Validators.required],
      payableQty: [0, Validators.required],
      focQty: [0],
      rejectQty: [0],
    });

    this.grnListForm = this.fb.group({
      searchType: [null, Validators.required],
      searchSupplier: [''],
      searchRecSite: [''],
      searchFromSite: [''],
    });
  }

  onSiteSelect(event) {
    if (this.receivingSite.disabled == false) {
      this.grnHeaderForm.get('grnNo').setValue('');
      for (const item of event.added) {
        this.getGRNRefNo(item);
      }
    }
  }

  getGRNRefNo(item) {    
    var obj = {
      siteId: item,
      transType: 'GRN',
      createUserId: this.user.userId,
    };
    this.masterServices.getInventorySerialNo(obj).subscribe((res) => {
      this.grnHeaderForm.get('grnNo').setValue(res.refNo.toString());
    });
  }

  loadGRNType() {
    this.masterServices.getGRNType().subscribe(
      (result) => {
        this.grnTypeList = result;
      },
      (err) => console.error(err),
      () => {
        this.setTypeValues();
      }
    );
  }

  setTypeValues() {
    setTimeout(() => {
      this.type.setSelectedItem(1, true);
      this.issupplier = true;
      this.isSite = false;
    }, 1000);
  }

  loadStoreSite() {
    this.masterServices.getStoreSite().subscribe((result) => {
      this.siteList = result;
    });
  }

  loadSupplier() {
    this.purchasingService.getSupplier().subscribe((result) => {
      this.supplierList = result;
    });
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

  onDialogOKSelected(event) {
    this.dialog.close();
    if (this.rowId > 0) {
      this.grnDetailsGrid.deleteRow(this.rowId);
    } else {
      this.cancelGRN();
    }
  }

  onSearchClick() {
    if (this.validatesearchDt()) {
      this.receivingDialog.open();
      this.getGRNReceivingList();
    }
  }

  getGRNReceivingList() {
    var obj = {
      fromSite: this.grnHeaderForm.get('fromSite').value[0],
      receiveSite: this.grnHeaderForm.get('receivingSite').value[0],
      supplier: this.grnHeaderForm.get('supplier').value[0],
    };
    // console.log(obj);
    this.purchasingService.getGRNReceiveList(obj).subscribe((result) => {
      this.receivingList = result;
      // console.log(this.receivingList);
    });
  }

  onSelectSupplier(event) {
    this.grnDetailsList = [];
    this.receivingList = [];
  }

  onSelectFromSite(event) {
    this.grnDetailsList = [];
    this.receivingList = [];
  }

  onTypeSelect(event) {
    this.grnDetailsList = [];

    for (const item of event.added) {
      var type = this.grnTypeList.filter((x) => x.grnTypeId == item);

      if (type[0]['description'].toString().includes('Supplier')) {
        this.issupplier = true;
        this.isSite = false;
      } else if (type[0]['description'].toString().includes('Site')) {
        this.isSite = true;
        this.issupplier = false;
      }
    }
  }

  validatesearchDt() {
    if (this.grnHeaderForm.get('type').value[0] == undefined) {
      this.toastr.warning('type is required !!!');
      return false;
    } else if (this.grnHeaderForm.get('receivingSite').value[0] == undefined) {
      this.toastr.warning('Receiving Site is required !!!');
      return false;
    } else {
      var type = this.grnHeaderForm.get('type').value[0];
      var selType = this.grnTypeList.filter((x) => x.grnTypeId == type);

      if (
        selType[0]['description'].toString().includes('Supplier') &&
        this.grnHeaderForm.get('supplier').value[0] == undefined
      ) {
        this.toastr.warning('supplier is required !!!');
        return false;
      } else if (
        selType[0]['description'].toString().includes('Site') &&
        this.grnHeaderForm.get('fromSite').value[0] == undefined
      ) {
        this.toastr.warning('from site is required !!!');
        return false;
      }
    }
    return true;
  }

  onSelectItem(event, cellId) {
    this.isIsuued = false;
    const poHeaderId = cellId.rowID;

    const selectedRowData = this.receivingGrid.data.filter((record) => {
      return record.poHeaderId == poHeaderId;
    });

    this.purchasingService.getGRNReceiveDetails(poHeaderId).subscribe((result) => {
        var grnDetails = result;
        grnDetails.forEach((item) => {
          /// CHECK ISSUED QTY
          if (item['issuedQty'] > 0) {
            this.isIsuued = true;
          }
          // CHECK SELECTED ITEM ALREADY ADDED OR NOT
          const rowData = this.grnDetailsGrid.data.filter((record) => {
            return record.poDetailsId == item['poDetailsId'];
          });

          if (rowData.length == 0) {
            var obj = {
              grnDetailsId: this.grnDetailsGrid.dataLength + 1,
              poNo: selectedRowData[0]['poNo'],
              poDetailsId: item['poDetailsId'],
              poHeaderId: item['poHeaderId'],
              articleId: item['articleId'],
              colorId: item['colorId'],
              sizeId: item['sizeId'],
              uomId: item['uomId'],
              unitPrice: item['unitPrice'],
              prevReceivedQty: item['prevReceivedQty'],
              receivedQty: item['poQty'] - item['prevReceivedQty'],
              payableQty: item['poQty'] - item['prevReceivedQty'],
              rejectQty: 0,
              returnQty: 0,
              focQty: 0,
              poQty: item['poQty'],
              articleName: item['articleName'] + '-(' + item['stockCode'] + ')',
              color: item['color'],
              size: item['size'],
              unit: item['unit'],
              currencyId: selectedRowData[0]['currencyId'],
              currency: selectedRowData[0]['currency'],
            };

            this.grnDetailsGrid.addRow(obj);
          }
        });
      });
  }

  onDetailsEdit(event, cellId) {
    const grnDetailsId = cellId.rowID;

    const selectedRowData = this.grnDetailsGrid.data.filter((record) => {
      return record.grnDetailsId == grnDetailsId;
    });

    if (selectedRowData.length > 0) {
      this.grnDetailsForm
        .get('articleName')
        .setValue(selectedRowData[0]['articleName']);
      this.grnDetailsForm.get('poNo').setValue(selectedRowData[0]['poNo']);
      this.grnDetailsForm.get('color').setValue(selectedRowData[0]['color']);
      this.grnDetailsForm.get('size').setValue(selectedRowData[0]['size']);
      this.grnDetailsForm.get('uom').setValue(selectedRowData[0]['unit']);
      this.grnDetailsForm
        .get('grnDetailsId')
        .setValue(selectedRowData[0]['grnDetailsId']);
      this.grnDetailsForm.get('poQty').setValue(selectedRowData[0]['poQty']);
      this.grnDetailsForm
        .get('unitPrice')
        .setValue(selectedRowData[0]['unitPrice']);
      this.grnDetailsForm
        .get('articleId')
        .setValue(selectedRowData[0]['articleId']);
      this.grnDetailsForm
        .get('colorId')
        .setValue(selectedRowData[0]['colorId']);
      this.grnDetailsForm.get('sizeId').setValue(selectedRowData[0]['sizeId']);
      this.grnDetailsForm
        .get('rejectQty')
        .setValue(selectedRowData[0]['rejectQty']);
      this.grnDetailsForm
        .get('receivedQty')
        .setValue(selectedRowData[0]['receivedQty']);
      this.grnDetailsForm
        .get('payableQty')
        .setValue(selectedRowData[0]['payableQty']);
      this.grnDetailsForm.get('focQty').setValue(selectedRowData[0]['focQty']);
      this.grnDetailsForm
        .get('prevReceQty')
        .setValue(selectedRowData[0]['prevReceivedQty']);
    }
  }

  clearGRNDetails() {
    this.grnDetailsForm.get('articleName').setValue('');
    this.grnDetailsForm.get('poNo').setValue('');
    this.grnDetailsForm.get('color').setValue('');
    this.grnDetailsForm.get('size').setValue('');
    this.grnDetailsForm.get('uom').setValue('');
    this.grnDetailsForm.get('grnDetailsId').setValue('');
    this.grnDetailsForm.get('poQty').setValue('');
    this.grnDetailsForm.get('unitPrice').setValue('');
    this.grnDetailsForm.get('receivedQty').setValue('');
    this.grnDetailsForm.get('articleId').setValue('');
    this.grnDetailsForm.get('colorId').setValue('');
    this.grnDetailsForm.get('sizeId').setValue('');
    this.grnDetailsForm.get('rejectQty').setValue('');
    this.grnDetailsForm.get('payableQty').setValue('');
    this.grnDetailsForm.get('focQty').setValue('');
    this.grnDetailsForm.get('prevReceQty').setValue('');
  }

  addGRNDetailsRow() {
    var grnDetailsId = this.grnDetailsForm.get('grnDetailsId').value;
    var receivedQty = this.grnDetailsForm.get('receivedQty').value;
    var payableQty = this.grnDetailsForm.get('payableQty').value;
    var focQty = this.grnDetailsForm.get('focQty').value;
    var rejectQty = this.grnDetailsForm.get('rejectQty').value;
    var prevRecQty = this.grnDetailsForm.get('prevReceQty').value;
    var poQty = this.grnDetailsForm.get('poQty').value;
    var balQty = poQty - prevRecQty;

    if (receivedQty <= balQty) {
      const selectedRowData = this.grnDetailsGrid.data.filter((record) => {
        return record.grnDetailsId == grnDetailsId;
      });

      if (selectedRowData.length > 0) {
        this.grnDetailsGrid.updateCell(payableQty, grnDetailsId, 'payableQty');
        this.grnDetailsGrid.updateCell(
          receivedQty,
          grnDetailsId,
          'receivedQty'
        );
        this.grnDetailsGrid.updateCell(focQty, grnDetailsId, 'focQty');
        this.grnDetailsGrid.updateCell(rejectQty, grnDetailsId, 'rejectQty');
      }
      this.clearGRNDetails();
    } else {
      this.toastr.warning('Invalid received Qty !!!');
    }
  }

  onSaveSelected(event) {
    this.savedialog.close();
    if (this.saveButton == true) {
      if (this.validateControls()) {
        this.saveGRN();
      }
    } else {
      this.toastr.warning('Save permission denied !!!');
    }
  }

  saveGRN() {
    var grnDetails = [];

    var grnHeader = {
      grnHeaderId: this.grnHeaderForm.get('grnHeaderId').value,
      grnNo: this.grnHeaderForm.get('grnNo').value,
      grnTypeId: this.grnHeaderForm.get('type').value[0],
      toSiteId: this.grnHeaderForm.get('receivingSite').value[0],
      docNo: this.grnHeaderForm.get('docNo').value,
      fromSiteId:
        this.grnHeaderForm.get('fromSite').value[0] == undefined
          ? 0
          : this.grnHeaderForm.get('fromSite').value[0],
      supplierId:
        this.grnHeaderForm.get('supplier').value[0] == undefined
          ? 0
          : this.grnHeaderForm.get('supplier').value[0],
      createUserId: this.user.userId,
    };

    var detailsRow = this.grnDetailsGrid.data;

    detailsRow.forEach((item) => {
      var details = {
        grnDetailsId: item.grnDetailsId,
        poHeaderId: item.poHeaderId,
        poDetailsId: item.poDetailsId,
        articleId: item.articleId,
        colorId: item.colorId,
        sizeId: item.sizeId,
        uomId: item.uomId,
        poQty: item.poQty,
        poRate: item.unitPrice,
        currencyId: item.currencyId,
        returnedQty: item.returnQty,
        receivedQty: item.receivedQty,
        rejectedQty: item.rejectQty,
        payableQty: item.payableQty,
        focQty: item.focQty,
        issuedQty: 0,
        storageUnitId: item.storageUnit == undefined ? 0 : item.storageUnit,
        unitConvId: item.uomConv == undefined ? 0 : item.uomConv,
      };
      grnDetails.push(details);
    });

    var obj = {
      grnHeader: grnHeader,
      grnDetails: grnDetails,
    };

    // console.log(obj);
    this.purchasingService.saveGRN(obj).subscribe((result) => {
      if (result['result'] == 1) {
        this.toastr.success('GRN save Successfully !!!');
        this.grnHeaderForm.get('grnHeaderId').setValue(result['refNumId']);
        this.grnHeaderForm.get('grnNo').setValue(result['refNum']);
        this.loadGRNDt();
      } else if (result['result'] == -1) {
        this.toastr.success('GRN update Successfully !!!');
        this.grnHeaderForm.get('grnHeaderId').setValue(result['refNumId']);
        this.grnHeaderForm.get('grnNo').setValue(result['refNum']);
        this.loadGRNDt();
      } else {
        this.toastr.warning(
          'Contact Admin. Error No:- ' + result['result'].toString()
        );
      }
    });
  }

  validateControls() {
    if (this.grnDetailsGrid.dataLength > 0) {
      return true;
    }
    this.toastr.warning('GRN Details are required !!!');
    return false;
  }

  onViewPODetails(event, cellId) {
    var headerId = cellId.rowID;
    const ItemRowData = this.grnHeaderGrid.data.filter((record) => {
      return record.grnHeaderId == headerId;
    });

    this.grnHeaderForm.get('grnHeaderId').setValue(headerId);
    this.grnHeaderForm.get('grnNo').setValue(ItemRowData[0]['grnNo']); 

    this.loadGRNDt();
  }

  loadGRNDt() {
    var grnDtList = [];
    var grnHeaderId = this.grnHeaderForm.get('grnHeaderId').value;
    this.clearGRNHeader();
    this.clearGRNDetails();
    this.grnDetailsList = [];

    this.purchasingService.getGRNDetails(grnHeaderId).subscribe((result) => {
      var grnHeader = result.grnHeader[0];
      var transDate: Date = new Date(
        this.datePipe.transform(grnHeader['transDate'], 'yyyy-MM-dd')
      );

      if (grnHeader['fromSiteId'] == 0) {
        this.supplier.setSelectedItem(grnHeader['supplierId'], true);
        this.issupplier = true;
        this.isSite = false;
      } else {
        this.fromSite.setSelectedItem(grnHeader['fromSiteId'], true);
        this.issupplier = false;
        this.isSite = true;
      }
      this.grnHeaderForm.get('grnHeaderId').setValue(grnHeader['grnHeaderId']);
      this.grnHeaderForm.get('grnNo').setValue(grnHeader['grnNo']);
      this.type.setSelectedItem(grnHeader['grnTypeId'], true);
      this.receivingSite.setSelectedItem(grnHeader['toSiteId'], true);
      this.grnHeaderForm.get('docNo').setValue(grnHeader['docNo']);
      this.grnHeaderForm.get('transDate').setValue(transDate);
      this.grnHeaderForm.get('isActive').setValue(grnHeader['isActive']);
      this.isActive = grnHeader['isActive'];

      if (this.isActive) {
        this.isSaved = true;
      } else {
        this.isSaved = false;
      }

      var grnDetails = result.grnDetails;

      if (grnDetails.length > 0) {
        grnDetails.forEach((item) => {
          var obj = {
            grnDetailsId: item['grnDetailsId'],
            poNo: item['poNo'],
            poDetailsId: item['poDetailsId'],
            poHeaderId: item['poHeaderId'],
            articleId: item['articleId'],
            colorId: item['colorId'],
            sizeId: item['sizeId'],
            uomId: item['uomId'],
            unitPrice: item['poRate'],
            prevReceivedQty: item['PreReceivedQty'],
            receivedQty: item['receivedQty'],
            payableQty: item['payableQty'],
            rejectQty: item['rejectedQty'],
            returnQty: item['returnedQty'],
            focQty: item['focQty'],
            poQty: item['poQty'],
            articleName: item['articleName'] + '-(' + item['stockCode'] + ')',
            color: item['color'],
            size: item['size'],
            unit: item['unit'],
            currencyId: item['currencyId'],
            currency: item['currency'],
          };
          grnDtList.push(obj);
        });

        this.grnDetailsList = grnDtList;
      }
      this.disableGRNHeader();
    });
  }

  disableGRNHeader() {
    this.type.disabled = true;
    this.receivingSite.disabled = true;
    if (this.issupplier == true) {
      this.supplier.disabled = true;
    } else {
      this.fromSite.disabled = true;
    }
  }

  enableGRNHeader() {
    this.type.disabled = false;
    this.receivingSite.disabled = false;
    if (this.issupplier == true) {
      this.supplier.disabled = false;
    } else {
      this.fromSite.disabled = false;
    }
  }

  refreshControls() {
    var date: Date = new Date(Date.now());
    this.grnHeaderForm.get('grnHeaderId').setValue(0);
    this.grnHeaderForm.get('type').setValue('');
    this.grnHeaderForm.get('receivingSite').setValue('');
    this.grnHeaderForm.get('fromSite').setValue('');
    this.grnHeaderForm.get('supplier').setValue('');
    this.grnHeaderForm.get('docNo').setValue('');
    this.grnHeaderForm.get('transDate').setValue(date);
    this.isActive = false;
    this.isSaved = true;
    this.isIsuued = false;
    this.enableGRNHeader();
    this.clearGRNDetails();
    this.grnDetailsList = [];
  }

  clearSearchControls() {
    this.grnListForm.get('searchType').setValue('');
    this.grnListForm.get('searchRecSite').setValue('');
    this.grnHeadeList = [];
  }

  clearGRNHeader() {
    var date: Date = new Date(Date.now());
    this.grnHeaderForm.get('grnHeaderId').setValue(0);
    this.grnHeaderForm.get('grnNo').setValue('');
    this.grnHeaderForm.get('type').setValue('');
    this.grnHeaderForm.get('receivingSite').setValue('');
    this.grnHeaderForm.get('fromSite').setValue('');
    this.grnHeaderForm.get('supplier').setValue('');
    this.grnHeaderForm.get('docNo').setValue('');
    this.grnHeaderForm.get('transDate').setValue(date);
    this.isActive = false;
    this.isSaved = true;
  }

  onSearchGRN() {
    var toSiteId =
      this.grnListForm.get('searchRecSite').value == null
        ? ''
        : this.grnListForm.get('searchRecSite').value;

    var obj = {
      grnTypeId:
        this.grnListForm.get('searchType').value[0] == undefined
          ? null
          : this.grnListForm.get('searchType').value[0],
      toSiteId: toSiteId.toString() == '' ? null : toSiteId.toString(),
    };
    this.purchasingService.getGRNHeaderList(obj).subscribe((result) => {
      this.grnHeadeList = result;
    });
  }

  openDeleteDialog(event, cellId) {
    this.rowId = cellId;
    if (this.rowId > 0) {
      this.dialog.open();
    } else if (this.rowId == 0 && this.isIsuued == true) {
      this.dialog.open();
    } else {
      this.toastr.warning('GRN already issued, Delete fail !!!');
    }
  }

  cancelGRN() {
    var obj = {
      grnHeaderId: this.grnHeaderForm.get('grnHeaderId').value,
      createUserId: this.user.userId,
    };

    this.purchasingService.cancelGRN(obj).subscribe((result) => {
      if (result == 1) {
        this.toastr.success('GRN cancel Successfully !!!');
        this.grnHeaderForm.get('isActive').setValue(false);
        this.isActive = false;
        this.isSaved = false;
      } else if (result == -1) {
        this.toastr.warning('Cancel Failed !!!');
      } else {
        this.toastr.warning(
          'Contact Admin. Error No:- ' + result['result'].toString()
        );
      }
    });
  }

  onViewGINetails(event, cellId) {
    var headerId = cellId.rowID;
    const ItemRowData = this.grnHeaderGrid.data.filter((record) => {
      return record.grnHeaderId == headerId;
    });
    var ginNo = (ItemRowData[0]['ginNo']);
    
    if(this.ginPreviewButton == true) {
      
      var obj = {
        referenceNo: ginNo,
        reportName: "GoodsInwardsNoteFormat"
      }
      //console.log(obj);
      /// STORE OBJECT IN LOCAL STORAGE
      localStorage.setItem('params', JSON.stringify(obj));
      window.open('/boldreport', '_blank');
    } else {
      this.toastr.error('Print Permission denied !!!');
    }
  }
}
