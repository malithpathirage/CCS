import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxComboComponent, IgxDialogComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { Category } from 'src/app/_models/category';
import { MRStatus } from 'src/app/_models/mrHeader';
import { StoreSite } from 'src/app/_models/storeSite';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MaterialrequestService } from '_services/materialrequest.service';
import { SalesorderService } from '_services/salesorder.service';

@Component({
  selector: 'app-material-request-approve',
  templateUrl: './material-request-approve.component.html',
  styleUrls: ['./material-request-approve.component.css']
})
export class MaterialRequestApproveComponent implements OnInit {
  mrHeaderForm: FormGroup;
  mrDetailsForm: FormGroup;
  approveForm: FormGroup;

  approveRoteList: any[];
  categoryList: Category[];
  assignedToList: any;
  locationList: Location[];
  siteList: StoreSite[];
  allArticleList: any[];
  mrDetailsList: any[];
  stockList: any[];
  status: MRStatus;
  user: User;  
  mrObj: any;

  saveButton: boolean = false;
  appButton: boolean = false;
  okButton: boolean = false;
  
  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;
  validationErrors: string[] = [];

  @Input() events: Observable<void>;
  @Output() newItemEvent = new EventEmitter<any>();
  private eventsSubscription: Subscription;  

  @ViewChild('mrDetailsGrid', { static: true })
  public mrDetailsGrid: IgxGridComponent;
  @ViewChild('stockDetailsGrid', { static: true })
  public stockDetailsGrid: IgxGridComponent;

  @ViewChild('approver', { read: IgxComboComponent })
  public approver: IgxComboComponent;
 
  @ViewChild('approveModal', { read: IgxDialogComponent })
  public approveModal: IgxDialogComponent;
  @ViewChild('stockModal', { read: IgxDialogComponent })
  public stockModal: IgxDialogComponent;

   //// FORMAT PRICE
   public options = {
    digitsInfo: '1.2-2',
    currencyCode: '',
  };
  public formatPrice = this.options;

    // Date options
    public dateOptions = {
      format: 'yyyy-MM-dd'
    };  
    public formatDateOptions = this.dateOptions;    

  constructor(private accountService: AccountService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private materialRequestServices: MaterialrequestService,
    private salesOrderServices: SalesorderService ) { }

  ngOnInit(): void {    
    this.initilizeForm();
    this.checkLocalStorage();
  } 

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

  initilizeForm() {
    var date: Date = new Date(Date.now());
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 153).length > 0) {
        this.saveButton = true;
      }     
    }

    this.mrHeaderForm = this.fb.group({
      headerId: [0],
      userId: this.user.userId,
      mrNo: [{ value: '', disabled: true }],
      prodCategory:[{ value: '', disabled: true }],
      assignedTo: [{ value: '', disabled: true }],   
      location: [{ value: '', disabled: true }],   
      site: [{ value: '', disabled: true }],
      trnsDate: [{ value: date, disabled: true }],
      isFinal:[false],
      assigneUser:[0],
      approveId:[0],
      assignedToId:[0],
      locationId:[0]
    }); 
    
    this.mrDetailsForm = this.fb.group({
      detailsId: [0],
      articleName: [{ value: '', disabled: true }],
      color: [{ value: '', disabled: true }],
      size: [{ value: '', disabled: true }],
      uom: [{ value: '', disabled: true }],
      unitPrice: [{ value: 0 , disabled: true}],
      reqQty: [{ value: '', disabled: true }],
      approveQty: [null]      
    });   

    this.approveForm = this.fb.group({
      approver: ['', Validators.required],
      remark: ['', [Validators.maxLength(250)]],
    });
  }

  
   ///// GET APPROVE ROUTING DETAILS BASED ON USER ID AND MODULE
   getApproveRouteDetails() {
    var isFinal = false;
    var obj = {
      userId: this.user.userId,
      module: "MR"
    };
    this.salesOrderServices.getApproveRouteDetails(obj).subscribe((result) => {  
      
      this.approveRoteList = result["approveUsers"]; 
      var userList = result["userDetails"];
      /// check current user is final 
      if (userList.length > 0) {
        console.log(result["userDetails"]);
          if (userList[0]["isFinalApprove"] == 1) {
            isFinal = true;
            this.mrHeaderForm.get('isFinal').setValue(true);
            this.approveForm.get('approver').disable();
            this.appButton = true;
            this.okButton = false;
          } else {
            isFinal = false;
            this.mrHeaderForm.get('isFinal').setValue(false);
            this.approveForm.get('approver').enable();
            this.appButton = false;
            this.okButton = true;
          }        
      }        
    },
    (err) => console.error(err),
    () => {
      /// check if and only approval list available and current user is not final 
      if (this.approveRoteList.length >0 && isFinal == false) {
          this.setDefaultUser();
      }        
    });
  }
  
  setDefaultUser() {
    setTimeout(() => {
      //// SELECT DEFAULT USER 
      var defaultUser = this.approveRoteList.filter(x => x.isDefault == true);
      if (defaultUser.length > 0)
        this.approver.setSelectedItem( defaultUser[0]["idAgents"] ,true);
    }, 500);
  }

  checkLocalStorage() {    
    this.eventsSubscription = this.events.subscribe((result) => {
      this.mrObj = result;

    if (this.mrObj != null) {
      this.mrHeaderForm.get('headerId').setValue(this.mrObj["mrHeaderId"]);      
      this.mrHeaderForm.get('assigneUser').setValue(this.mrObj["assigneUser"]);      
      this.mrHeaderForm.get('approveId').setValue(this.mrObj["approveId"]);
      this.loadMRDetails();
      this.getApproveRouteDetails();
    }
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

    loadMRDetails() {
      // this.appClicked = false;
      var headerId = this.mrHeaderForm.get('headerId').value;
      this.materialRequestServices.getMaterialRequestDt(headerId).subscribe(result => {
        if (result.length > 0) {
          console.log(result);
          var detailList = [];
          this.mrHeaderForm.get('headerId').setValue(result[0]["mrHeaderId"])
          this.mrHeaderForm.get('mrNo').setValue(result[0]["mrNo"]);
          this.mrHeaderForm.get('prodCategory').setValue(result[0]["category"]);
          this.mrHeaderForm.get('assignedTo').setValue(result[0]["agentName"]);
          this.mrHeaderForm.get('location').setValue(result[0]["location"]);
          this.mrHeaderForm.get('site').setValue(result[0]["siteName"]);
          this.mrHeaderForm.get('assignedToId').setValue(result[0]["assignedTo"]);
          this.mrHeaderForm.get('locationId').setValue(result[0]["locationId"]);

          for (let index = 0; index < result.length; index++) {
            var reqireDate = this.datePipe.transform(result[index]["requireDate"], 'yyyy-MM-dd');
            var itemdata = {
              detailsId: result[index]["mrDetailsId"],
              articleId: result[index]["articleId"],
              sizeId: result[index]["sizeId"],
              colorId: result[index]["colorId"],
              reqQty: result[index]["reqQty"],
              approveQty: result[index]["reqQty"],
              rate: result[index]["unitPrice"],
              requireDate: reqireDate,
              uomId: result[index]["uomId"],              
              size: result[index]["size"],            
              color: result[index]["color"],           
              articleName: result[index]["articleName"],
              articleCode: result[index]["stockCode"],            
              uom: result[index]["unit"]
            };
            detailList.push(itemdata);
          }
          this.mrDetailsList = detailList;
        }
      });
      
    }

    clearMRDetailsControls() {       
      this.mrDetailsForm.reset();    
      this.mrDetailsForm.get('detailsId').setValue(0);
      this.mrDetailsForm.get('size').setValue(0);
      this.mrDetailsForm.get('color').setValue(0);
      this.mrDetailsForm.get('reqQty').setValue('');
      this.mrDetailsForm.get('articleName').setValue('');    
      this.mrDetailsForm.get('approveQty').setValue(null);
      this.mrDetailsForm.get('uom').setValue('');
      this.mrDetailsForm.get('unitPrice').setValue(0);
    }

    /// ADD NEW ITEM TO GRID / UPDATE
  addMRDetailsRow() {
      // var totAppQty = 0;
      var detailsId = this.mrDetailsForm.get('detailsId').value;
      var approveQty = this.mrDetailsForm.get('approveQty').value;
      var reqQty = this.mrDetailsForm.get('reqQty').value;
    
      if (reqQty < approveQty) {
        this.toastr.warning("Invalid Approve Qty");
        return;
      } else {
        this.mrDetailsGrid.updateCell(approveQty, detailsId, 'approveQty');
      }

      this.clearMRDetailsControls();
    }

   
  //// APPROVE ROUTING PROCESS
  approveRouteMR(status) {
    var detailList =[];

    var header = {
      mrHeaderId: this.mrHeaderForm.get('headerId').value,
      // assignUser: this.mrHeaderForm.get('assigneUser').value,
      assignUser:
        this.approveForm.get('approver').value[0] == undefined
          ? 0
          : this.approveForm.get('approver').value[0],
      refNo: this.mrHeaderForm.get('mrNo').value,
      remarks: this.approveForm.get('remark').value,
      isFinal: this.mrHeaderForm.get('isFinal').value,
      statusId : MRStatus[status],
      userId: this.user.userId,
      approveId : this.mrHeaderForm.get('approveId').value,      
      assignedTo: this.mrHeaderForm.get('assignedToId').value,
      locationId: this.mrHeaderForm.get('locationId').value
    };
    // console.log(obj);

    var itemRows = this.mrDetailsGrid.data;

    itemRows.forEach((items) => {
      var itemdata = {
        mrDetailsId: items.detailsId,
        articleId: items.articleId,
        sizeId: items.sizeId,
        colorId: items.colorId,
        approveQty: items.approveQty,
        uomId: items.uomId
      };
      detailList.push(itemdata);
    });

    var obj = {
      approveMRHeader : header,
      approveMRDetails: detailList
     }
     console.log(obj);
    this.materialRequestServices.approveMR(obj).subscribe((result) => {
      if (result == 1) {
        if (status == 'Approve') {
          this.toastr.success('Approve successfully !!!');
        } else if (status == 'Reject') {
          this.toastr.success('Reject successfully !!!');          
        }
        this.approveModal.close();
        this.newItemEvent.emit(result);
      } else {
        this.toastr.warning('Contact Admin. Error No:- ' + result.toString());
      }
    });
  }
  
  onDetailsEdit(event, cellId) {    
      this.clearMRDetailsControls();
      const ids = cellId.rowID;

      const selectedRowData = this.mrDetailsGrid.data.filter((record) => {
        return record.detailsId == ids;
      });

      if (selectedRowData.length > 0) {
        var article = selectedRowData[0]['articleName'] + '-' + selectedRowData[0]['articleCode'];
        this.mrDetailsForm.get('detailsId')
          .setValue(selectedRowData[0]['detailsId']);
        this.mrDetailsForm.get('articleName').setValue(article);
        this.mrDetailsForm.get('uom').setValue(selectedRowData[0]['uom']);
        this.mrDetailsForm.get('color')
          .setValue(selectedRowData[0]['color']);
        this.mrDetailsForm.get('size').setValue(selectedRowData[0]['size']);
        this.mrDetailsForm.get('reqQty')
          .setValue(selectedRowData[0]['reqQty']);
        this.mrDetailsForm.get('unitPrice')
          .setValue(selectedRowData[0]['rate']);
        this.mrDetailsForm.get('approveQty')
          .setValue(selectedRowData[0]['approveQty']);
      }   
    
  }
  
  getStockDetails() {
    let mrHeaderId = this.mrHeaderForm.controls.headerId.value;
    console.log(mrHeaderId);
    this.materialRequestServices.getInventoryStock(mrHeaderId).subscribe(res => {
      console.log(res);
      if(res.length > 0) {
        this.stockModal.open();
        this.stockList = res;
      } else {
        this.toastr.warning("Can't find the Stock details");
      }
    });
  }

}
