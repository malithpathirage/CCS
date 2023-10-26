import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxComboComponent, IgxDialogComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { CostingDetails } from 'src/app/_models/costingDetails';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { SalesorderService } from '_services/salesorder.service';

@Component({
  selector: 'app-material-issue',
  templateUrl: './material-issue.component.html',
  styleUrls: ['./material-issue.component.css']
})
export class MaterialIssueComponent implements OnInit {
  minHeaderForm: FormGroup;
  minDetailsForm: FormGroup;
  user: User;
  isDisplayMode: boolean = false;
  saveButton: boolean = false;
  removeButton: boolean = false;
  pendMinList: CostingDetails[];
  pendFPOList: any;
  minDtList: any;

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

  @ViewChild('pendMinGrid', { read: IgxGridComponent, static: true })
  public pendMinGrid: IgxGridComponent;  
  @ViewChild('minDtGrid', { read: IgxGridComponent, static: true })
  public minDtGrid: IgxGridComponent;

  @ViewChild('savedialog', { read: IgxDialogComponent })
  public savedialog: IgxDialogComponent;

  @ViewChild('FPONo', { read: IgxComboComponent })
  public FPONo: IgxComboComponent;

  constructor( private accountService: AccountService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private salesOrderServices: SalesorderService) { }

  ngOnInit(): void {
    this.initilizeForm();
    this.getMINRefNo();
    this.loadPendFPOList();
  }

  initilizeForm() {
    var date: Date = new Date(Date.now());
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 2186).length > 0) {
        this.saveButton = true;
      }
      if (authMenus.filter((x) => x.autoIdx == 2187).length > 0) {
        this.removeButton = true;
      }
    }

    this.minHeaderForm = this.fb.group({
      minHeaderId: [0],
      userId: this.user.userId,
      minNo: [{value: '', disabled: true}, Validators.required],
      fpoId: ['', [Validators.required]],
      transDate: [{value: date , disabled: true}, Validators.required],
      fpoqty: [{ value: 0, disabled: true }],
    });

    this.minDetailsForm = this.fb.group({
      costDetailId: [0],
      costHeaderId: [0],
      costNo: [{ value: '', disabled: true } ,Validators.required],
      costGroupId: [0],
      costGroup: [{ value: '', disabled: true },Validators.required],
      articleId: [0],
      stockCode : [{ value: '', disabled: true },Validators.required],
      article: [{ value: '', disabled: true },Validators.required],
      colorId: [0],
      color: [{ value: '', disabled: true },Validators.required],
      sizeId: [0],
      size: [{ value: '', disabled: true },Validators.required],
      unitId: [0],
      unit: [{ value: '', disabled: true },Validators.required],
      requiredQty: ['', Validators.required],
      grossCon: [{ value: 0, disabled: true }],
      balQty: [{ value: 0, disabled: true }]
    });

    // this.fpoListForm = this.fb.group({
    //   customerPO: ['', [Validators.maxLength(15)]],
    // })
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

  //// GENERATE NEW MIN NUMBER
  getMINRefNo() {
    this.minHeaderForm.get('minNo').setValue('');
    var Transtype = 'MINNo';
    this.salesOrderServices.getRefNumber(Transtype).subscribe((res) => {
      //console.log(refNo);
      this.minHeaderForm.get('minNo').setValue(res.refNo.toString());
    });
  }

  onFPONoSelect(event) {
    this.pendMinList = [];
    for (const item of event.added) {
      this.loadPendMINDetails(item);
    }
  }

  loadPendMINDetails(fpoId) {
    // this.salesOrderServices.getPendMINDetails(fpoId).subscribe(result => {
    //   this.pendMinList = result
    //   // console.log(this.pendMinList);
    // })
  }

  /// LOD SELECTED LINE TO FORM
  onPendingMINDown(event, cellId) {
    this.clearMINDetailControls();
    const ids = cellId.rowID;
    const selectedRowData = this.pendMinGrid.data.filter((record) => {
      return record.costDetailId == ids;
    });

    this.minDetailsForm.get('costDetailId')
      .setValue(selectedRowData[0]['costDetailId']);
    this.minDetailsForm.get('costHeaderId')
      .setValue(selectedRowData[0]['costHeaderId']);
    this.minDetailsForm.get('costNo')
      .setValue(selectedRowData[0]['refNo']);
    this.minDetailsForm.get('costGroupId').setValue(selectedRowData[0]['costGroupId']);
    this.minDetailsForm.get('costGroup').setValue(selectedRowData[0]['costGroup']);
    this.minDetailsForm.get('articleId')
      .setValue(selectedRowData[0]['articleId']);
    this.minDetailsForm.get('article')
      .setValue(selectedRowData[0]['articleName']);
      this.minDetailsForm.get('stockCode')
      .setValue(selectedRowData[0]['stockCode']);
    this.minDetailsForm.get('colorId').setValue(selectedRowData[0]['colorId']);
    this.minDetailsForm.get('color').setValue(selectedRowData[0]['color']);
    this.minDetailsForm.get('sizeId').setValue(selectedRowData[0]['sizeId']);
    this.minDetailsForm.get('size').setValue(selectedRowData[0]['size']);
    this.minDetailsForm.get('grossCon').setValue(selectedRowData[0]['grossCon']);
    this.minDetailsForm.get('unitId')
      .setValue(selectedRowData[0]['unitId']);
    this.minDetailsForm.get('unit').setValue(selectedRowData[0]['unit']);
    
  }

  addMINDetails() {   
      var costDetailId = this.minDetailsForm.get('costDetailId').value;

      var selectRowData = this.minDtGrid.data.filter((record) => {
        return record.costDetailId == costDetailId;
      });

      var requiredQty = this.minDetailsForm.get('requiredQty').value;

      //// CHECK INVOICE LINE ADDED OR NOT
      if (selectRowData.length > 0) {
        this.minDtGrid.updateCell(requiredQty, costDetailId, 'requiredQty');
      } else {
        this.pendMinGrid.updateCell(true, costDetailId, 'status');
        var obj = {
          costDetailId: this.minDetailsForm.get('costDetailId').value,
          costHeaderId: this.minDetailsForm.get('costHeaderId').value,
          refNo: this.minDetailsForm.get('costNo').value,
          costGroup: this.minDetailsForm.get('costGroup').value,
          costGroupId: this.minDetailsForm.get('costGroupId').value,
          articleId: this.minDetailsForm.get('articleId').value,
          stockCode: this.minDetailsForm.get('stockCode').value,
          articleName: this.minDetailsForm.get('article').value,
          colorId: this.minDetailsForm.get('colorId').value,
          color: this.minDetailsForm.get('color').value,
          sizeId: this.minDetailsForm.get('sizeId').value,
          size: this.minDetailsForm.get('size').value,
          requiredQty: requiredQty,
          unitId: this.minDetailsForm.get('unitId').value,
          unit: this.minDetailsForm.get('unit').value,
          grossCon: this.minDetailsForm.get('grossCon').value,          
        };
        // console.log(obj);
        this.minDtGrid.addRow(obj);
      }
      this.clearMINDetailControls();
  }

  clearMINDetailControls() {
    this.minDetailsForm.get('costDetailId').setValue(0);
    this.minDetailsForm.get('costHeaderId').setValue(0);
    this.minDetailsForm.get('costNo').setValue('');
    this.minDetailsForm.get('costGroupId').setValue(0);
    this.minDetailsForm.get('costGroup').setValue('');
    this.minDetailsForm.get('articleId').setValue(0);
    this.minDetailsForm.get('article').setValue('');
    this.minDetailsForm.get('stockCode').setValue('');
    this.minDetailsForm.get('colorId').setValue(0);
    this.minDetailsForm.get('color').setValue('');
    this.minDetailsForm.get('sizeId').setValue(0);
    this.minDetailsForm.get('size').setValue('');
    this.minDetailsForm.get('grossCon').setValue(0);
    this.minDetailsForm.get('unitId').setValue(0);
    this.minDetailsForm.get('unit').setValue('');
    this.minDetailsForm.get('requiredQty').setValue(0);
  }

  openConfirmDialog(event) {

  }

  refreshControls() {

  }

  onMINEdit(event, cellId) {
    const ids = cellId.rowID;
    const selectedRowData = this.minDtGrid.data.filter((record) => {
      return record.costDetailId == ids;
    });

    this.minDetailsForm.get('costDetailId')
      .setValue(selectedRowData[0]['costDetailId']);
    this.minDetailsForm.get('costHeaderId')
      .setValue(selectedRowData[0]['costHeaderId']);
    this.minDetailsForm.get('costNo')
      .setValue(selectedRowData[0]['refNo']);
    this.minDetailsForm.get('costGroupId').setValue(selectedRowData[0]['costGroupId']);
    this.minDetailsForm.get('costGroup').setValue(selectedRowData[0]['costGroup']);
    this.minDetailsForm.get('articleId')
      .setValue(selectedRowData[0]['articleId']);
    this.minDetailsForm.get('article')
      .setValue(selectedRowData[0]['articleName']);
      this.minDetailsForm.get('stockCode')
      .setValue(selectedRowData[0]['stockCode']);
    this.minDetailsForm.get('colorId').setValue(selectedRowData[0]['colorId']);
    this.minDetailsForm.get('color').setValue(selectedRowData[0]['color']);
    this.minDetailsForm.get('sizeId').setValue(selectedRowData[0]['sizeId']);
    this.minDetailsForm.get('size').setValue(selectedRowData[0]['size']);
    this.minDetailsForm.get('grossCon').setValue(selectedRowData[0]['grossCon']);
    this.minDetailsForm.get('unitId')
      .setValue(selectedRowData[0]['unitId']);
    this.minDetailsForm.get('unit').setValue(selectedRowData[0]['unit']);
  }

     //// save dialog confirmation to save
 onSaveSelected(event) {
  this.savedialog.close();
  // this.saveFPO();
 }

  loadPendFPOList() {
  //  this.salesOrderServices.getMINPendFPODetails().subscribe(result => {
  //    this.pendFPOList = result
  //  })  
  }

  saveMIN(){

  }

  


}



