import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { MenuList } from 'src/app/_models/menuList';
import { PermitUser } from 'src/app/_models/permitUser';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { AdminService } from '_services/admin.service';

@Component({
  selector: 'app-user-permission',
  templateUrl: './user-permission.component.html',
  styleUrls: ['./user-permission.component.css'],
})
export class UserPermissionComponent implements OnInit {
  user: User;
  userObj: User;
  permitUsers: PermitUser[];
  permitMenus: MenuList[];
  nPermitMenus: MenuList[];
  userPermitForm: FormGroup;
  removeButton = false;
  saveButton = false;

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;
  
  @ViewChild('Menugrid', { static: true })
  public Menugrid: IgxGridComponent;
  @ViewChild('PermitMgrid', { static: true })
  public PermitMgrid: IgxGridComponent;

  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    public adminServices: AdminService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initilizeForm();
    this.getButtonPermission();
    this.loadPermitedUsers();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    this.userPermitForm = this.fb.group({
      AgentId: this.user.userId,
      Agent: ['', Validators.required],
    });
  }

  loadPermitedUsers() {
    this.adminServices.getPermitedUsers().subscribe((userList) => {
      this.permitUsers = userList;
      //console.log(userList);
    });
  }

  /// combo on selection change event loads menus details
  loadMenusEvent(event) {
    /// clear grid data
    this.clearGridRows();
    for (const item of event.added) {
      this.loadUserMenuList(item);
    }
  }

  /// loads menus details related to the selected user
  loadUserMenuList(userId) {
    var obj = {
      agentId : userId,
      moduleId : this.user.moduleId
    }
    this.adminServices.getUserMenuList(obj).subscribe((menuList) => {
      this.permitMenus = menuList.filter((x) => x.isPermit == 1);
      this.nPermitMenus = menuList.filter((x) => x.isPermit == 0);
    });
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

  saveUserMenuList() {
    if (this.saveButton == true) {
      var selectedRows = this.Menugrid.selectedRows;
      //console.log(this.userPermitForm.get("Agent").value[0]);
      var selUserId = this.userPermitForm.get('Agent').value[0];
      var menuList = [];

      selectedRows.forEach((menuId) => {
        var data = {
          agentId: selUserId,
          menuId: menuId,
          creUserID: this.user.userId,
          moduleId : this.user.moduleId
        };
        menuList.push(data);
      });

      //console.log(JSON.stringify(menuList));
      this.adminServices.saveUserMenuList(menuList).subscribe((result) => {
        if (result == 1) {
          this.toastr.success('User Menu save Successfully !!!');
          this.clearGridRows();
          this.loadUserMenuList(selUserId);
        } else if (result == -1) {
          this.toastr.warning('User Menu save failed !!!');
          this.clearGridRows();
          this.loadUserMenuList(selUserId);
        } else {
          this.toastr.error('Contact Admin. Error No:- ' + result.toString());
        }
      });
    } else {
      this.toastr.error('Save Permission denied !!!');
    }
  }

  deleteUserMenuList() {
    if (this.removeButton == true) {
      //console.log(this.PermitMgrid.selectedRows);
      var selectedRows = this.PermitMgrid.selectedRows;
      var selUserId = this.userPermitForm.get('Agent').value[0];
      var menuList = [];

      selectedRows.forEach((menuId) => {
        var data = {
          agentId: selUserId,
          menuId: menuId,
          creUserID: this.user.userId,
          moduleId : this.user.moduleId
        };
        menuList.push(data);
      });

      //console.log(JSON.stringify(menuList));
      this.adminServices.deleteUserMenuList(menuList).subscribe((result) => {
        if (result == 1) {
          this.toastr.success('User Menu delete Successfully !!!');
          this.loadUserMenuList(selUserId);
        } else if (result == -1) {
          this.toastr.warning('User Menu delete failed !!!');
          this.loadUserMenuList(selUserId);
        } else {
          this.toastr.error('Contact Admin. Error No:- ' + result.toString());
        }
      });
    } else {
      this.toastr.error('Delete permission denied !!!');
    }
  }

  clearControls() {
    this.clearGridRows();
    this.userPermitForm.get('Agent').setValue('');
  }

  clearGridRows() {
    this.Menugrid.deselectAllRows();
    this.PermitMgrid.deselectAllRows();
    this.permitMenus = [];
    this.nPermitMenus = [];
  }
}
