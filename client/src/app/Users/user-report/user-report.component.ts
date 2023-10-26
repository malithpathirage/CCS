import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { ReportList } from 'src/app/_models/ReportList';
import { PermitUser } from 'src/app/_models/permitUser';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { AdminService } from '_services/admin.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-user-report',
  templateUrl: './user-report.component.html',
  styleUrls: ['./user-report.component.css']
})
export class UserReportComponent implements OnInit {
  user: User;
  userReportForm: FormGroup;
  permitUsers: PermitUser[];
  permitReports: ReportList [];
  nPermitReports: ReportList [];
  removeButton = false;
  saveButton = false;


  @ViewChild('notPermitMgrid', { static: true })
  public notPermitMgrid: IgxGridComponent;
  @ViewChild('PermitMgrid', { static: true })
  public PermitMgrid: IgxGridComponent;		

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;


  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    public adminServices: AdminService,
    private toastr: ToastrService,
    private masterServices: MasterService
  ) { }

  ngOnInit(): void {
    this.initilizeForm();
    this.loadPermitedUsers();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    this.userReportForm = this.fb.group({
      AgentId: this.user.userId,
      Agent: ['', Validators.required],
    });
  }
    /// combo on selection change event loads menus detail
    loadReportEvent(event) {
      /// clear grid data
      
      this.clearGridRows();
      for (const item of event.added) {
        this.loadUserReportList(item);
      }
    }

  /// loads Report details related to the selected user
  loadUserReportList(userId) {
    this.adminServices.getUserReportList(userId).subscribe((Report) => {
      console.log(Report);
        this.permitReports = Report.filter((x) => x.isPermit == 1);
        this.nPermitReports = Report.filter((x) => x.isPermit == 0);
    });
  }


  loadPermitedUsers() {
    this.adminServices.getPermitedUsers().subscribe((userList) => {
      this.permitUsers = userList;
    });
  }

  public onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  public singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
      //console.log(event.newSelection);
    }
  }

  deleteUserReportList(){
    if (this.removeButton == true) {
      var selectedRows = this.PermitMgrid.selectedRows;
      var selUserId = this.userReportForm.get('Agent').value[0];
      var reportList = [];

      selectedRows.forEach((autoId) => {
        var data = {
          agentId: selUserId,
          reportId: autoId,
          creUserID: this.user.userId,
        };
        reportList.push(data);
      });
      
      this.masterServices.deleteUserReportList(reportList).subscribe((result) => {
        if (result == 1) {
          this.toastr.success('User Report delete Successfully !!!');
          this.clearGridRows();
          this.loadUserReportList(selUserId);
        } else if (result == -1) {
          this.toastr.warning('User Report delete failed !!!');
          this.clearGridRows();
          this.loadUserReportList(selUserId);
        } else {
          this.toastr.error('Contact Admin. Error No:- ' + result.toString());
        }
      });


    }else {
      this.toastr.error('delete Permission denied !!!');
    }
  }

  saveUserReportList(){
    if (this.saveButton == true) {
      var selectedRows = this.notPermitMgrid.selectedRows;
      var selUserId = this.userReportForm.get('Agent').value[0];
      var reportList = [];

      selectedRows.forEach((autoId) => {
        var data = {
          agentId: selUserId,
          reportId: autoId,
          creUserID: this.user.userId,
        };
        reportList.push(data);
      });
      
      this.masterServices.saveUserReportList(reportList).subscribe((result) => {
        if (result == 1) {
          this.toastr.success('User Report save Successfully !!!');
          this.clearGridRows();
          this.loadUserReportList(selUserId);
        } else if (result == -1) {
          this.toastr.warning('User Report save failed !!!');
          this.clearGridRows();
          this.loadUserReportList(selUserId);
        } else {
          this.toastr.error('Contact Admin. Error No:- ' + result.toString());
        }
      });


    }else {
      this.toastr.error('Save Permission denied !!!');
    }

  }

  getButtonPermission() {
    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 32).length > 0) {
        this.saveButton = true;
      }
      if (authMenus.filter((x) => x.autoIdx == 33).length > 0) {
        this.removeButton = true;
      }
    }
  }

  clearControls() {
    this.clearGridRows();
    this.userReportForm.get('Agent').setValue('');
  }
  clearGridRows() {
    this.PermitMgrid.deselectAllRows();
    this.notPermitMgrid.deselectAllRows();
    this.permitReports = [];
    this.nPermitReports = [];
  }
}
