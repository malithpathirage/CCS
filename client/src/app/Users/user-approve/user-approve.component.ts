import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxCheckboxComponent, IgxColumnComponent, IgxComboComponent, IgxDialogComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { MenuList } from 'src/app/_models/menuList';
import { PermitUser } from 'src/app/_models/permitUser';
import { User } from 'src/app/_models/user';
import { UserAppModules } from 'src/app/_models/userAppModules';
import { AccountService } from '_services/account.service';
import { AdminService } from '_services/admin.service';
import { RegisterService } from '_services/register.service';

@Component({
  selector: 'app-user-approve',
  templateUrl: './user-approve.component.html',
  styleUrls: ['./user-approve.component.css']
})
export class UserApproveComponent implements OnInit {
  user: User;
  userObj: User;
  appModuleForm: FormGroup;
  appUsersForm: FormGroup;
  moduleList: MenuList[];
  permitUsers: PermitUser[];
  userAppModList: UserAppModules[];
  removeAMButton = false;
  saveAMButton = false;
  removeAUButton = false;
  saveAUButton = false;
  validationErrors: string[] = [];
  userList: any;
  rowId: number = 0;

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

  @ViewChild('moduleGrid', { static: true })
  public moduleGrid: IgxGridComponent;
  @ViewChild('userGrid', { static: true })
  public userGrid: IgxGridComponent;

  @ViewChild('chkBuyPass', { read: IgxCheckboxComponent })
  public chkBuyPass: IgxCheckboxComponent;  
  @ViewChild('chkIsDefault', { read: IgxCheckboxComponent })
  public chkIsDefault: IgxCheckboxComponent; 
  @ViewChild('chkIsFinalApprove', { read: IgxCheckboxComponent })
  public chkIsFinalApprove: IgxCheckboxComponent; 

  @ViewChild('cmbmodule', { read: IgxComboComponent })
  public cmbmodule: IgxComboComponent;
  @ViewChild('cmbApprover', { read: IgxComboComponent })
  public cmbApprover: IgxComboComponent;

  @ViewChild('appModuledialog', { read: IgxDialogComponent })
  public appModuledialog: IgxDialogComponent;
  @ViewChild('appUserdialog', { read: IgxDialogComponent })
  public appUserdialog: IgxDialogComponent;

  constructor( private accountService: AccountService,
    private fb: FormBuilder,
    public adminServices: AdminService,
    private registerService: RegisterService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initilizeForm();
    this.loadModuleList();
    this.loadPermitedUsers();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 1181).length > 0) {
        this.saveAMButton = true;
      } if (authMenus.filter((x) => x.autoIdx == 1179).length > 0) {
        this.removeAMButton = true;
      } if (authMenus.filter((x) => x.autoIdx == 1182).length > 0) {
        this.saveAUButton = true;
      } if (authMenus.filter((x) => x.autoIdx == 1180).length > 0) {
        this.removeAUButton = true;
      }
    }

    this.appModuleForm = this.fb.group({
      autoId: [0],
      user: ['', Validators.required],
      module: ['', Validators.required],
      buyPass: [false]
    });

    this.appUsersForm = this.fb.group({
      autoId: [0],
      armId: [0],
      approver: ['', Validators.required],
      isDefault: [false],
      isFinalApprove: [false]
    });
  }

  /// LOADS PERMITED USER LIST
  loadPermitedUsers() {
    this.adminServices.getPermitedUsers().subscribe((userList) => {
      this.permitUsers = userList;
      // console.log(this.permitUsers);
    });
  }

  //// ON USER SELECT EVENT
  onUserSelect(event) {
    this.userAppModList = [];
    for (const item of event.added) {
      this.getUserAppModuleList(item);
    }
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

  /// LOADS MODULE LIST FROM MASTER MENU 
  loadModuleList() {
    this.adminServices.getModuleList().subscribe(result => {
      this.moduleList = result
    });
  }

  //// GET APPROVEL MODULE LIST BASED ON SELECTED USER
  getUserAppModuleList(userId) {
    this.adminServices.getUserAppModuleList(userId).subscribe(result => {
      this.userAppModList = result
      // console.log(this.userAppModList);
    })
  }  

  //// OPEN APPROVEL USER MODAL
  onApproveUser(event,cellId) {
    const id = cellId.rowID;
    this.appUsersForm.get('armId').setValue(id);

    this.getApprovalUserList(id);
  }

  //// EDIT APPROVAL MODULE
  onEditApproveModule(event,cellId) {
    const id = cellId.rowID;

    const selectedRowData = this.moduleGrid.data.filter((record) => {
      return record.autoId == id;
    });

    this.appModuleForm.get('autoId').setValue(id);
    this.cmbmodule.setSelectedItem(selectedRowData[0]["menuId"],true);
    // this.appModuleForm.get('module').setValue(selectedRowData[0]["menuId"]);
    this.appModuleForm.get('buyPass').setValue(selectedRowData[0]["buyPass"]);
  }

  /// EDIT APPROVEL USER
  onEditApproveUser(event,cellId) {
    const id = cellId.rowID;

    const selectedRowData = this.userGrid.data.filter((record) => {
      return record.autoId == id;
    });

    this.appUsersForm.get('autoId').setValue(id);
    this.cmbApprover.setSelectedItem(selectedRowData[0]["idAgents"],true);
    this.appUsersForm.get('isDefault').setValue(selectedRowData[0]["isDefault"]);
    this.appUsersForm.get('isFinalApprove').setValue(selectedRowData[0]["isFinalApprove"]);
  }

  //// CONFIRM APPROVAL MODULE DELATE
  openAMDeleteDialog(event, cellId) {
    this.rowId = cellId.rowID;
    this.appModuledialog.open();
  }

  /// CONFIRM APPROVAL USER DELETE
  openAUDeleteDialog(event, cellId) {
    this.rowId = cellId.rowID;
    this.appUserdialog.open();
  }

  /// DELETE APPROVAL MODULE
  onDialogOKAppModule(event) {
    this.appModuledialog.close();
    if (this.removeAMButton == true) { 
      var userId = this.appModuleForm.get('user').value[0];

      var obj = {
        autoId: this.rowId,
        userId: this.user.userId,
      };

      this.adminServices.deleteApproveModule(obj).subscribe((result) => {
          if (result == 1) {
            this.toastr.success('Module delete Successfully !!!');
            this.getUserAppModuleList(userId);
            // this.clearApproveModule();
          } else if (result == -1) {
            this.toastr.warning('Delete fail, already in use !!!');
          } else {
            this.toastr.warning(
              'Contact Admin. Error No:- ' + result.toString()
            );
          }
        },(error) => {
          this.validationErrors = error;
        }
      );
    } else {
      this.toastr.error('Delete permission denied !!!');
    }
  }

  /// DELETE APPROVAL USER
  onDialogOKAppUsers(event) {
    this.appUserdialog.close();
    if (this.removeAUButton == true) { 
      var armId = this.appUsersForm.get('armId').value;

      var obj = {
        autoId: this.rowId,
        userId: this.user.userId,
      };
      // console.log(obj);
      this.adminServices.deleteApproveUsers(obj).subscribe((result) => {
          if (result == 1) {
            this.toastr.success('User delete Successfully !!!');
            this.getApprovalUserList(armId);
            // this.clearApproveUser();
          } else if (result == -1) {
            this.toastr.warning('Delete fail, user not exists !!!');
          } else {
            this.toastr.warning(
              'Contact Admin. Error No:- ' + result.toString()
            );
          }
        },(error) => {
          this.validationErrors = error;
        }
      );
    } else {
      this.toastr.error('Delete permission denied !!!');
    }
  }

  //// GET APPROVEL USER LIST BASED ON THR Module
  getApprovalUserList(armId) {
    this.adminServices.getApproveUsers(armId).subscribe(result => {
      this.userList = result
      // console.log(this.userList);
    });
  }

  clearApproveModule() {
    this.appModuleForm.get('autoId').setValue(0);
    // this.appModuleForm.get('user').setValue("");
    this.appModuleForm.get('module').setValue("");
    this.appModuleForm.get('buyPass').setValue(false);
  }

  /// SAVE APPROVAL MODULE 
  saveUserApproveModule() {
    if(this.saveAMButton == true) {
    var obj = {
      autoId: this.appModuleForm.get("autoId").value ,
      userId: this.appModuleForm.get("user").value[0],
      menuId: this.appModuleForm.get("module").value[0] ,
      buyPass: this.chkBuyPass.checked ,
      createUserId: this.user.userId 
    };

    var userId = this.appModuleForm.get("user").value[0];

    this.adminServices.saveApproveRouteModule(obj).subscribe(result => {
      if (result == 1) {
        this.toastr.success('Approve Module save Successfully !!!');
        this.getUserAppModuleList(userId);
        this.clearApproveModule();
      } else if (result == 2) {
        this.toastr.success('Approve Module update Successfully !!!');
        this.getUserAppModuleList(userId);
        this.clearApproveModule();
      } else if (result == -1) {
        this.toastr.warning('Approve Module already exists !!!');
      } else {
        this.toastr.warning(
          'Contact Admin. Error No:- ' + result.toString()
        );
      }
    },
    (error) => {
      this.validationErrors = error;
    })
  } else {
    this.toastr.error('Save permission denied !!!');
  }
  }

  clearApproveUser() {
    this.appUsersForm.get('autoId').setValue(0);
    // this.appUsersForm.get('armId').setValue(0);
    this.appUsersForm.get('approver').setValue("");
    this.appUsersForm.get('isDefault').setValue(false);
    this.appUsersForm.get('isFinalApprove').setValue(false);
  }

  //// SAVE APPROVEL USERS
  saveApproveUser() {
    if(this.saveAUButton == true) {
    var armId = this.appUsersForm.get("armId").value;

    var obj = {
      autoId: this.appUsersForm.get("autoId").value,
      userId: this.appUsersForm.get("approver").value[0],
      armId: armId,
      isDefault: this.chkIsDefault.checked,
      isFinalApprove: this.chkIsFinalApprove.checked,
      createUserId: this.user.userId 
    };

    this.adminServices.saveApproveUsers(obj).subscribe(result => {
      if (result == 1) {
        this.toastr.success('Approver save Successfully !!!');
        this.getApprovalUserList(armId);
        this.clearApproveUser();
      } else if (result == 2) {
        this.toastr.success('Approver update Successfully !!!');
        this.getApprovalUserList(armId);
        this.clearApproveUser();
      } else if (result == -1) {
        this.toastr.warning('Approver already exists !!!');
      } else if (result == -2) {
        this.toastr.warning('User can not be same !!!');
      } else {
        this.toastr.warning(
          'Contact Admin. Error No:- ' + result.toString()
        );
      }
    },
    (error) => {
      this.validationErrors = error;
    })
  } else {
    this.toastr.error('Save permission denied !!!');
  }
  }

}
