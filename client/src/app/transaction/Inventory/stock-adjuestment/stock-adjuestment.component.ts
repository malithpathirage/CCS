import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxComboComponent, IgxDialogComponent, IgxGridComponent } from 'igniteui-angular';
import { Size } from 'src/app/_models/size';
import { ToastrService } from 'ngx-toastr';
import { Color } from 'src/app/_models/color';
import { StoreSite } from 'src/app/_models/storeSite';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';
import { StockadjuesmentService } from '_services/stockadjuesment.service';

@Component({
  selector: 'app-stock-adjuestment',
  templateUrl: './stock-adjuestment.component.html',
  styleUrls: ['./stock-adjuestment.component.scss'],
})
export class StockAdjuestmentComponent implements OnInit {
  stockAdjForm: FormGroup;
  stockAdjDetForm: FormGroup;

  saveButton: boolean = false;
  updateButton: boolean = false;
  isArticle: boolean = false;

  user: User;
  siteList: StoreSite[];
  stockAdjList: any;
  curentStockList: any;
  colorList: Color[];
  sizeList: Size[];
  reasonList: any;
  rowId: number = 0;
  isStockAdj: boolean = false;
  isNew: boolean = false;

  public dateOptions = {
    format: 'yyyy-MM-dd',
  };
  public formatDateOptions = this.dateOptions;

  @ViewChild('site', { read: IgxComboComponent })
  public site: IgxComboComponent;
  @ViewChild('size', { read: IgxComboComponent })
  public size: IgxComboComponent;
  @ViewChild('reason', { read: IgxComboComponent })
  public reason: IgxComboComponent;
  @ViewChild('color', { read: IgxComboComponent })
  public color: IgxComboComponent;
  @ViewChild('articleDialog', { read: IgxDialogComponent })
  public articleDialog: IgxDialogComponent;
  @ViewChild('stockAdjGrid', { static: true })
  public stockAdjGrid: IgxGridComponent;
  @ViewChild('curentStockGrid', { static: true })
  public curentStockGrid: IgxGridComponent;

  @ViewChild('dialog', { read: IgxDialogComponent })
  public dialog: IgxDialogComponent;
  @ViewChild('savedialog', { read: IgxDialogComponent })
  public savedialog: IgxDialogComponent;
  @ViewChild('stockDialog', { read: IgxDialogComponent })
  public stockDialog: IgxDialogComponent;

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private stockadjuesmentService: StockadjuesmentService,
    private masterServices: MasterService
  ) {}

  ngOnInit() {
    this.initilizeForm();
    this.loadStoreSite();
    this.loadStockAdjuestmentReason();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    let authMenus = this.user.permitMenus;
    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 2277).length > 0) {
        this.updateButton = true;
      }
      if (authMenus.filter((x) => x.autoIdx == 2278).length > 0) {
        this.saveButton = true;
      }
    }

    this.stockAdjForm = this.fb.group({
      site: ['', Validators.required],
    });

    this.stockAdjDetForm = this.fb.group({
      autoId: [0],
      stockId: [0],
      articleId: [0],
      articleName: [{value:'' , disabled:true}, Validators.required],
      articleCode: [{value:'' , disabled:true}],
      color: ['', Validators.required],
      size: ['', Validators.required],
      stockQty: [{value:0 , disabled:true}],
      correction: ['', Validators.required],
      uom: [{value:'', disabled:true}],
      uomId: [0],
      price: [0],
      remarks: [''],
      expiryDate: [''],
      reason:[''],
    });
  }

  singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
    }
  }

  loadStockAdjuestmentReason() {
    this.masterServices.getStockAdjuestmentReason().subscribe(res => {
      this.reasonList = res;
    });
  }

  loadStoreSite() {
    this.masterServices.getStoreSite().subscribe((result) => {
      this.siteList = result;
    });
  }

  onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  addArticle() {
    this.isStockAdj = false;
    this.isNew = true;
    this.articleDialog.open();
  }

  addNewArticle(event) {
    this.articleDialog.close();
    this.loadColor(event[0]['articleId']);
    this.loadSize(event[0]['articleId']);

    this.stockAdjDetForm.get('autoId').setValue(event[0]['autoId']);
    this.stockAdjDetForm.get('stockId').setValue(event[0]['stockId']);

    this.stockAdjDetForm.get('articleId').setValue(event[0]['articleId']);
    this.stockAdjDetForm.get('articleName').setValue(event[0]['articleName']);
    this.stockAdjDetForm.get('articleCode').setValue(event[0]['stockCode']);
    this.stockAdjDetForm.get('uom').setValue(event[0]['measurement']);
    this.stockAdjDetForm.get('uomId').setValue(event[0]['measurementId']);
  }

  loadColor(articleId) {
    this.masterServices.getArticleColor(articleId).subscribe((color) => {
      this.colorList = color;
    });
  }

  loadSize(articleId) {
    this.masterServices.getArticleSize(articleId).subscribe((size) => {
      this.sizeList = size;
    });
  }

  clearDetailsControls() {
    this.stockAdjDetForm.get('autoId').setValue(0);
    this.stockAdjDetForm.get('stockId').setValue(0);
    this.stockAdjDetForm.get('articleId').setValue(0);
    this.stockAdjDetForm.get('articleName').setValue('');
    this.stockAdjDetForm.get('articleCode').setValue('');
    this.stockAdjDetForm.get('uom').setValue('');
    this.stockAdjDetForm.get('uomId').setValue(0);
    this.stockAdjDetForm.get('stockQty').setValue('');
    this.stockAdjDetForm.get('price').setValue(0);
    this.stockAdjDetForm.get('expiryDate').setValue('');
    this.stockAdjDetForm.get('remarks').setValue('');
    this.stockAdjDetForm.get('color').setValue('');
    this.stockAdjDetForm.get('size').setValue('');
    this.stockAdjDetForm.get('correction').setValue('');
    this.stockAdjDetForm.get('reason').setValue('');
    this.colorList = [];
    this.sizeList = [];
  }

  refreshControler() {
    this.stockAdjForm.get('site').setValue('');
    this.clearDetailsControls();
    this.stockAdjList = [];
    this.isNew = false;
    this.isStockAdj = false;
  }

  addArticleRow() {
    let reason = "";
    let reasonId = 0;
    let color = this.stockAdjDetForm.get('color').value[0];
    let size = this.stockAdjDetForm.get('size').value[0];
    let stockQty = this.stockAdjDetForm.get('stockQty').value;
    let price = this.stockAdjDetForm.get('price').value;
    let expiryDate = this.stockAdjDetForm.get('expiryDate').value;
    let remarks = this.stockAdjDetForm.get('remarks').value; 
    let correction = this.stockAdjDetForm.get('correction').value;
    let autoId = this.stockAdjDetForm.get('autoId').value;

    if(this.isStockAdj == true) {
      reasonId = this.stockAdjDetForm.get('reason').value[0];
      reason = this.reason.value;
      if(reasonId != undefined) {
        let reasonRow = this.reasonList.filter(x => x.reasonId == reasonId);
        if (reasonRow[0]['sign'] == '-') {
          correction = -1 * correction;
        }        
      }      
    }    
    
    const selectedRowData = this.stockAdjGrid.data.filter((record) => {
      return record.autoId == autoId;
    }); 

    if (selectedRowData.length > 0) {
      this.stockAdjGrid.updateCell(color, autoId, 'colorId');
      this.stockAdjGrid.updateCell(size, autoId, 'sizeId');
      this.stockAdjGrid.updateCell(this.color.value, autoId, 'color');
      this.stockAdjGrid.updateCell(this.size.value, autoId, 'size');
      this.stockAdjGrid.updateCell(stockQty, autoId, 'stockQty');
      this.stockAdjGrid.updateCell(correction, autoId, 'correction');
      this.stockAdjGrid.updateCell(price, autoId, 'price');
      this.stockAdjGrid.updateCell(expiryDate, autoId, 'expiryDate');
      this.stockAdjGrid.updateCell(remarks, autoId, 'remarks');
      this.stockAdjGrid.updateCell(reason, autoId, 'reason');
      this.stockAdjGrid.updateCell(reasonId, autoId, 'reasonId');
    } else {
      let stockAdjuestment = {
        autoId: this.stockAdjDetForm.get('autoId').value,
        stockId: this.stockAdjDetForm.get('stockId').value,
        articleId: this.stockAdjDetForm.get('articleId').value,
        articleName: this.stockAdjDetForm.get('articleName').value,
        articleCode: this.stockAdjDetForm.get('articleCode').value,
        colorId: color,
        sizeId: size,
        color: this.color.value,
        size: this.size.value,
        unit: this.stockAdjDetForm.get('uom').value,
        unitId: this.stockAdjDetForm.get('uomId').value,
        stockQty: stockQty,
        correction: correction,
        price: price,
        expiryDate: expiryDate,
        remarks: remarks,
        reason: reason
      };
      this.stockAdjGrid.addRow(stockAdjuestment);
    }
    this.clearDetailsControls();
  }

  onDetailsEdit($event, cellId) {
    const ids = cellId.rowID;
    const selectedRowData = this.stockAdjGrid.data.filter((record) => {
      return record.autoId == ids;
    });

    this.loadColor(ids);
    this.loadSize(ids);

    if (selectedRowData.length > 0) {
      this.stockAdjDetForm.get('stockId')
        .setValue(selectedRowData[0]['stockId']);
      this.stockAdjDetForm.get('autoId')
        .setValue(selectedRowData[0]['autoId']);
      this.stockAdjDetForm.get('articleId')
        .setValue(selectedRowData[0]['articleId']);
      this.stockAdjDetForm.get('articleName')
        .setValue(selectedRowData[0]['articleName']);
      this.stockAdjDetForm.get('articleCode')
        .setValue(selectedRowData[0]['articleCode']);
      this.stockAdjDetForm.get('uom').setValue(selectedRowData[0]['unit']);
      this.stockAdjDetForm.get('uomId').setValue(selectedRowData[0]['unitId']);
      this.stockAdjDetForm.get('stockQty')
        .setValue(selectedRowData[0]['stockQty']);
      this.stockAdjDetForm.get('price').setValue(selectedRowData[0]['price']);
      this.stockAdjDetForm.get('expiryDate')
        .setValue(selectedRowData[0]['expiryDate']);
      this.stockAdjDetForm.get('remarks')
        .setValue(selectedRowData[0]['remarks']);
      this.stockAdjDetForm.get('reason')
        .setValue(selectedRowData[0]['reasonId']);

      setTimeout(() => {
        this.color.setSelectedItem(selectedRowData[0]['colorId'], true);
        this.size.setSelectedItem(selectedRowData[0]['sizeId'], true);
      }, 1000);
    }
  }

  onDialogOKSelected(event) {
    this.dialog.close();
    let cell: any = this.rowId;
    let ids = cell.rowID;
    this.stockAdjGrid.deleteRow(ids);
  }

  openItemDialog(event, cellId) {
    this.rowId = cellId;
    this.dialog.open();
  }

  onSaveSelected(event) {
    this.savedialog.close();

    if (this.validateDataGrid()) {
      let stockAdjList = [];
      let itemRows = this.stockAdjGrid.data;

      itemRows.forEach((items) => {
        let itemdata = {
          siteId: this.stockAdjForm.get('site').value[0],
          userId: this.user.userId,
          autoId: items.stockId,
          articleId: items.articleId,
          sizeId: items.sizeId,
          colorId: items.colorId,
          price: items.price,
          expireDate: items.expiryDate == "" ? null : items.expiryDate,
          stockQty: items.correction,
          remarks: items.remarks == undefined ? '' : items.remarks,
          reasonId: items.reasonId == undefined ? 0 : items.reasonId,
        };
        stockAdjList.push(itemdata);
      });

      this.stockadjuesmentService
        .saveStockAdjuestment(stockAdjList)
        .subscribe((result) => {
          if (result == 1) {
            this.toastr.success('Stock Adjuestment save Successfully !!!');
            this.refreshControler();
          } else {
            this.toastr.warning(
              'Contact Admin. Error No:- ' + result.toString()
            );
          }
        });
    }
  }

  validateDataGrid() {
    if (this.stockAdjGrid.dataLength < 1) {
      this.toastr.warning('Adjuestment data is required !!!');
      return false;
    }
    return true;
  }

  openDeleteDialog(event, cellId) {
    this.rowId = cellId;
    this.dialog.open();
  }

  editStock() {    
    if (this.validateControls()) {      
      this.isStockAdj = true;
      this.isNew = false;
      this.stockDialog.open();
      let siteId = this.stockAdjForm.controls.site.value[0];
      this.stockadjuesmentService.getInventoryDetails(siteId).subscribe((res) => {
          if (res.length > 0) {
            this.curentStockList = res;            
          }
        });
    }
  }

  validateControls() {
    if (this.stockAdjForm.controls.site.value[0] > 0) {
      return true;
    } else {
      this.toastr.warning('Site is required !!!');
      return false;
    }
  }

  checkSelectBox(selectedRowData) {
    setTimeout(() => {
      this.color.setSelectedItem(selectedRowData[0]['colorId'], true);
      this.size.setSelectedItem(selectedRowData[0]['sizeId'], true);
    }, 500);
  }  

  selectStock(event, cellId) {
    const ids = cellId.rowID;    
    const selectedRowData = this.curentStockGrid.data.filter((record) => {
      return record.autoId == ids;
    });
   
    if (selectedRowData.length > 0) {
      this.loadColor(selectedRowData[0]['articleId']);
      this.loadSize(selectedRowData[0]['articleId']);
      this.stockDialog.close();
      
      this.stockAdjDetForm.get('autoId').setValue(selectedRowData[0]['autoId']);
      this.stockAdjDetForm.get('stockId').setValue(selectedRowData[0]['stockId']);
      this.stockAdjDetForm.get('stockQty').setValue(selectedRowData[0]['stockQty']);
      this.stockAdjDetForm.get('price').setValue(selectedRowData[0]['price']);
      this.stockAdjDetForm.get('articleId').setValue(selectedRowData[0]['articleId']);
      this.stockAdjDetForm.get('articleName').setValue(selectedRowData[0]['articleName']);
      this.stockAdjDetForm.get('articleCode').setValue(selectedRowData[0]['stockCode']);
      this.stockAdjDetForm.get('uom').setValue(selectedRowData[0]['measurement']);
      this.stockAdjDetForm.get('uomId').setValue(selectedRowData[0]['measurementId']);
      this.checkSelectBox(selectedRowData);
    }
  }


}



