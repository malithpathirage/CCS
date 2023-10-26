import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Address } from 'cluster';
import { DefaultSortingStrategy, IComboSelectionChangeEventArgs, IgxColumnComponent, IgxComboComponent, IgxDialogComponent, IgxGridComponent, ISortingExpression, SortingDirection } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { AdditionalCharges } from 'src/app/_models/additionalCharges';
import { Basis } from 'src/app/_models/basis';
import { Category } from 'src/app/_models/category';
import { Company } from 'src/app/_models/company';
import { Countries } from 'src/app/_models/countries';
import { Currency } from 'src/app/_models/currency';
import { DeliveryTerms } from 'src/app/_models/deliveryTerms';
import { EnumType } from 'src/app/_models/EnumType';
import { Forwarder } from 'src/app/_models/forwarder';
import { PaymentTerm } from 'src/app/_models/paymentTerm';
import { POStatus, SelectType } from 'src/app/_models/POHeader';
import { Ports } from 'src/app/_models/ports';
import { PurchaseOrderType } from 'src/app/_models/purchaseOrderType';
import { ShipmentModes } from 'src/app/_models/shipmentModes';
import { SupplierHeader } from 'src/app/_models/supplierHeader';
import { Tax } from 'src/app/_models/tax';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { FinanceService } from '_services/finance.service';
import { MasterService } from '_services/master.service';
import { PurchasingService } from '_services/purchasing.service';
import { SalesorderService } from '_services/salesorder.service';

@Component({
  selector: 'app-purchasing-order',
  templateUrl: './purchasing-order.component.html',
  styleUrls: ['./purchasing-order.component.css'],
})
export class PurchasingOrderComponent implements OnInit {
  poHeaderForm: FormGroup;
  poDetailsForm: FormGroup;
  articleForm: FormGroup;
  mrListForm: FormGroup;
  approveForm: FormGroup;
  addChargeForm: FormGroup;
  poListForm: FormGroup;
  confirmForm: FormGroup;
  reopenForm: FormGroup;

  user: User;
  companyList: Company[];
  categoryList: Category[];
  statusList: POStatus;
  fowardingList: Forwarder[];
  poTypeList: PurchaseOrderType[];
  poTaxList: Tax[];
  supplierList: SupplierHeader[];
  portOfLoadList: Ports[];
  portOfDischList: Ports[];
  countryList: Countries[];
  currencyList: Currency[];
  paymentTermList: PaymentTerm[];
  deliveryTermList: DeliveryTerms[];
  shipmentModeList: ShipmentModes[];
  addressList: Address[];
  pendIndentList: any;
  purchDetailsList: any;
  addChargeList: AdditionalCharges[];
  purAddChargeList: any;
  purchaseOrderList: any;
  poHeadeList: any;
  approveRoteList: any;
  indentList: any;
  selectTypeList: EnumType[];
  basisList: Basis[];

  @ViewChild('category', { read: IgxComboComponent })
  public category: IgxComboComponent;
  @ViewChild('poType', { read: IgxComboComponent })
  public poType: IgxComboComponent;
  @ViewChild('poTax', { read: IgxComboComponent })
  public poTax: IgxComboComponent;
  @ViewChild('supplier', { read: IgxComboComponent })
  public supplier: IgxComboComponent;
  @ViewChild('portOfLoad', { read: IgxComboComponent })
  public portOfLoad: IgxComboComponent;
  @ViewChild('portOfDisch', { read: IgxComboComponent })
  public portOfDisch: IgxComboComponent;
  @ViewChild('countryOfOrign', { read: IgxComboComponent })
  public countryOfOrign: IgxComboComponent;
  @ViewChild('countryOfCon', { read: IgxComboComponent })
  public countryOfCon: IgxComboComponent;
  @ViewChild('countryOfFinalDes', { read: IgxComboComponent })
  public countryOfFinalDes: IgxComboComponent;
  @ViewChild('forwardingAgent', { read: IgxComboComponent })
  public forwardingAgent: IgxComboComponent;
  @ViewChild('paymentTerm', { read: IgxComboComponent })
  public paymentTerm: IgxComboComponent;
  @ViewChild('shipmentMode', { read: IgxComboComponent })
  public shipmentMode: IgxComboComponent;
  @ViewChild('deliveryTerm', { read: IgxComboComponent })
  public deliveryTerm: IgxComboComponent;
  @ViewChild('company', { read: IgxComboComponent })
  public company: IgxComboComponent;
  @ViewChild('currency', { read: IgxComboComponent })
  public currency: IgxComboComponent;
  @ViewChild('billTo', { read: IgxComboComponent })
  public billTo: IgxComboComponent;
  @ViewChild('shipTo', { read: IgxComboComponent })
  public shipTo: IgxComboComponent;
  @ViewChild('notifyTo', { read: IgxComboComponent })
  public notifyTo: IgxComboComponent;
  @ViewChild('addCharges', { read: IgxComboComponent })
  public addCharges: IgxComboComponent;
  @ViewChild('consigne', { read: IgxComboComponent })
  public consigne: IgxComboComponent;
  @ViewChild('approver', { read: IgxComboComponent })
  public approver: IgxComboComponent;
  @ViewChild('searchSup', { read: IgxComboComponent })
  public searchSup: IgxComboComponent;
  @ViewChild('searchCat', { read: IgxComboComponent })
  public searchCat: IgxComboComponent;
  @ViewChild('selectType', { read: IgxComboComponent })
  public selectType: IgxComboComponent;
  @ViewChild('basis', { read: IgxComboComponent })
  public basis: IgxComboComponent;

  @ViewChild('articleDialog', { read: IgxDialogComponent })
  public articleDialog: IgxDialogComponent;
  @ViewChild('indentDialog', { read: IgxDialogComponent })
  public indentDialog: IgxDialogComponent;
  @ViewChild('dialog', { read: IgxDialogComponent })
  public dialog: IgxDialogComponent;
  @ViewChild('savedialog', { read: IgxDialogComponent })
  public savedialog: IgxDialogComponent;
  @ViewChild('approveModal', { read: IgxDialogComponent })
  public approveModal: IgxDialogComponent;
  @ViewChild('reopendialog', { read: IgxDialogComponent })
  public reopendialog: IgxDialogComponent;

  @ViewChild('pendIndentGrid', { static: true })
  public pendIndentGrid: IgxGridComponent;
  @ViewChild('purDetailsGrid', { static: true })
  public purDetailsGrid: IgxGridComponent;
  @ViewChild('addChargeGrid', { static: true })
  public addChargeGrid: IgxGridComponent;
  @ViewChild('poListGrid', { static: true })
  public poListGrid: IgxGridComponent;
  @ViewChild('poHeaderGrid', { static: true })
  public poHeaderGrid: IgxGridComponent;
  @ViewChild('articleGrid', { static: true })
  public articleGrid: IgxGridComponent;

  statusName: string = '';
  rowId: number = 0;
  statusId: POStatus = 0;
  saveButton: boolean = false;
  approveButton: boolean = false;
  reopenButton: boolean = false;
  appButton: boolean = false;
  okButton: boolean = false;
  printButton: boolean = false;
  isActive: boolean = true;
  isApprove: boolean = false;
  biilToId: string = '';
  notifyToId: string = '';
  shipToId: string = '';
  isRevised: boolean = false;
  isIndent: boolean = true;
  public exprPO: ISortingExpression[];

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;
  validationErrors: string[] = [];

  //// FORMAT PRICE
  public options = {
    digitsInfo: '1.2-2',
    currencyCode: '',
  };
  public formatPrice = this.options;

  // Date options
  public dateOptions = {
    format: 'yyyy-MM-dd',
    // timezone: 'UTC+0',
  };

  public formatDateOptions = this.dateOptions;

  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private purchasingService: PurchasingService,
    private salesOrderServices: SalesorderService,
    private masterServices: MasterService,
    private financeServices: FinanceService
  ) {}

  ngOnInit(): void {
    Promise.all([
      this.initilizeForm(),
      this.loadCategory(),
      this.loadSelectType(),
      this.loadBasis(),
      this.loadPOType(),
      this.loadTax(),
      this.loadCountry(),
      this.loadCurrency(),
      this.loadDeliveryterms(),
      this.loadPaymentTerms(),
      this.loadPorts(),
      this.loadShipmentMode(),
      this.loadTax(),
      this.getCompany(),
      this.getCompanyAddress(),
      this.loadAdditionalCharges(),
      this.loadSupplier(),
      this.getForwardingAgents(),
      this.getApproveRouteDetails(),
    ]).then((result) => {
      this.checkLocalStorage();
    });

    /// INITILIZE GRID GROUP EXPRESSION FOR PO LIST
    this.exprPO = [
      {
        dir: SortingDirection.Desc,
        fieldName: 'poNumber',
        ignoreCase: false,
        strategy: DefaultSortingStrategy.instance(),
      },
    ];
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
      if (authMenus.filter((x) => x.autoIdx == 2230).length > 0) {
        this.approveButton = true;
      }
      if (authMenus.filter((x) => x.autoIdx == 2230).length > 0) {
        this.printButton = true;
      }
      if (authMenus.filter((x) => x.autoIdx == 2270).length > 0) {
        this.reopenButton = true;
      }
    }

    this.poHeaderForm = this.fb.group({
      poHeaderId: [0],
      poNo: [{ value: '', disabled: true }, [Validators.maxLength(30)]],
      category: [null, Validators.required],
      attention: ['', [Validators.maxLength(100), Validators.required]],
      orderRef: ['', [Validators.maxLength(50), Validators.required]],
      poType: ['', Validators.required],
      poTax: [0],
      delStartDate: [''],
      delCancelDate: [''],
      dateInHouse: [''],
      supplier: [''],
      portOfLoading: [''],
      portOfDischarge: [''],
      countryOfOrign: [''],
      countryOfCon: [''],
      countryOfFinalDes: [''],
      forwardingAgent: [''],
      currency: [''],
      paymentTerm: [''],
      shipmentMode: [''],
      deliveryTerm: [''],
      leadTimeinDays: [0],
      transitTimeinDays: [0],
      supplierReference: ['', Validators.maxLength(100)],
      packingType: [''],
      consigne: [''],
      consigneAddress: [{ value: '', disabled: true }],
      consigneAddressId: [{ value: 0 }],
      billTo: [''],
      shipTo: [''],
      notifyTo: [''],
      selectType: [{ value: '', disabled: false }, Validators.required],
    });

    this.poDetailsForm = this.fb.group({
      detailsId: [0],
      articleId: [0],
      articleName: [{ value: '', disabled: true }, Validators.required],
      articleCode: [{ value: '', disabled: true }, Validators.required],
      colorId: [0],
      sizeId: [0],
      color: [{ value: '', disabled: true }, Validators.required],
      size: [{ value: '', disabled: true }, Validators.required],
      indentLineNo: [{ value: '', disabled: true }],
      indentNo: [''],
      uomId: [0],
      uom: [{ value: '', disabled: true }, Validators.required],
      unitPrice: [{ value: 0, decimalScale: 2 }, Validators.required],
      openQty: [{ value: 0, disabled: true }],
      orderedQty: [{ value: 0, disabled: true }],
      orderQty: ['', Validators.required],
    });

    this.addChargeForm = this.fb.group({
      addCharge: ['', Validators.required],
      basis: ['', Validators.required],
      value: ['', Validators.required],
    });

    this.poListForm = this.fb.group({
      searchSup: [''],
      searchCat: [''],
      searchPONo: [''],
    });

    this.approveForm = this.fb.group({
      approver: ['', Validators.required],
      remark: ['', [Validators.maxLength(250)]],
    });

    this.confirmForm = this.fb.group({
      reason: ['', [Validators.maxLength(250), Validators.required]],
    });

    this.reopenForm = this.fb.group({
      remarks: ['', [Validators.maxLength(250), Validators.required]],
    });
  }

  checkLocalStorage() {
    //// get INDENT from local storage and assign to object
    this.indentList = JSON.parse(localStorage.getItem('Indent'));
    localStorage.removeItem('Indent');
    /// CHECK LOCAL STORAGE IF NOT EXISTS GET NEW NUMBER
    this.getPurchasingRefNo();
    if (this.indentList != null) {
      this.loadPODetails();
    }
  }

  loadBasis() {
    this.masterServices.getBasis().subscribe((result) => {
      this.basisList = result;
    });
  }

  loadPODetails() {
    var categoryId = this.indentList[0]['categoryId'];
    this.category.setSelectedItem(categoryId, true);
    this.purchDetailsList = [];
    var purList = [];

    this.indentList.forEach((item) => {
      var obj = {
        indentDetailId: item.indentDetailId,
        sizeId: item.sizeId,
        size: item.size,
        colorId: item.colorId,
        color: item.color,
        articleId: item.articleId,
        articleName: item.articleName + '-(' + item.stockCode + ')',
        unitId: item.uomId,
        unit: item.unit,
        openQty: item.openQty,
        indentNo: item.indentNo,
        indentLineNo: item.indentLineNo,
        orderedQty: item.orderQty,
        orderQty: item.openQty - item.orderQty,
        unitPrice: item.unitPrice,
      };
      purList.push(obj);
    });
    this.purchDetailsList = purList;
    this.setTypeValues();
  }

  setTypeValues() {
    setTimeout(() => {
      this.category.setSelectedItem(this.indentList[0]['categoryId'], true);
      this.selectType.setSelectedItem(2, true);
    }, 1000);
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

  getPurchasingRefNo() {
    this.poHeaderForm.get('poNo').setValue('');
    this.salesOrderServices.getRefNumber('PurchasingOrder').subscribe((res) => {
      this.poHeaderForm.get('poNo').setValue(res.refNo.toString());
    });
  }

  getCompany() {
    var moduleId = this.user.moduleId;
    this.masterServices.getCompany(moduleId).subscribe((result) => {
      this.companyList = result;
    });
  }

  getForwardingAgents() {
    this.masterServices.getForwarder().subscribe((result) => {
      this.fowardingList = result;
    });
  }

  getCompanyAddress() {
    var location = this.user.locationId;
    var companyDetails = this.user.locations.filter(
      (x) => x.locationId == location
    );
    if (companyDetails.length > 0) {
      var companyId = companyDetails[0]['companyId'];
      this.masterServices.getCompany(this.user.moduleId).subscribe((result) => {
        var compObj = result.filter((x) => x.autoId == companyId);
        this.poHeaderForm
          .get('consigneAddress')
          .setValue(compObj[0]['address']);
        this.poHeaderForm
          .get('consigneAddressId')
          .setValue(compObj[0]['autoId']);
      });
    }
  }

  onSelectCompany(event) {
    this.addressList = [];
    this.poHeaderForm.get('billTo').setValue('');
    this.poHeaderForm.get('shipTo').setValue('');
    this.poHeaderForm.get('notifyTo').setValue('');
    for (const item of event.added) {
      this.getAddressList(item);
    }
  }

  getAddressList(companyId) {
    this.masterServices
      .getCustomerAddressList(companyId)
      .subscribe((result) => {
        this.addressList = result;
      });
  }

  loadCategory() {
    this.masterServices.getCategory().subscribe((result) => {
      this.categoryList = result;
    });
  }

  loadSelectType() {
    this.masterServices.getEnumType('SelectType').subscribe((result) => {
      this.selectTypeList = result;
    });
  }

  // onSelectType(event) {
  //   console.log(this.selectType.disabled);
  //   this.purchDetailsList = [];
  //     for (const item of event.added) {
  //       this.selectType = item;
  //       if (item == SelectType.Indent) {
  //         this.isIndent = true;
  //       } else if (item == SelectType.Article)  {
  //         this.isIndent = false;
  //       }
  //     }
  // }

  loadPOType() {
    this.masterServices.getPurchasingOrderType().subscribe((result) => {
      this.poTypeList = result;
    });
  }

  loadTax() {
    this.financeServices.getTax().subscribe((result) => {
      this.poTaxList = result;
    });
  }

  loadAdditionalCharges() {
    this.masterServices.getAddtionalCharges().subscribe((result) => {
      this.addChargeList = result;
    });
  }

  loadCurrency() {
    this.masterServices.getCurrency().subscribe((result) => {
      this.currencyList = result;
    });
  }

  loadPorts() {
    this.masterServices.getPorts().subscribe((result) => {
      this.portOfDischList = result.filter((x) => x.portOfDischarge == true);
      this.portOfLoadList = result.filter((x) => x.portOfLoading == true);
    });
  }

  loadCountry() {
    this.masterServices.getCountries().subscribe((result) => {
      this.countryList = result;
    });
  }

  loadPaymentTerms() {
    this.masterServices.getPaymentTerms().subscribe((result) => {
      this.paymentTermList = result;
    });
  }

  loadDeliveryterms() {
    this.masterServices.getDeliveryTerms().subscribe((result) => {
      this.deliveryTermList = result;
    });
  }

  loadShipmentMode() {
    this.masterServices.getShipmentModes().subscribe((result) => {
      this.shipmentModeList = result;
    });
  }

  loadSupplier() {
    this.purchasingService.getSupplier().subscribe((result) => {
      this.supplierList = result;
    });
  }

  addPOAddChargeRow() {
    var addChargeId = this.addChargeForm.get('addCharge').value[0];
    var basisId = this.addChargeForm.get('basis').value[0];

    const selectedRowData = this.addChargeGrid.data.filter((record) => {
      return record.addChargeId == addChargeId && record.basisId == basisId;
    });

    if (selectedRowData.length == 0) {
      var obj = {
        addChargeId: addChargeId,
        basisId: basisId,
        basis: this.basis.value,
        description: this.addCharges.value,
        value: this.addChargeForm.get('value').value,
      };

      this.addChargeGrid.addRow(obj);
    } else {
      this.toastr.warning('charges already added !!!');
    }
    this.clearAddCharges();
  }

  clearAddCharges() {
    this.addChargeForm.get('addCharge').setValue('');
    this.addChargeForm.get('value').setValue('');
    this.addChargeForm.get('basis').setValue('');
  }

  loadPendingIndentDetails() {
    var obj = {
      categoryId: this.poHeaderForm.get('category').value[0],
      assignedTo: this.user.userId,
    };
    this.purchasingService.getPendIndentDetails(obj).subscribe((result) => {
      this.pendIndentList = result;
    });
  }

  loadArticles() {
    var categoryId = this.poHeaderForm.get('category').value[0];
    this.masterServices.getArticleColorSize(categoryId).subscribe((result) => {
      this.pendIndentList = result;
      // console.log(this.pendIndentList);
    });
  }

  onArticleSearch() {
    var category =
      this.poHeaderForm.get('category').value == undefined
        ? null
        : this.poHeaderForm.get('category').value[0];

    var type =
      this.poHeaderForm.get('selectType').value == undefined
        ? null
        : this.poHeaderForm.get('selectType').value[0];

    if (category != null && type != null) {
      if (type == SelectType.Indent) {
        this.isIndent = true;
        this.loadPendingIndentDetails();
        this.indentDialog.open();
      } else if (type == SelectType.Article) {
        this.isIndent = false;
        this.loadArticles();
        this.articleDialog.open();
      }
    } else {
      this.toastr.warning('Category and Type is required !!!');
    }
  }

  addPODetailsRow() {
    var detailsId = this.poDetailsForm.get('detailsId').value;
    var orderQty = this.poDetailsForm.get('orderQty').value;
    var orderedQty = this.poDetailsForm.get('orderedQty').value;
    var openQty = this.poDetailsForm.get('openQty').value;
    var type = this.poHeaderForm.get('selectType').value[0];

    var balQty = openQty - (orderQty + orderedQty);

    if (balQty >= 0 && type == SelectType.Indent) {
      this.fillPODetails(detailsId);
      this.clearPODetails();
    } else if (type == SelectType.Article) {
      this.fillPODetails(detailsId);
      this.clearPODetails();
    } else {
      this.toastr.warning('Order Qty can not be more than Open Qty !!!');
    }
  }

  fillPODetails(detailsId) {
    var unitPrice = this.poDetailsForm.get('unitPrice').value;
    var orderQty = this.poDetailsForm.get('orderQty').value;

    const selectedRowData = this.purDetailsGrid.data.filter((record) => {
      return record.indentDetailId == detailsId;
    });

    //// check item already in the grid or not
    if (selectedRowData.length > 0) {
      this.purDetailsGrid.updateCell(orderQty, detailsId, 'orderQty');
      this.purDetailsGrid.updateCell(unitPrice, detailsId, 'unitPrice');
    } else {
      var obj = {
        indentDetailId: detailsId,
        sizeId: this.poDetailsForm.get('sizeId').value,
        size: this.poDetailsForm.get('size').value,
        colorId: this.poDetailsForm.get('colorId').value,
        color: this.poDetailsForm.get('color').value,
        articleId: this.poDetailsForm.get('articleId').value,
        articleName: this.poDetailsForm.get('articleName').value,
        unitId: this.poDetailsForm.get('uomId').value,
        unit: this.poDetailsForm.get('uom').value,
        openQty: this.poDetailsForm.get('openQty').value,
        indentNo: this.poDetailsForm.get('indentNo').value,
        indentLineNo: this.poDetailsForm.get('indentLineNo').value,
        orderedQty: this.poDetailsForm.get('orderedQty').value,
        orderQty: orderQty,
        unitPrice: unitPrice,
      };

      this.purDetailsGrid.addRow(obj);
    }
  }

  clearPODetails() {
    this.poDetailsForm.get('detailsId').setValue(0);
    this.poDetailsForm.get('articleId').setValue(0);
    this.poDetailsForm.get('colorId').setValue(0);
    this.poDetailsForm.get('sizeId').setValue(0);
    this.poDetailsForm.get('uomId').setValue(0);
    this.poDetailsForm.get('articleName').setValue('');
    this.poDetailsForm.get('color').setValue('');
    this.poDetailsForm.get('size').setValue('');
    this.poDetailsForm.get('uom').setValue('');
    this.poDetailsForm.get('openQty').setValue(0);
    this.poDetailsForm.get('orderQty').setValue(0);
    this.poDetailsForm.get('orderedQty').setValue(0);
    this.poDetailsForm.get('unitPrice').setValue(0);
    this.poDetailsForm.get('indentNo').setValue(0);
    this.poDetailsForm.get('indentLineNo').setValue('');
  }

  onSelectItem(event, cellId) {
    const ids = cellId.rowID;
    var type = this.poHeaderForm.get('selectType').value[0];

    if (type == SelectType.Indent) {
      const selectedRowData = this.pendIndentGrid.data.filter((record) => {
        return record.indentDetailId == ids;
      });

      if (selectedRowData.length > 0) {
        var articleName =
          selectedRowData[0]['articleName'] +
          ' - (' +
          selectedRowData[0]['stockCode'] +
          ')';
        this.poDetailsForm
          .get('detailsId')
          .setValue(selectedRowData[0]['indentDetailId']);
        this.poDetailsForm
          .get('articleId')
          .setValue(selectedRowData[0]['articleId']);
        this.poDetailsForm
          .get('colorId')
          .setValue(selectedRowData[0]['colorId']);
        this.poDetailsForm.get('sizeId').setValue(selectedRowData[0]['sizeId']);
        this.poDetailsForm.get('uomId').setValue(selectedRowData[0]['uomId']);
        this.poDetailsForm.get('articleName').setValue(articleName);
        this.poDetailsForm.get('color').setValue(selectedRowData[0]['color']);
        this.poDetailsForm.get('size').setValue(selectedRowData[0]['size']);
        this.poDetailsForm.get('uom').setValue(selectedRowData[0]['unit']);
        this.poDetailsForm
          .get('openQty')
          .setValue(selectedRowData[0]['openQty']);
        this.poDetailsForm
          .get('orderedQty')
          .setValue(selectedRowData[0]['orderQty']);
        this.poDetailsForm
          .get('unitPrice')
          .setValue(selectedRowData[0]['unitPrice']);
        this.poDetailsForm
          .get('indentLineNo')
          .setValue(selectedRowData[0]['indentLineNo']);
        this.poDetailsForm
          .get('indentNo')
          .setValue(selectedRowData[0]['indentNo']);
      }
    } else if (type == SelectType.Article) {
      const selectedRowData = this.articleGrid.data.filter((record) => {
        return record.artColorSizeId == ids;
      });

      // console.log(selectedRowData);
      if (selectedRowData.length > 0) {
        var articleName =
          selectedRowData[0]['articleName'] +
          ' - (' +
          selectedRowData[0]['stockCode'] +
          ')';

        this.poDetailsForm
          .get('detailsId')
          .setValue(selectedRowData[0]['artColorSizeId']);
        this.poDetailsForm
          .get('articleId')
          .setValue(selectedRowData[0]['articleId']);
        this.poDetailsForm
          .get('colorId')
          .setValue(selectedRowData[0]['colorId']);
        this.poDetailsForm.get('sizeId').setValue(selectedRowData[0]['sizeId']);
        this.poDetailsForm.get('uomId').setValue(selectedRowData[0]['uomId']);
        this.poDetailsForm.get('articleName').setValue(articleName);
        this.poDetailsForm.get('color').setValue(selectedRowData[0]['color']);
        this.poDetailsForm.get('size').setValue(selectedRowData[0]['size']);
        this.poDetailsForm.get('uom').setValue(selectedRowData[0]['unit']);
      }
    }
    this.articleDialog.close();
  }

  openDeleteDialog(event, cellId) {
    this.rowId = cellId;
    this.dialog.open();
  }

  onDialogOKSelected(event) {
    this.dialog.close();
    this.onItemDelete(event, this.rowId);
  }
  /// Item delete event
  onItemDelete(event, cellId) {
    const ids = cellId.rowID;
    this.purDetailsGrid.deleteRow(ids);
  }

  onDetailsEdit(event, cellId) {
    const ids = cellId.rowID;
    const selectedRowData = this.purDetailsGrid.data.filter((record) => {
      return record.indentDetailId == ids;
    });

    if (selectedRowData.length > 0) {
      this.poDetailsForm
        .get('detailsId')
        .setValue(selectedRowData[0]['indentDetailId']);
      this.poDetailsForm
        .get('articleId')
        .setValue(selectedRowData[0]['articleId']);
      this.poDetailsForm.get('colorId').setValue(selectedRowData[0]['colorId']);
      this.poDetailsForm.get('sizeId').setValue(selectedRowData[0]['sizeId']);
      this.poDetailsForm.get('uomId').setValue(selectedRowData[0]['unitId']);
      this.poDetailsForm
        .get('articleName')
        .setValue(selectedRowData[0]['articleName']);
      this.poDetailsForm.get('color').setValue(selectedRowData[0]['color']);
      this.poDetailsForm.get('size').setValue(selectedRowData[0]['size']);
      this.poDetailsForm.get('uom').setValue(selectedRowData[0]['unit']);
      this.poDetailsForm.get('openQty').setValue(selectedRowData[0]['openQty']);
      this.poDetailsForm
        .get('orderQty')
        .setValue(selectedRowData[0]['orderQty']);
      this.poDetailsForm
        .get('orderedQty')
        .setValue(selectedRowData[0]['orderedQty']);
      this.poDetailsForm
        .get('unitPrice')
        .setValue(selectedRowData[0]['unitPrice']);
      this.poDetailsForm
        .get('indentNo')
        .setValue(selectedRowData[0]['indentNo']);
      this.poDetailsForm
        .get('indentLineNo')
        .setValue(selectedRowData[0]['indentLineNo']);
    }
  }

  onSaveSelected(event) {
    if (this.isRevised == true && this.confirmForm.valid == false) {
      this.toastr.warning('Reason is required !!!');
      return;
    }
    this.savedialog.close();
    if (this.saveButton == true) {
      if (this.validateControls()) {
        this.savePurchasingOrder();
      }
    } else {
      this.toastr.warning('Save permission denied !!!');
    }
  }

  validateControls() {
    if (this.purDetailsGrid.data.length == 0) {
      this.toastr.warning('Fill Purchasing details !!!');
      return false;
    }
    // else if (this.addChargeGrid.data.length == 0) {
    //   this.toastr.warning('Fill Additional Charges !!!');
    //   return false;
    // }
    return true;
  }

  savePurchasingOrder() {
    var poDetails = [];
    var poAddCharge = [];
    var reason = '';

    if (this.isRevised == true) {
      reason = this.confirmForm.get('reason').value;
    }
    var poHeader = {
      poHeaderId: this.poHeaderForm.get('poHeaderId').value,
      poRef: this.poHeaderForm.get('poNo').value,
      categoryId:
        this.poHeaderForm.get('category').value[0] == undefined
          ? null
          : this.poHeaderForm.get('category').value[0],
      attention: this.poHeaderForm.get('attention').value,
      orderRef: this.poHeaderForm.get('orderRef').value,
      supplierId:
        this.poHeaderForm.get('supplier').value[0] == undefined
          ? null
          : this.poHeaderForm.get('supplier').value[0],
      deliveryStartDate: this.datePipe.transform(
        this.poHeaderForm.get('delStartDate').value,
        'yyyy-MM-dd'
      ),
      deliveryCancelDate: this.datePipe.transform(
        this.poHeaderForm.get('delCancelDate').value,
        'yyyy-MM-dd'
      ),
      dateInHouse: this.datePipe.transform(
        this.poHeaderForm.get('dateInHouse').value,
        'yyyy-MM-dd'
      ),
      poTypeId:
        this.poHeaderForm.get('poType').value[0] == undefined
          ? null
          : this.poHeaderForm.get('poType').value[0],
      taxId:
        this.poHeaderForm.get('poTax').value[0] == undefined
          ? null
          : this.poHeaderForm.get('poTax').value[0],
      portOfLoading:
        this.poHeaderForm.get('portOfLoading').value[0] == undefined
          ? null
          : this.poHeaderForm.get('portOfLoading').value[0],
      portOfDischarge:
        this.poHeaderForm.get('portOfDischarge').value[0] == undefined
          ? null
          : this.poHeaderForm.get('portOfDischarge').value[0],
      countryOfOrign:
        this.poHeaderForm.get('countryOfOrign').value[0] == undefined
          ? null
          : this.poHeaderForm.get('countryOfOrign').value[0],
      countryOfConsolidation:
        this.poHeaderForm.get('countryOfCon').value[0] == undefined
          ? null
          : this.poHeaderForm.get('countryOfCon').value[0],
      countryOfFinalDestination:
        this.poHeaderForm.get('countryOfFinalDes').value[0] == undefined
          ? null
          : this.poHeaderForm.get('countryOfFinalDes').value[0],
      forwardingAgent:
        this.poHeaderForm.get('forwardingAgent').value[0] == undefined
          ? null
          : this.poHeaderForm.get('forwardingAgent').value[0],
      currencyId:
        this.poHeaderForm.get('currency').value[0] == undefined
          ? null
          : this.poHeaderForm.get('currency').value[0],
      locationId: this.user.locationId,
      paymentTerm:
        this.poHeaderForm.get('paymentTerm').value[0] == undefined
          ? null
          : this.poHeaderForm.get('paymentTerm').value[0],
      shipmentMode:
        this.poHeaderForm.get('shipmentMode').value[0] == undefined
          ? null
          : this.poHeaderForm.get('shipmentMode').value[0],
      deliveryTerm:
        this.poHeaderForm.get('deliveryTerm').value[0] == undefined
          ? null
          : this.poHeaderForm.get('deliveryTerm').value[0],
      leadTimeinDays: this.poHeaderForm.get('leadTimeinDays').value == "" ? 0 : this.poHeaderForm.get('leadTimeinDays').value,
      transitTimeinDays:
        this.poHeaderForm.get('transitTimeinDays').value == undefined
          ? 0
          : this.poHeaderForm.get('transitTimeinDays').value,
      supplierReference:
        this.poHeaderForm.get('supplierReference').value == undefined
          ? ''
          : this.poHeaderForm.get('supplierReference').value,
      packingType: this.poHeaderForm.get('packingType').value,
      createUserId:
        this.poHeaderForm.get('poType').value[0] == undefined
          ? null
          : this.poHeaderForm.get('poType').value[0],
      consigneId:
        this.poHeaderForm.get('consigne').value[0] == undefined
          ? null
          : this.poHeaderForm.get('consigne').value[0],
      consigneAddId: this.poHeaderForm.get('consigneAddressId').value,
      billToId:
        this.poHeaderForm.get('billTo').value[0] == undefined
          ? null
          : this.poHeaderForm.get('billTo').value[0],
      shipToId:
        this.poHeaderForm.get('shipTo').value[0] == undefined
          ? null
          : this.poHeaderForm.get('shipTo').value[0],
      notifyToId:
        this.poHeaderForm.get('notifyTo').value[0] == undefined
          ? null
          : this.poHeaderForm.get('notifyTo').value[0],
      selectType: this.poHeaderForm.get('selectType').value[0],
      reason: reason,
    };

    var detailsRow = this.purDetailsGrid.data;

    detailsRow.forEach((item) => {
      var details = {
        indentId: item.indentDetailId,
        articleId: item.articleId,
        colorId: item.colorId,
        sizeId: item.sizeId,
        openQty: item.openQty,
        orderQty: item.orderQty,
        unitPrice: item.unitPrice,
        uomId: item.unitId,
      };
      poDetails.push(details);
    });

    var addCharge = this.addChargeGrid.data;

    addCharge.forEach((item) => {
      var addChargeDt = {
        addChargeId: item.addChargeId,
        basisId: item.basisId,
        value: item.value,
      };
      poAddCharge.push(addChargeDt);
    });

    var obj = {
      PurchaseOrderHeader: poHeader,
      PurchaseOrderDetails: poDetails,
      PurchaseOrderCharges: poAddCharge,
    };

    this.purchasingService.savePurchaseOrder(obj).subscribe((result) => {
      if (result['result'] == 1) {
        this.isRevised = true;
        this.toastr.success('Purchase Order save Successfully !!!');
        this.poHeaderForm.get('poHeaderId').setValue(result['refNumId']);
        this.poHeaderForm.get('poNo').setValue(result['refNum']);
        this.loadPurchaseOrderDt();
        this.onSearchPO();
      } else if (result['result'] == -1) {
        this.isRevised = true;
        this.toastr.success('Purchase Order update Successfully !!!');
        this.poHeaderForm.get('poHeaderId').setValue(result['refNumId']);
        this.poHeaderForm.get('poNo').setValue(result['refNum']);
        this.loadPurchaseOrderDt();
        this.onSearchPO();
      } else {
        this.toastr.warning(
          'Contact Admin. Error No:- ' + result['result'].toString()
        );
      }
    });
  }

  onViewPODetails(event, cellId) {
    this.isRevised = true;
    var headerId = cellId.rowID;
    const ItemRowData = this.poHeaderGrid.data.filter((record) => {
      return record.poHeaderId == headerId;
    });

    this.poHeaderForm.get('poHeaderId').setValue(headerId);
    this.poHeaderForm.get('poNo').setValue(ItemRowData[0]['poRef']);

    this.loadPurchaseOrderDt();
  }

  loadPurchaseOrderDt() {
    var POHeaderId = this.poHeaderForm.get('poHeaderId').value;
    this.clearPOHeader();
    this.clearPODetails();
    this.clearAddCharges();
    this.purchDetailsList = [];
    this.purAddChargeList = [];
    this.pendIndentList = [];
    this.confirmForm.get('reason').setValue("");

    this.category.disabled = true;
    this.selectType.disabled = true;
    this.purchasingService.getPurchaseOrderDetails(POHeaderId).subscribe(
      (result) => {
        // console.log(result);
        var POHeader = result.poHeader;

        if (POHeader.length > 0) {
          var delStartdate: Date = new Date(
            this.datePipe.transform(
              POHeader[0]['deliveryStartDate'],
              'yyyy-MM-dd'
            )
          );
          var delCanceldate: Date = new Date(
            this.datePipe.transform(
              POHeader[0]['deliveryCancelDate'],
              'yyyy-MM-dd'
            )
          );
          var dateInHouse: Date = new Date(
            this.datePipe.transform(POHeader[0]['dateInHouse'], 'yyyy-MM-dd')
          );
          this.poHeaderForm
            .get('poHeaderId')
            .setValue(POHeader[0]['poHeaderId']);
          this.poHeaderForm.get('poNo').setValue(POHeader[0]['poRef']);
          this.poHeaderForm.get('attention').setValue(POHeader[0]['attention']);
          this.poHeaderForm.get('orderRef').setValue(POHeader[0]['orderRef']);
          this.poHeaderForm
            .get('supplierReference')
            .setValue(POHeader[0]['supplierReference']);
          this.poHeaderForm
            .get('packingType')
            .setValue(POHeader[0]['packingType']);
          this.poHeaderForm
            .get('leadTimeinDays')
            .setValue(POHeader[0]['leadTimeinDays']);
          this.poHeaderForm
            .get('transitTimeinDays')
            .setValue(POHeader[0]['transitTimeinDays']);
          this.poHeaderForm.get('delStartDate').setValue(delStartdate);
          this.poHeaderForm.get('delCancelDate').setValue(delCanceldate);
          this.poHeaderForm.get('dateInHouse').setValue(dateInHouse);

          this.countryOfCon.setSelectedItem(
            POHeader[0]['countryOfConsolidation'],
            true
          );
          this.countryOfFinalDes.setSelectedItem(
            POHeader[0]['countryOfFinalDestination'],
            true
          );
          this.countryOfOrign.setSelectedItem(
            POHeader[0]['countryOfOrign'],
            true
          );
          this.paymentTerm.setSelectedItem(POHeader[0]['paymentTerm'], true);
          this.currency.setSelectedItem(POHeader[0]['currencyId'], true);
          this.forwardingAgent.setSelectedItem(
            POHeader[0]['forwardingAgent'],
            true
          );
          this.portOfLoad.setSelectedItem(POHeader[0]['portOfLoading'], true);
          this.portOfDisch.setSelectedItem(
            POHeader[0]['portOfDischarge'],
            true
          );
          this.supplier.setSelectedItem(POHeader[0]['supplierId'], true);
          this.poTax.setSelectedItem(POHeader[0]['taxId'], true);
          this.poType.setSelectedItem(POHeader[0]['poTypeId'], true);
          this.category.setSelectedItem(POHeader[0]['categoryId'], true);
          this.shipmentMode.setSelectedItem(POHeader[0]['shipmentMode'], true);
          this.deliveryTerm.setSelectedItem(POHeader[0]['deliveryTerm'], true);
          this.consigne.setSelectedItem(POHeader[0]['consigneId'], true);
          this.selectType.setSelectedItem(POHeader[0]['selectType'], true);
          this.statusName = POStatus[POHeader[0]['status']];
          this.statusId = POHeader[0]['status'];
          this.notifyToId = POHeader[0]['notifyToId'];
          this.shipToId = POHeader[0]['shipToId'];
          this.biilToId = POHeader[0]['billToId'];

          if (this.statusId == POStatus.Approve) {
            this.isActive = true;
            this.isApprove = false;
          } else if (
            this.statusId == POStatus.Inactive ||
            this.statusId == POStatus.Waiting
          ) {
            this.isActive = false;
            this.isApprove = false;
          } else if (this.statusId == POStatus.Created) {
            this.isActive = true;
            this.isApprove = true;
          } else {
            this.isActive = true;
            this.isApprove = false;
          }

          this.getCompanyAddress();
        }

        this.purchDetailsList = result.poDetails;
        this.purAddChargeList = result.poAdditionalCharges;
        // console.log(this.purAddChargeList);
      },
      (err) => console.error(err),
      () => {
        this.setComboValues();
      }
    );
  }

  setComboValues() {
    setTimeout(() => {
      this.billTo.setSelectedItem(this.biilToId, true);
      this.shipTo.setSelectedItem(this.shipToId, true);
      this.notifyTo.setSelectedItem(this.notifyToId, true);
    }, 1000);
  }

  onSearchPO() {
    var categoryId =
      this.poListForm.get('searchCat').value == null
        ? ''
        : this.poListForm.get('searchCat').value;
    var supplierId =
      this.poListForm.get('searchSup').value == null
        ? ''
        : this.poListForm.get('searchSup').value;

    var obj = {
      categoryId: categoryId.toString() == '' ? null : categoryId.toString(),
      supplierId: supplierId.toString() == '' ? null : supplierId.toString(),
      PONo: this.poListForm.get('searchPONo').value,
    };

    this.purchasingService.getPurchaseOrderHeader(obj).subscribe((result) => {
      this.poHeadeList = result;
    });
  }

  clearPOSearchControls() {
    this.poListForm.get('searchSup').setValue('');
    this.poListForm.get('searchCat').setValue('');
    this.poListForm.get('searchPONo').setValue('');
    this.poHeadeList = [];
  }

  clearPOHeader() {
    this.statusId = 0;
    this.statusName = ' ';
    this.category.disabled = false;
    this.selectType.disabled = false;
    this.poHeaderForm.get('poHeaderId').setValue(0);
    this.poHeaderForm.get('poNo').setValue('');
    this.poHeaderForm.get('category').setValue('');
    this.poHeaderForm.get('attention').setValue('');
    this.poHeaderForm.get('orderRef').setValue('');
    this.poHeaderForm.get('supplier').setValue('');
    this.poHeaderForm.get('delStartDate').setValue('');
    this.poHeaderForm.get('delCancelDate').setValue('');
    this.poHeaderForm.get('dateInHouse').setValue('');
    this.poHeaderForm.get('poType').setValue('');
    this.poHeaderForm.get('poTax').setValue('');
    this.poHeaderForm.get('portOfLoading').setValue('');
    this.poHeaderForm.get('portOfDischarge').setValue('');
    this.poHeaderForm.get('countryOfOrign').setValue('');
    this.poHeaderForm.get('countryOfCon').setValue('');
    this.poHeaderForm.get('countryOfFinalDes').setValue('');
    this.poHeaderForm.get('forwardingAgent').setValue('');
    this.poHeaderForm.get('currency').setValue('');
    this.poHeaderForm.get('paymentTerm').setValue('');
    this.poHeaderForm.get('shipmentMode').setValue('');
    this.poHeaderForm.get('deliveryTerm').setValue('');
    this.poHeaderForm.get('leadTimeinDays').setValue('');
    this.poHeaderForm.get('transitTimeinDays').setValue('');
    this.poHeaderForm.get('supplierReference').setValue('');
    this.poHeaderForm.get('packingType').setValue('');
    this.poHeaderForm.get('poType').setValue('');
    this.poHeaderForm.get('consigne').setValue('');
    this.poHeaderForm.get('billTo').setValue('');
    this.poHeaderForm.get('shipTo').setValue('');
    this.poHeaderForm.get('notifyTo').setValue('');
    this.poHeaderForm.get('selectType').setValue('');
  }

  refreshControls() {
    this.clearPOHeader();
    this.clearAddCharges();
    this.clearPODetails();
    this.purchDetailsList = [];
    this.purAddChargeList = [];
    this.pendIndentList = [];
    this.getPurchasingRefNo();
    this.isActive = true;
    this.isApprove = false;
    this.isRevised = false;
  }

  ///// GET APPROVE ROUTING DETAILS BASED ON USER ID AND MODULE
  getApproveRouteDetails() {
    var obj = {
      userId: this.user.userId,
      module: 'Purchasing Order',
    };

    this.salesOrderServices.getApproveRouteDetails(obj).subscribe((result) => {
      this.approveRoteList = result['approveUsers'];
      if (this.approveRoteList.length > 0) {
        this.approveButton = true;
      } else {
        this.approveButton = false;
      }
    });
  }

  /// APPROVE COST SHEET
  approveButtonClicked() {
    if (this.approveButton == true) {
      this.approveForm.get('approver').setValue('');
      this.approveForm.get('remark').setValue('');

      // console.log(this.approveRoteList);
      var defaultUser = this.approveRoteList.filter((x) => x.isDefault == true);
      if (defaultUser.length > 0)
        this.approver.setSelectedItem(defaultUser[0]['idAgents'], true);

      // console.log(this.approveRoteList);
      var buyPassList = this.approveRoteList.filter((x) => x.buyPass == true);
      this.approveModal.open();
      //// if buy pass is ONE no routing approver is nedded
      if (buyPassList.length > 0) {
        this.approveForm.get('approver').disable();
        this.appButton = true;
        this.okButton = false;
      } else {
        this.approveForm.get('approver').enable();
        this.appButton = false;
        this.okButton = true;
      }
    } else {
      this.toastr.error('Approve permission denied !!!');
    }
  }

  //// APPROVE ROUTING PROCESS
  approveRoutePO(status) {
    var approver = this.approveForm.get('approver').value[0];
    var approveDtList = this.approveRoteList.filter(
      (x) => x.idAgents == approver
    );

    var obj = {
      autoId: 0,
      moduleName: 'Purchasing Order',
      assigneUser: approver,
      requestedBy: this.user.userId,
      refId: this.poHeaderForm.get('poHeaderId').value,
      refNo: this.poHeaderForm.get('poNo').value,
      remarks: this.approveForm.get('remark').value,
      details: 'Supplier : ' + this.supplier.value,
      isFinal: approveDtList[0]['isFinalApprove'],
      status: status,
    };

    // console.log(obj);
    this.salesOrderServices.saveApproveCenterDt(obj).subscribe((result) => {
      if (result == 1) {
        if (status == 'Waiting') {
          this.toastr.success('Approve sent is successfully !!!');
          this.statusId = POStatus.Waiting;
        } else if (status == 'Approve') {
          this.toastr.success('Approve successfully !!!');
          this.statusId = POStatus.Approve;
        } else if (status == 'Reject') {
          this.toastr.success('Reject successfully !!!');
          this.statusId = POStatus.Reject;
        }
        this.statusName = POStatus[this.statusId];
        this.approveModal.close();
        this.onSearchPO();
      } else if (result == -1) {
        this.toastr.success('Approve details already exists !!!');
      } else {
        this.toastr.warning('Contact Admin. Error No:- ' + result.toString());
      }
    });
  }

  printPurOrder() {
    if(this.printButton == true) {
      // this.router.navigate(['/boldreport']);
      var obj = {
        purchaseId: this.poHeaderForm.get('poHeaderId').value,
        reportName: "PoPrint"
      }
      // console.log(this.jobHeaderForm.get('headerId').value);
      /// STORE OBJECT IN LOCAL STORAGE
      localStorage.setItem('params', JSON.stringify(obj));
      window.open('/boldreport', '_blank');
    } else {
      this.toastr.error('Print Permission denied !!!');
    }
  }

  cancelPurchaseOrder() {
    var obj = {
      poHeaderId: this.poHeaderForm.get('poHeaderId').value,
      createUserId: this.user.userId,
    };

    this.purchasingService.cancelPurchaseOrder(obj).subscribe((result) => {
      if (result == 1) {
        this.toastr.success('PO cancel Successfully !!!');
        this.statusId = POStatus.Inactive;
        this.statusName = POStatus[this.statusId];
        this.isActive = false;
        this.isApprove = false;
        this.onSearchPO();
      } else if (result == -1) {
        this.toastr.warning('GRN already created, Cancel Failed !!!');
      } else {
        this.toastr.warning(
          'Contact Admin. Error No:- ' + result['result'].toString()
        );
      }
    });
  }

  onReopenSelected(event) {
    if (this.reopenForm.valid == false) {
      this.toastr.warning('Reason is required !!!');
      return;
    }
    this.reopendialog.close();
    if (this.reopenButton == true) {
      this.reopenPurchaseOrder();
    } else {
      this.toastr.warning('Save permission denied !!!');
    }
  }

  reopenPurchaseOrder() {
    var obj = {
      poHeaderId: this.poHeaderForm.get('poHeaderId').value,
      createUserId: this.user.userId,
      remarks: this.reopenForm.get('remarks').value
    };

    this.purchasingService.reopenPurchaseOrder(obj).subscribe((result) => {
      if (result == 1) {
        this.toastr.success('PO reopen Successfully !!!');
        this.statusId = POStatus.Created;
        this.statusName = POStatus[this.statusId];
        this.isActive = true;
        this.isApprove = false;
        this.reopenForm.get('remarks').setValue("");
        this.onSearchPO();      
      } else {
        this.toastr.warning(
          'Contact Admin. Error No:- ' + result['result'].toString()
        );
      }
    });
  }
}


