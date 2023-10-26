import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxComboComponent, IgxDialogComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ApproveCenter } from 'src/app/_models/approveCenter';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { SalesorderService } from '_services/salesorder.service';

@Component({
  selector: 'app-approve-center',
  templateUrl: './approve-center.component.html',
  styleUrls: ['./approve-center.component.css'],
})
export class ApproveCenterComponent implements OnInit {
  approveList: ApproveCenter[];
  approveForm: FormGroup;
  validationErrors: string[] = [];
  user: User;
  saveButton: boolean = false;
  approveRoteList: any[];
  appButton: boolean = false;
  okButton: boolean = false;
  selectedRowData: any[];
  mrObj: any;

  public pWidth: string;
  public nWidth: string;
  public col: IgxColumnComponent;

  @ViewChild('approveGrid', { static: true })
  public approveGrid: IgxGridComponent;
  @ViewChild('approver', { read: IgxComboComponent })
  public approver: IgxComboComponent;
  @ViewChild('approveModal', { read: IgxDialogComponent })
  public approveModal: IgxDialogComponent;
  @ViewChild('mrDialog', { read: IgxDialogComponent })
  public mrDialog: IgxDialogComponent;

  eventsSubject: Subject<void> = new Subject<void>();

  constructor(
    public salesOrderServices: SalesorderService,
    private fb: FormBuilder,
    private accountService: AccountService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initilizeForm();
    this.loadApproveList();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });    

    this.approveForm = this.fb.group({
      approver: ['', Validators.required],
      isFinal: [false],
      remark: ['', [Validators.maxLength(250)]],
    });
  }

  public onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  //// ALOW SINGLE SILECTION ONLY COMBO EVENT
  singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
    }
  }

   ///// GET APPROVE ROUTING DETAILS BASED ON USER ID AND MODULE
   getApproveRouteDetails() {
    var isFinal = false;
    var obj = {
      userId: this.user.userId,
      module: this.selectedRowData[0]['moduleName']
    };

    this.salesOrderServices.getApproveRouteDetails(obj).subscribe((result) => {      
      this.approveRoteList = result["approveUsers"]; 
      var userList = result["userDetails"];
      /// check current user is final 
      if (userList.length > 0) {
        // console.log(result["userDetails"]);
          if (userList[0]["isFinalApprove"] == 1) {
            isFinal = true;
            this.approveForm.get('isFinal').setValue(true);
            this.approveForm.get('approver').disable();
            this.appButton = true;
            this.okButton = false;
          } else {
            isFinal = false;
            this.approveForm.get('isFinal').setValue(false);
            this.approveForm.get('approver').enable();
            this.appButton = false;
            this.okButton = true;
          }        
      }        
        this.approveModal.open();        
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

  loadApproveList() {
    var userId = this.user.userId;

    this.salesOrderServices.getApproveCenterDt(userId).subscribe((result) => {
      this.approveList = result;
    });
  }

  onApproveRoute(event, cellId) {
    var ids = cellId.rowID;
    this.selectedRowData = [];
    this.approveForm.get('approver').setValue('');
    this.approveForm.get('remark').setValue('');

    this.selectedRowData = this.approveGrid.data.filter((record) => {
      return record.autoId == ids;
    });

    if (this.selectedRowData[0]['moduleName'] == 'MR') {
      this.openMRModal(ids);
    } else {
      this.getApproveRouteDetails();
    }  
    
    // this.approveRouteCostSheet(selectedRowData);
  }

  //// APPROVE ROUTING PROCESS
  approveRouteCostSheet(status) {
    var obj = {
      autoId: this.selectedRowData[0]['autoId'],
      moduleName: this.selectedRowData[0]['moduleName'],
      assigneUser:
        this.approveForm.get('approver').value[0] == undefined
          ? 0
          : this.approveForm.get('approver').value[0],
      requestedBy: this.user.userId,
      refId: this.selectedRowData[0]['refId'],
      refNo: this.selectedRowData[0]['refNo'],
      remarks: this.approveForm.get('remark').value,
      details: this.selectedRowData[0]['details'],
      isFinal: this.approveForm.get('isFinal').value,
      status: status,
    };
    // console.log(obj);

    this.salesOrderServices.saveApproveCenterDt(obj).subscribe((result) => {
      if (result == 1) {
        if (status == 'Waiting') {
          this.toastr.success('Approve sent is successfully !!!');
        } else if (status == 'Approve') {
          this.toastr.success('Approve successfully !!!');
        } else if (status == 'Reject') {
          this.toastr.success('Reject successfully !!!');
        }
        this.approveModal.close();
        this.loadApproveList();
      } else if (result == -1) {
        this.toastr.success('Approve details already exists !!!');
      } else {
        this.toastr.warning('Contact Admin. Error No:- ' + result.toString());
      }
    });
  }

  openMRModal(ids) { 
    const rowData = this.approveGrid.data.filter((record) => {
      return record.autoId == ids;
    });

    this.mrObj = {
      mrHeaderId: rowData[0]["refId"],
      approveId: rowData[0]['autoId'],
      assigneUser: rowData[0]['assigneUser']
    };

    /// OPEN DIALOG BOX
    this.eventsSubject.next(this.mrObj);    
    this.mrDialog.open();
  }

  // previewCostSheet(event, cellId) {
  //   event.preventDefault();
  //   var ids = cellId.rowID;
  //   const rowData = this.approveGrid.data.filter((record) => {
  //     return record.autoId == ids;
  //   });

  //   // console.log(rowData);
  //   if (rowData[0]["moduleName"] == "Costing") {
  //     var obj = {
  //       costingHdId: rowData[0]["refId"],
  //       reportName: 'CostSheetFormat',
  //     };
  //     /// STORE OBJECT IN LOCAL STORAGE
  //     localStorage.setItem('params', JSON.stringify(obj));
  //     window.open('/boldreport', '_blank');
  //   } 
  // }

  previewDocument(event, cellId){
  event.preventDefault();
  var ids = cellId.rowID;
  const rowData = this.approveGrid.data.filter((record) => {
    return record.autoId == ids; 
  });
  
  if (rowData[0]["moduleName"] == "Costing") {
    var obj = {
    docId: rowData[0]["refId"],
    moduleId:rowData[0]["moduleId"],
    reportName: "CostSheetFormat"
    };
    /// STORE OBJECT IN LOCAL STORAGE
    localStorage.setItem('params', JSON.stringify(obj));
    window.open('/boldreport', '_blank');
    }else if (rowData[0]["moduleName"] == "Booking Request") {
    var obj = {
    docId: rowData[0]["refId"],
    moduleId:rowData[0]["moduleId"],
    reportName: "BookingRequest"
    };
    /// STORE OBJECT IN LOCAL STORAGE
    localStorage.setItem('params', JSON.stringify(obj));
    window.open('/boldreport', '_blank');
  }
}

  refreshApproveCenter(event) {
    if(event == 1) {
      this.mrDialog.close();
      this.loadApproveList();
    }
  }
}

