import { Component, EventEmitter, Input, OnInit, Output, SimpleChange, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IgxColumnComponent, IgxDialogComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { SalesorderService } from '_services/salesorder.service';

@Component({
  selector: 'app-salesorder-list',
  templateUrl: './salesorder-list.component.html',
  styleUrls: ['./salesorder-list.component.css']
})
export class SalesorderListComponent implements OnInit {  
  salesListForm: FormGroup;
  salesOrderNo: string = '';
  
  @ViewChild('indentsoGrid', { static: true })
  public indentsoGrid: IgxGridComponent;
  @ViewChild('salesListGrid', { static: true })
  public salesListGrid: IgxGridComponent;
  
  @ViewChild('deletedialog', { read: IgxDialogComponent })
  public deletedialog: IgxDialogComponent;

  indentSOList: any;  
  salesOrderList: any;
  rowId: number = 0;
  
  @Input() salesOrder;
  @Output() soChanged: EventEmitter<any> =   new EventEmitter();

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

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
  
  constructor(private fb: FormBuilder,
    private salesOrderServices: SalesorderService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initilizeForm();
  }
    
  ngOnChanges(changes: { [property: string]: SimpleChange }) {
    let change: SimpleChange = changes['salesOrder'];
    // console.log(change.currentValue["result"]);
    if (change.currentValue['result'] == 1) {
      this.refereshControls();
    }
  }

  initilizeForm() {
    this.salesListForm = this.fb.group({
      customerPO: ['', [Validators.maxLength(15)]],
    });
  }

  onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  /// FILER AND GET SALES ORDER DETAILS BY CUSTOMER REF
  public filterByCusRef(term) {
    if (term != '') {
      this.salesOrderServices.getSalesOrderDtList(term).subscribe(result => {
        this.salesOrderList = result
      });
    }
  }

  loadSalesOrderDt() {
    var selectedRows = this.salesListGrid.selectedRows;
    // var dublicate: boolean = false;

    if (selectedRows.length > 0) {
      selectedRows.forEach(item => {
        var rowLine = this.salesOrderList.filter(x => x.soDelId == item);
        // check item already added to the list or not 

        const rowData = this.indentsoGrid.data.filter((record) => {
          return record.soDelId == rowLine[0]["soDelId"];
        });

        if (this.salesOrderNo == '' || this.salesOrderNo == rowLine[0]["orderRef"])
        {
          if (rowData.length == 0) {
            this.salesOrderNo = rowLine[0]["orderRef"];
  
            var obj = {
              saleOrderNo: rowLine[0]["orderRef"],
              article: rowLine[0]["article"],
              color: rowLine[0]["color"],
              size: rowLine[0]["size"],
              uom: rowLine[0]["uom"],
              totQty: rowLine[0]["delQty"],
              unitPrice: rowLine[0]["price"],
              deliveryDate: rowLine[0]["deliveryDate"],
              articleId: rowLine[0]["articleId"],
              colorId: rowLine[0]["colorId"],
              sizeId: rowLine[0]["sizeId"],
              uomId: rowLine[0]["uomId"],
              soDelId: rowLine[0]["soDelId"],
              soHeaderId: rowLine[0]["soHeaderId"]
            }
            this.indentsoGrid.addRow(obj);
          }
          this.salesListGrid.deselectAllRows();
          this.soChanged.next(this.indentsoGrid.data);
        } else {
          this.toastr.warning('Sales Order No must be same !!!');
        }
      });      
    } else {
      this.toastr.warning('Sales Orders required !!!');
    }    
  }

  refereshControls() {
    this.salesListForm.get('customerPO').setValue('');
    this.salesOrderList = [];
    this.indentSOList =[];
  }

  openDeleteDialog(event, cellId) {
    this.rowId = cellId;
    this.deletedialog.open();
  }

  onDialogOKSelected(event) {
    event.dialog.close();
    this.onItemDelete(event, this.rowId);
  }

  onItemDelete(event, cellId) {
    const ids = cellId.rowID;
    this.indentsoGrid.deleteRow(ids);
  }

}
