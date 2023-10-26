import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxComboComponent, IgxDialogComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { IndentStatus, IndentType } from 'src/app/_models/IndentDetails';
import { IndentDtDto } from 'src/app/_models/IndentDtDto';
import { IndentHdDto } from 'src/app/_models/IndentHdDto';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { IndentdetailsService } from '_services/indentdetails.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-mr-indent-list',
  templateUrl: './mr-indent-list.component.html',
  styleUrls: ['./mr-indent-list.component.css']
})
export class MrIndentListComponent implements OnInit {
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
    private indentServices: IndentdetailsService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private masterServices: MasterService ) { } 

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
      indentHeaderId: [0],
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
      assignedTo: null,
      type: IndentType.MRIndent
    };

    var userLocation = this.locationList.filter(x => x.isDefault == true);

    this.indentdetailsService.getIntentHeader(obj).subscribe(result => {
      // console.log(result);
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

}
