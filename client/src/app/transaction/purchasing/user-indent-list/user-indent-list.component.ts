import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxComboComponent, IgxDialogComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { IndentStatus, IndentType } from 'src/app/_models/IndentDetails';
import { IndentDtDto } from 'src/app/_models/IndentDtDto';
import { IndentHdDto } from 'src/app/_models/IndentHdDto';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { IndentdetailsService } from '_services/indentdetails.service';
import { LocalService } from '_services/local.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-user-indent-list',
  templateUrl: './user-indent-list.component.html',
  styleUrls: ['./user-indent-list.component.css']
})
export class UserIndentListComponent implements OnInit {
  assignForm: FormGroup;
  indentHdList: IndentHdDto[];
  indentDtList: IndentDtDto[];
  assignedToList: any;
  
  user: User;
  locationList: any;
  indentNo: string = '';
  indentStatus: string;
  indentDate: string;
  assignTo: string;
  article: string;
  company:string;
  division: string;
  title: string;

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

  indentSubject: Subject<any> = new Subject<any>();

  @ViewChild('indentHdGrid', { static: true })
  public indentHdGrid: IgxGridComponent;
  @ViewChild('indentDialog', { read: IgxDialogComponent })
  public indentDialog: IgxDialogComponent;

  @ViewChild('assignedDialog', { read: IgxDialogComponent })
  public assignedDialog: IgxDialogComponent;

  @ViewChild('assignedTo', { read: IgxComboComponent })
  public assignedTo: IgxComboComponent;

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
  constructor(private indentdetailsService: IndentdetailsService,
    private accountService: AccountService,
    private toastr: ToastrService,
    private masterServices: MasterService,
    private router : Router,
    private fb: FormBuilder,
    private indentServices: IndentdetailsService) { }

  ngOnInit(): void {    
    this.initilizeForm();
    this.loadIndentHeader();
    this.loadAssignedTo();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    this.locationList = this.user.locations;

    this.assignForm = this.fb.group({
      assignedTo: ['', Validators.required]
    });
  }

  singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
    }
  }

  loadAssignedTo() {
    this.masterServices.getIntentUserMasterSetting().subscribe(result => {
      this.assignedToList = result
    });
  }

  onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  loadIndentHeader() {
    var obj = {
      categoryId : null,
      assignedTo: this.user.userId,
      type: IndentType.MRIndent
    };

    var userLocation = this.locationList.filter(x => x.isDefault == true);

    this.indentdetailsService.getIntentHeader(obj).subscribe(result => {
      result.forEach(item => {
        item.statusName = IndentStatus[item.status];        
        item.memberCompany = userLocation[0]["companyName"];
        item.division = userLocation[0]["location"];
      });
      
      this.indentHdList = result;      
    })
  }

  previewIndent(event, cellId) {
    event.preventDefault();
    var indentId = cellId.rowID;
    const rowData = this.indentHdGrid.data.filter((record) => {
      return record.indentHeaderId == indentId;
    });  

    this.title = rowData[0]["indentNo"] + ' - dated ' + rowData[0]["createdDate"]+ ' (' + rowData[0]["statusName"] + ')';
   
    /// OPEN DIALOG BOX   
    this.indentSubject.next(rowData);
    this.indentDialog.open();   
  }  

  onChangeAssignTo(){
    var selectedRows = this.indentHdGrid.selectedRows;

    if(selectedRows.length > 0) {
      this.assignedDialog.open();
    } else {
      this.toastr.warning("Select Indent rows !!!");
    }
  } 

  saveAssignTo() {
    var selectedRows = this.indentHdGrid.selectedRows;
    var indentList = [];   
    
    selectedRows.forEach(item => {
      var rowLine = this.indentHdList.filter(x => x.indentHeaderId == item);
      const rowData = this.indentHdGrid.data.filter((record) => {
        return record.indentHeaderId == rowLine[0]["indentHeaderId"];
      });

      rowData.forEach(ele => {
        var indent = {
          IndentHeaderId: ele.indentHeaderId
        }
        indentList.push(indent);
      });      
    });

    var obj = {
      assignTo : this.assignForm.get("assignedTo").value[0],
      IndentHeader: indentList,
      userId: this.user.userId
    }    

    // console.log(obj);
    this.indentServices.changeIntentAssignTo(obj).subscribe(result => {
      if (result == 1) {
        this.toastr.success('AssignTo change Successfully !!!');
        this.loadIndentHeader();
        this.assignedDialog.close();      
      } else {
        this.toastr.warning(
          'Contact Admin. Error No:- ' + result.toString()
        );
      }
    });
  }

  onAddPurchOrder(){
    var indentIds = this.indentHdGrid.selectedRows;  

    if (indentIds.length > 0 ) {
      if (this.validateCategory(indentIds)) {
        var obj = {
          indentHeaderId: indentIds.toString()
        };      
        // console.log(obj);
        this.indentServices.getIntentDetailsbyIds(obj).subscribe(result => {
          window.open('/PurchasingOrder', '_blank');
        });  
      }
    }    
  }

  validateCategory(indentIds) {
    //// check category 
    var category = 0;
    indentIds.forEach(item => {
      const rowData = this.indentHdGrid.data.filter((record) => {
        return record.indentHeaderId == item;
      });
      if (rowData.length > 0) {
        if (category == 0) {
          category = rowData[0]["categoryId"];
        } else if (category != rowData[0]["categoryId"]) {
          this.toastr.warning("category should be same !!!");          
          return false;
        }            
      }       
    });
    return true; 
  }

}
