import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  IComboSelectionChangeEventArgs,
  IgxColumnComponent,
  IgxComboComponent,
  IgxDialogComponent,
  IgxGridComponent,
} from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { Article } from 'src/app/_models/article';
import { Category } from 'src/app/_models/category';
import { Color } from 'src/app/_models/color';
import { MRStatus } from 'src/app/_models/mrHeader';
import { ProductGroup } from 'src/app/_models/productGroup';
import { ProductType } from 'src/app/_models/productType';
import { Size } from 'src/app/_models/size';
import { StoreSite } from 'src/app/_models/storeSite';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';
import { MaterialrequestService } from '_services/materialrequest.service';
import { SalesorderService } from '_services/salesorder.service';

@Component({
  selector: 'app-material-request',
  templateUrl: './material-request.component.html',
  styleUrls: ['./material-request.component.css'],
})
export class MaterialRequestComponent implements OnInit {
  mrHeaderForm: FormGroup;
  mrDetailsForm: FormGroup;
  articleForm: FormGroup;
  mrListForm: FormGroup;
  approveForm: FormGroup;

  mrList: any;
  user: User;
  categoryList: Category[];
  articleList: Article[];
  searchSiteList: StoreSite[];
  colorList: Color[];
  prodCatList: Category[];
  sizeList: Size[];
  assignedToList: any;
  locationList: any;
  siteList: StoreSite[];
  allArticleList: any[];
  prodTypeList: ProductType[];
  prodGroupList: ProductGroup[];
  mrDetailsList: any[];
  approveRoteList: any;
  status: MRStatus = 0;
  rowId: number = 0;
  statusName: string = '';
  statusList: any;

  saveButton: boolean = false;
  approveButton: boolean = false;
  appButton: boolean = false;
  okButton: boolean = false;
  printButton: boolean = false;

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;
  validationErrors: string[] = [];

  @ViewChild('mrDetailsGrid', { static: true })
  public mrDetailsGrid: IgxGridComponent;
  @ViewChild('articleGrid', { static: true })
  public articleGrid: IgxGridComponent;
  @ViewChild('mrNoListGrid', { static: true })
  public mrNoListGrid: IgxGridComponent;

  @ViewChild('prodCategory', { read: IgxComboComponent })
  public prodCategory: IgxComboComponent;
  @ViewChild('site', { read: IgxComboComponent })
  public site: IgxComboComponent;
  @ViewChild('location', { read: IgxComboComponent })
  public location: IgxComboComponent;
  @ViewChild('article', { read: IgxComboComponent })
  public article: IgxComboComponent;
  @ViewChild('color', { read: IgxComboComponent })
  public color: IgxComboComponent;
  @ViewChild('size', { read: IgxComboComponent })
  public size: IgxComboComponent;
  @ViewChild('assignedTo', { read: IgxComboComponent })
  public assignedTo: IgxComboComponent;
  @ViewChild('prodCat', { read: IgxComboComponent })
  public prodCat: IgxComboComponent;
  @ViewChild('approver', { read: IgxComboComponent })
  public approver: IgxComboComponent;

  // SEARCH CRITERIA
  @ViewChild('searchSite', { read: IgxComboComponent })
  public searchSite: IgxComboComponent;
  @ViewChild('searchStatus', { read: IgxComboComponent })
  public searchStatus: IgxComboComponent;

  @ViewChild('articleDialog', { read: IgxDialogComponent })
  public articleDialog: IgxDialogComponent;
  @ViewChild('dialog', { read: IgxDialogComponent })
  public dialog: IgxDialogComponent;
  @ViewChild('savedialog', { read: IgxDialogComponent })
  public savedialog: IgxDialogComponent;
  @ViewChild('approveModal', { read: IgxDialogComponent })
  public approveModal: IgxDialogComponent;

  showColor: boolean = true;
  showSize: boolean = true;
  isCatSelected: boolean = false;

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
    private materialRequestServices: MaterialrequestService,
    private salesOrderServices: SalesorderService,
    private masterServices: MasterService
  ) {}

  ngOnInit(): void {
    this.initilizeForm();
    this.loadCategory();
    this.loadLocation();
    this.loadUserSites();
    this.loadAssignedTo();
    this.getApproveRouteDetails();
    this.loadStatus();
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
      if (authMenus.filter((x) => x.autoIdx == 2213).length > 0) {
        this.approveButton = true;
      }
      if (authMenus.filter((x) => x.autoIdx == 2224).length > 0) {
        this.printButton = true;
      }
    }

    this.mrHeaderForm = this.fb.group({
      headerId: [0],
      createUserId: this.user.userId,
      mrNo: [{ value: '', disabled: true }, [Validators.maxLength(30)]],
      prodCategory: [null, Validators.required],
      assignedTo: ['', Validators.required],
      location: ['', Validators.required],
      site: ['', Validators.required],
      // remarks: [''],
      statusId: [0],
      trnsDate: [{ value: date, disabled: true }],
    });

    this.mrDetailsForm = this.fb.group({
      detailsId: [0],
      articleId: [0],
      articleName: [{ value: '' }, Validators.required],
      articleCode: [{ value: '', disabled: true }],
      colorId: ['', Validators.required],
      sizeId: ['', Validators.required],
      uomId: [0],
      uom: [{ value: '', disabled: true }, Validators.required],
      unitPrice: [{ value: 0, decimalScale: 2 }], //{ value: 0, decimalScale: 2 }
      reqQty: ['', Validators.required],
      approveQty: [''],
      requireDate: ['', Validators.required],
    });

    this.mrDetailsForm.get('unitPrice').setValue(0);

    this.articleForm = this.fb.group({
      prodType: ['', Validators.required],
      prodGroup: ['', Validators.required],
    });

    this.mrListForm = this.fb.group({
      prodCat: ['', Validators.required],
      searchSite: [0],
      createdBy: [],
      createdDate: [],
      reqDate: [],
      status: [],
      searchArticle: [],
      searchMRNo: [],
    });

    this.approveForm = this.fb.group({
      approver: ['', Validators.required],
      remark: ['', [Validators.maxLength(250)]],
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

  getMRRefNo(item) {
    var obj = {
      siteId: item,
      transType: 'MR',
      createUserId: this.user.userId,
    };
    this.masterServices.getInventorySerialNo(obj).subscribe((res) => {
      this.mrHeaderForm.get('mrNo').setValue(res.refNo.toString());
    });
  }

  loadAssignedTo() {
    this.masterServices.getIntentUserMasterSetting().subscribe((result) => {
      this.assignedToList = result;
    });
  }

  loadStatus() {
    this.statusList = [
      { status: 'Created', autoId: 1 },
      { status: 'Waiting', autoId: 2 },
      { status: 'Approve', autoId: 3 },
      { status: 'Reject', autoId: 4 },
      { status: 'Closed', autoId: 5 },
    ];
  }

  loadCategory() {
    this.masterServices.getCategory().subscribe((result) => {
      this.categoryList = result;
      this.prodCatList = result;
    });
  }

  loadArticle(category) {
    console.log(category);
    this.masterServices.getArticlesAll().subscribe((result) => {
      this.allArticleList = result.filter((x) => x.categoryId == category);
    });
  }

  loadUserSites() {
    var userId = this.user.userId;
    this.masterServices.getUserSite(userId).subscribe((result) => {
      this.siteList = result;
      this.searchSiteList = result;
    });
  }

  loadLocation() {
    // console.log(this.user.locations);
    this.locationList = this.user.locations;
  }

  loadProductType(catId: number) {
    this.masterServices.getProductTypeDetils(catId).subscribe((result) => {
      this.prodTypeList = result;
      //  console.log(this.prodTypeList);
    });
  }

  onArticleSelect(event) {
    this.colorList = [];
    this.sizeList = [];
    this.mrDetailsForm.get('articleCode').setValue('');
    this.mrDetailsForm.get('uom').setValue('');
    this.mrDetailsForm.get('uomId').setValue('');

    for (const item of event.added) {
      var articleRow = this.allArticleList.filter((x) => x.autoId == item);

      console.log(this.allArticleList , item );
      if (articleRow.length > 0) {
        this.mrDetailsForm
          .get('articleCode')
          .setValue(articleRow[0]['stockCode']);
        this.mrDetailsForm.get('uom').setValue(articleRow[0]['measurement']);
        this.mrDetailsForm
          .get('uomId')
          .setValue(articleRow[0]['measurementId']);

        this.loadColor(item);
        this.loadSize(item);
      }      
    }
  }

  loadColor(articleId) {
    this.colorList = [];
    this.mrDetailsForm.get('colorId').setValue('');
    //console.log(item);
    this.masterServices.getArticleColor(articleId).subscribe((color) => {
      this.colorList = color;
      // console.log(this.colorList);
    });
  }

  loadSize(articleId) {
    this.sizeList = [];
    this.mrDetailsForm.get('sizeId').setValue('');
    this.masterServices.getArticleSize(articleId).subscribe((size) => {
      this.sizeList = size;
    });
  }

  onSiteSelect(event) {
    if (this.site.disabled == false) {
      this.mrHeaderForm.get('mrNo').setValue('');
      for (const item of event.added) {
        this.getMRRefNo(item);
      }
    }
  }

  onSelectCategory(event) {
    this.isCatSelected = true;
    this.articleForm.get('prodType').reset();
    this.articleForm.get('prodGroup').reset();
    this.prodTypeList = [];
    this.prodGroupList = [];
    this.articleList = [];
    this.mrDetailsList = [];
    this.allArticleList = [];

    for (const item of event.added) {
      this.loadProductType(item);
      this.loadArticle(item);
    }
  }

  onSelectProdType(event) {
    this.articleForm.get('prodGroup').reset();
    this.prodGroupList = [];
    this.articleList = [];

    for (const item of event.added) {
      this.loadProductGroup(item);
    }
  }

  checkCategory() {
    if (this.mrHeaderForm.get('prodCategory').value != null) {
      this.articleDialog.open();
    } else {
      this.toastr.info('Product Category is required');
      this.mrHeaderForm.get('prodCategory').dirty;
    }
  }

  loadProductGroup(typeId: number) {
    this.masterServices.getProductGroupDt(typeId).subscribe((result) => {
      this.prodGroupList = result;
    });
  }

  //// LOADS ARTICLES BASED ON CATEGORY , PROD TYPE AND GROUP
  onSelectProdGroup(event) {
    this.articleList = [];
    var articles: any[];
    for (const item of event.added) {
      var obj = {
        categoryId: this.mrHeaderForm.get('prodCategory').value[0],
        proTypeId: this.articleForm.get('prodType').value[0],
        proGroupId: item,
      };
      //console.log(obj);
      this.masterServices.getArticleDetails(obj).subscribe(
        (result) => {
          articles = result.filter(x => x.isActive == true);
        },
        (error) => {
          this.validationErrors = error;
        },
        () => {
          if (articles.length > 0) {
            var autoId = 0,
              flexLine = [];
            // console.log(articles);

            ///// Get Unique Article List
            var uniqeArticle = articles.filter(
              (arr, index, self) =>
                index === self.findIndex((t) => t.autoId === arr.autoId)
            );

            ///// PUSH FLEX FIELD ARTICLE LIST
            for (let b = 0; b < uniqeArticle.length; b++) {
              autoId = uniqeArticle[b]['autoId'];
              var fieldLine: any = uniqeArticle[b];

              // console.log(uniqeArticle);
              //// GET FLEX FIELD LIST FOR SAME ARTICLE
              var flexFieldList = articles.filter((x) => x.autoId == autoId);
              flexLine = [];

              //// CREATE CHILD OBJECT AS FLEX FIELD
              for (let a = 0; a < flexFieldList.length; a++) {
                const element = flexFieldList[a];
                var flexValue = 0;

                if (element['dataType'] == 'F')
                  flexValue = element['fFlexFeildValue'];
                else if (element['dataType'] == 'N')
                  flexValue = element['iFlexFeildValue'];
                else if (element['dataType'] == 'T')
                  flexValue = element['cFlexFeildValue'];
                else if (element['dataType'] == 'B')
                  flexValue = element['bFlexFeildValue'];
                else if (element['dataType'] == 'D')
                  flexValue = element['dFlexFeildValue'];

                var obj = {
                  dataType: element['dataType'],
                  flexFieldId: element['flexFieldId'],
                  flexFieldName: element['flexFieldName'],
                  flexFieldCode: element['flexFieldCode'],
                  flexFieldValue: flexValue,
                  valueList: element['valueList'],
                };
                flexLine.push(obj);
              }

              fieldLine.FlexFields = flexLine;
            }
            this.articleList = uniqeArticle;
            // console.log(this.articleList);
          }
        }
      );
    }
  }

  selectArticle(event, cellId) {
    const ids = cellId.rowID;  

    const selectedRowData = this.articleGrid.data.filter((record) => {
      return record.autoId == ids;
    });

    console.log(selectedRowData);
    var articleId = selectedRowData[0]['autoId'];
    this.article.setSelectedItem(selectedRowData[0]['autoId'], true);
    this.mrDetailsForm
      .get('articleCode')
      .setValue(selectedRowData[0]['stockCode']);
    this.mrDetailsForm.get('uom').setValue(selectedRowData[0]['measurement']);
    this.mrDetailsForm
      .get('uomId')
      .setValue(selectedRowData[0]['measurementId']);

    this.articleDialog.close();
    this.loadColor(articleId);
    this.loadSize(articleId);
    
  }

   /// ADD NEW ITEM TO GRID / UPDATE
  addMRDetailsRow() {
    if (this.checkIsEditable() && this.validateDate()) {
      // console.log(this.soItemForm.get('brandCodeId').value);
      // var status = true;
      var detailsId = this.mrDetailsForm.get('detailsId').value;
      var reqQty = this.mrDetailsForm.get('reqQty').value;
      var unitPrice =
        this.mrDetailsForm.get('unitPrice').value == ''
          ? 0
          : this.mrDetailsForm.get('unitPrice').value;
      var date = this.mrDetailsForm.get('requireDate').value;
      var reqFormatDate = this.datePipe.transform(date, 'yyyy-MM-dd');

      // console.log(itemId);
      //// EXISTING ITEM IN ITEM GRID
      if (detailsId != 0) {
        // console.log(brandCodeId);
        this.mrDetailsGrid.updateCell(reqQty, detailsId, 'reqQty');
        this.mrDetailsGrid.updateCell(unitPrice, detailsId, 'unitPrice');
        this.mrDetailsGrid.updateCell(reqFormatDate, detailsId, 'requireDate');
      } else {
        //// ADD NEW ITEM ENTRY
        detailsId = this.findMaxId(this.mrDetailsGrid.data) + 1;
        //console.log(itemId);
        //itemId = this.itemGrid.dataLength + 1;
        var articleId = this.mrDetailsForm.get('articleName').value[0];
        var colorId = this.mrDetailsForm.get('colorId').value[0];
        var sizeId = this.mrDetailsForm.get('sizeId').value[0];

        //// CHECK IF IT IS EXISTING ITEM DETAILS
        const ItemRowData = this.mrDetailsGrid.data.filter((record) => {
          return (
            record.articleId == articleId &&
            record.colorId == colorId &&
            record.sizeId == sizeId
          );
        });

        if (ItemRowData.length > 0) {
          this.toastr.warning('record added already !!!');
          return;
        } else {
          var obj = {
            detailsId: detailsId,
            sizeId: sizeId,
            size: this.size.value,
            colorId: colorId,
            color: this.color.value,
            articleId: articleId,
            articleName: this.article.value,
            articleCode: this.mrDetailsForm.get('articleCode').value,
            uomId: this.mrDetailsForm.get('uomId').value,
            uom: this.mrDetailsForm.get('uom').value,
            reqQty: reqQty,
            unitPrice: unitPrice,
            requireDate: reqFormatDate,
          };

          this.mrDetailsGrid.addRow(obj);
        }
      }
      this.clearMRDetailsControls();
    }
  }

  validateDate() {
    var today = this.mrHeaderForm.get('trnsDate').value;
    var requireDate = this.mrDetailsForm.get('requireDate').value;

    // console.log(today);
    // console.log(requireDate);
    if (requireDate != '') {
      if (today >= requireDate) {
        this.toastr.warning('Invalid date');
        return false;
      }
    }
    return true;
  }

  clearMRDetailsControls() {
    this.showColor = true;
    this.showSize = true;
    this.sizeList = [];
    this.colorList = [];
    this.mrDetailsForm.get('sizeId').enable();
    this.mrDetailsForm.get('colorId').enable();

    this.mrDetailsForm.reset();
    this.mrDetailsForm.get('detailsId').setValue(0);
    this.mrDetailsForm.get('sizeId').setValue(0);
    this.mrDetailsForm.get('colorId').setValue(0);
    this.mrDetailsForm.get('articleId').setValue('');
    this.mrDetailsForm.get('articleCode').setValue('');
    this.mrDetailsForm.get('articleName').setValue('');
    this.mrDetailsForm.get('reqQty').setValue('');
    this.mrDetailsForm.get('uom').setValue('');
    this.mrDetailsForm.get('requireDate').setValue('');
    this.mrDetailsForm.get('unitPrice').setValue(0);
  }

  /// GET MAXIMUMUM DELEIVERY ID
  findMaxId(arr) {
    var maxValue: number = 0;
    for (var i = 0; i < arr.length; i++) {
      //console.log(arr[i].deliveryId);
      if (arr[i].detailsId > maxValue) {
        maxValue = arr[i].detailsId;
      }
    }
    //console.log(maxValue);
    return maxValue;
  }

  /// CHECK IF MR IS EDITABLE OR NOT
  checkIsEditable() {
    var statusId = this.mrHeaderForm.get('statusId').value;

    if (statusId == MRStatus.Waiting) {
      this.toastr.warning('MR is Waiting');
      return false;
    }
    return true;
  }

  onDetailsEdit(event, cellId) {
    if (this.checkIsEditable()) {
      this.clearMRDetailsControls();
      this.mrDetailsForm.get('colorId').disable();
      this.mrDetailsForm.get('sizeId').disable();
      //this.showArticle = false;
      this.showColor = false;
      this.showSize = false;

      const ids = cellId.rowID;
      const selectedRowData = this.mrDetailsGrid.data.filter((record) => {
        return record.detailsId == ids;
      });

      if (selectedRowData.length > 0) {
        var reqFormatDate: Date = new Date(selectedRowData[0]['requireDate']);
        this.mrDetailsForm.get('requireDate').setValue(reqFormatDate);
        this.mrDetailsForm
          .get('detailsId')
          .setValue(selectedRowData[0]['detailsId']);
        this.mrDetailsForm
          .get('articleCode')
          .setValue(selectedRowData[0]['articleCode']);
        this.article.setSelectedItem(selectedRowData[0]['articleId'], true);
        this.mrDetailsForm.get('uom').setValue(selectedRowData[0]['uom']);
        this.mrDetailsForm.get('uomId').setValue(selectedRowData[0]['uomId']);
        this.mrDetailsForm.get('colorId').setValue(selectedRowData[0]['color']);
        this.mrDetailsForm.get('sizeId').setValue(selectedRowData[0]['size']);
        this.mrDetailsForm.get('reqQty').setValue(selectedRowData[0]['reqQty']);
        this.mrDetailsForm
          .get('unitPrice')
          .setValue(selectedRowData[0]['unitPrice']);
      }
    }
  }

  refreshMR() {
    this.clearMrHeader();
    this.clearMRDetailsControls();
    this.enableMrHeader();
    this.mrDetailsList = [];
  }

  onDialogOKSelected(event) {
    event.dialog.close();
    if (this.rowId > 0) {
      this.onItemDelete(event, this.rowId);
    } else {
      this.cancelMR();
    }
  }

  /// Item delete event
  onItemDelete(event, cellId) {
    if (this.checkIsEditable()) {
      //console.log(cellId.rowID);
      const ids = cellId.rowID;
      this.rowId = 0;
      this.mrDetailsGrid.deleteRow(ids);
    }
  }

  //// save dialog confirmation to save
  onSaveSelected(event) {
    this.savedialog.close();
    this.SaveMR();
  }

  SaveMR() {
    if (this.ValidateMRDetails()) {
      var detailList = [];

      var headerData = {
        mrHeaderId: this.mrHeaderForm.get('headerId').value,
        mrNo: this.mrHeaderForm.get('mrNo').value,
        assignedTo: this.mrHeaderForm.get('assignedTo').value[0],
        siteId: this.mrHeaderForm.get('site').value[0],
        locationId: this.mrHeaderForm.get('location').value[0],
        categoryId: this.mrHeaderForm.get('prodCategory').value[0],
        transDate: this.datePipe.transform(
          this.mrHeaderForm.get('trnsDate').value,
          'yyyy-MM-dd'
        ),
        createUserId: this.user.userId,
      };

      ////--------=========== MATERIAL REQUEST DETAILS =======================---------
      var itemRows = this.mrDetailsGrid.data;

      itemRows.forEach((items) => {
        var itemdata = {
          mrDetailsId: items.detailsId,
          articleId: items.articleId,
          sizeId: items.sizeId,
          colorId: items.colorId,
          reqQty: items.reqQty,
          unitPrice: items.unitPrice,
          requireDate: items.requireDate,
          uomId: items.uomId,
        };
        detailList.push(itemdata);
      });

      var obj = {
        mrHeader: headerData,
        mrDetails: detailList,
      };

      this.materialRequestServices
        .saveMaterialRequest(obj)
        .subscribe((result) => {
          if (result['result'] == 1) {
            this.toastr.success('MR save Successfully !!!');
            this.mrHeaderForm.get('headerId').setValue(result['refNumId']);
            this.loadMaterialRequestDt();
          } else if (result['result'] == -1) {
            this.toastr.success('MR update Successfully !!!');
            this.loadMaterialRequestDt();
          } else {
            this.toastr.warning(
              'Contact Admin. Error No:- ' + result['result'].toString()
            );
          }
        });
    } else {
      this.toastr.warning('Fill MR Details');
    }
  }

  loadMaterialRequestDt() {
    var mrHeaderId = this.mrHeaderForm.get('headerId').value;

    this.materialRequestServices
      .getMaterialRequestDt(mrHeaderId)
      .subscribe((result) => {
        if (result.length > 0) {
          this.clearMRNote();
          var detailList = [];
          var transDate: Date = new Date(
            this.datePipe.transform(result[0]['transDate'], 'yyyy-MM-dd')
          );
          // console.log(result[0]["locationId"]);

          this.site.setSelectedItem(result[0]['siteId'], true);
          this.location.setSelectedItem(result[0]['locationId'], true);
          this.prodCategory.setSelectedItem(result[0]['categoryId'], true);
          this.assignedTo.setSelectedItem(result[0]['assignedTo'], true);
          this.mrHeaderForm.get('trnsDate').setValue(transDate);
          this.mrHeaderForm.get('statusId').setValue(result[0]['statusId']);
          this.status = result[0]['statusId'];
          this.statusName = MRStatus[result[0]['statusId']];

          this.mrHeaderForm.get('headerId').setValue(result[0]['mrHeaderId']);
          this.mrHeaderForm.get('mrNo').setValue(result[0]['mrNo']);

          for (let index = 0; index < result.length; index++) {
            var reqireDate = this.datePipe.transform(
              result[index]['requireDate'],
              'yyyy-MM-dd'
            );
            var itemdata = {
              detailsId: result[index]['mrDetailsId'],
              articleColrSizeId: result[index]['articleColrSizeId'],
              articleId: result[index]['articleId'],
              sizeId: result[index]['sizeId'],
              colorId: result[index]['colorId'],
              reqQty: result[index]['reqQty'],
              unitPrice: result[index]['unitPrice'],
              requireDate: reqireDate,
              uomId: result[index]['uomId'],
              size: result[index]['size'],
              color: result[index]['color'],
              articleName: result[index]['articleName'],
              articleCode: result[index]['stockCode'],
              uom: result[index]['unit'],
              orderQty: result[index]['orderQty'],
              grnQty: result[index]['grnQty'],
              stockInQty: result[index]['stockInQty'],
              pendRecQty: result[index]['pendRecQty'],
            };
            detailList.push(itemdata);
          }
          this.mrDetailsList = detailList;
        }
      });
  }

  disableMrHeader() {
    this.site.disabled = true;
    this.prodCategory.disabled = true;
  }

  enableMrHeader() {
    this.site.disabled = false;
    this.prodCategory.disabled = false;
  }

  ValidateMRDetails() {
    if (this.mrDetailsGrid.dataLength > 0) {
      return true;
    }
    return false;
  }

  onSearchMR() {
    // console.log(this.mrListForm.get('searchSite').value);
    var categoryId =
      this.mrListForm.get('prodCat').value == null
        ? ''
        : this.mrListForm.get('prodCat').value;
    var siteId =
      this.mrListForm.get('searchSite').value == 0
        ? ''
        : this.mrListForm.get('searchSite').value;
    var statusId =
      this.mrListForm.get('status').value == null
        ? ''
        : this.mrListForm.get('status').value;

    var obj = {
      categoryId: categoryId.toString() == '' ? null : categoryId.toString(),
      siteId: siteId.toString() == '' ? null : siteId.toString(),
      statusId: statusId.toString() == '' ? null : statusId.toString(),
      mrNo: this.mrListForm.get('searchMRNo').value,
      createdBy: this.mrListForm.get('createdBy').value,
      createdDate: this.datePipe.transform(
        this.mrListForm.get('createdDate').value,
        'yyyy-MM-dd'
      ),
      articleName: this.mrListForm.get('searchArticle').value,
      reqDate: this.datePipe.transform(
        this.mrListForm.get('reqDate').value,
        'yyyy-MM-dd'
      ),
    };

    this.materialRequestServices.getMRNoList(obj).subscribe((result) => {
      var mrNoList = [];
      if (result.length > 0) {
        for (let index = 0; index < result.length; index++) {
          var obj = {
            mrHeaderId: result[index]['mrHeaderId'],
            site: result[index]['siteName'],
            location: result[index]['location'],
            agentName: result[index]['agentName'],
            transDate: result[index]['transDate'],
            remark: result[index]['remark'],
            status: MRStatus[result[index]['statusId']],
            mrNo: result[index]['mrNo'],
          };
          mrNoList.push(obj);
        }
      }
      this.mrList = mrNoList;
    });
  }

  //// CLICK EVENT OF MR NO LIST
  onViewMRDetails(event, cellId) {
    var headerId = cellId.rowID;
    // console.log(headerId);
    // const ItemRowData = this.mrNoListGrid.data.filter((record) => {
    //   return record.mrHeaderId == headerId;
    // });
    this.mrHeaderForm.get('headerId').setValue(headerId);
    this.loadMaterialRequestDt();
  }

  clearMRNote() {
    this.clearMrHeader();
    this.disableMrHeader();

    this.mrDetailsList = [];
  }

  clearMrHeader() {
    var date: Date = new Date(Date.now());

    this.mrHeaderForm.get('headerId').setValue(0);
    this.mrHeaderForm.get('mrNo').setValue('');
    this.mrHeaderForm.get('site').setValue(0);
    this.mrHeaderForm.get('location').setValue(0);
    this.mrHeaderForm.get('prodCategory').setValue(0);
    this.mrHeaderForm.get('assignedTo').setValue(0);
    this.mrHeaderForm.get('trnsDate').setValue(date);
    this.mrHeaderForm.get('statusId').setValue(0);
    this.status = null;
    this.statusName = '';
  }

  openDeleteDialog(event, cellId) {
    this.rowId = cellId;
    if (this.rowId > 0) {
      this.dialog.open();
    } else if (this.rowId == 0) {
      this.dialog.open();
    }
  }

  ///// GET APPROVE ROUTING DETAILS BASED ON USER ID AND MODULE
  getApproveRouteDetails() {
    var obj = {
      userId: this.user.userId,
      module: 'MR',
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
  approveRouteMR(status) {
    var approver = this.approveForm.get('approver').value[0];
    var approveDtList = this.approveRoteList.filter(
      (x) => x.idAgents == approver
    );

    var obj = {
      autoId: 0,
      moduleName: 'MR',
      assigneUser: approver,
      requestedBy: this.user.userId,
      refId: this.mrHeaderForm.get('headerId').value,
      refNo: this.mrHeaderForm.get('mrNo').value,
      remarks: this.approveForm.get('remark').value,
      details: 'Location : ' + this.location.value.toString(),
      isFinal: approveDtList[0]['isFinalApprove'],
      status: status,
    };

    this.salesOrderServices.saveApproveCenterDt(obj).subscribe((result) => {
      if (result == 1) {
        if (status == 'Waiting') {
          this.toastr.success('Approve sent is successfully !!!');
          this.mrHeaderForm.get('statusId').setValue(MRStatus.Waiting);
        } else if (status == 'Approve') {
          this.toastr.success('Approve successfully !!!');
          this.mrHeaderForm.get('statusId').setValue(MRStatus.Approve);
        } else if (status == 'Reject') {
          this.toastr.success('Reject successfully !!!');
          this.mrHeaderForm.get('statusId').setValue(MRStatus.Reject);
        }
        this.status = this.mrHeaderForm.get('statusId').value;
        this.statusName = MRStatus[this.status];
        this.approveModal.close();
      } else if (result == -1) {
        this.toastr.success('Approve details already exists !!!');
      } else {
        this.toastr.warning('Contact Admin. Error No:- ' + result.toString());
      }
    });
  }

  clearMRSearchControls() {
    this.mrListForm.get('prodCat').setValue('');
    this.mrListForm.get('searchSite').setValue('');
    this.mrListForm.get('status').setValue('');
    this.mrListForm.get('searchMRNo').setValue('');
    this.mrListForm.get('createdBy').setValue('');
    this.mrListForm.get('searchArticle').setValue('');
    this.mrListForm.get('createdDate').setValue('');
    this.mrListForm.get('reqDate').setValue('');
  }

  printMR() {
    if (this.printButton == true) {
      // this.router.navigate(['/boldreport']);
      var obj = {
        MRHeaderId: this.mrHeaderForm.get('headerId').value,
        reportName: 'MaterialRequestPrint',
      };

      /// STORE OBJECT IN LOCAL STORAGE
      localStorage.setItem('params', JSON.stringify(obj));
      window.open('/boldreport', '_blank');
    } else {
      this.toastr.error('Print Permission denied !!!');
    }
  }

  cancelMR() {
    var obj = {
      mrHeaderId: this.mrHeaderForm.get('headerId').value,
      createUserId: this.user.userId,
    };

    this.materialRequestServices.cancelMR(obj).subscribe((result) => {
      if (result == 1) {
        this.toastr.success('MR cancel Successfully !!!');
        this.mrHeaderForm.get('statusId').setValue(MRStatus.Closed);
        this.status = MRStatus.Closed;
        this.statusName = MRStatus[MRStatus.Closed];
      } else if (result == -1) {
        this.toastr.warning('Indent already created, Cancel Failed !!!');
      } else {
        this.toastr.warning('Contact Admin. Error No:- ' + result.toString());
      }
    });
  }
}
