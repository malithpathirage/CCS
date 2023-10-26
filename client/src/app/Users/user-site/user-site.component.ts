import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { StoreSite } from 'src/app/_models/storeSite';
import { PermitUser } from 'src/app/_models/permitUser';
import { UserSite } from 'src/app/_models/UserSite';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { AdminService } from '_services/admin.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-user-site',
  templateUrl: './user-site.component.html',
  styleUrls: ['./user-site.component.css']
})
export class UserSiteComponent implements OnInit {
  user: User;
  userSiteForm: FormGroup;
  permitUsers: PermitUser[];
  SiteList: StoreSite[];
  defaultSite: StoreSite[];
  fromSite: StoreSite[];
  toSite: StoreSite[];
  TypeList: any[];
  removeButton = true;
  saveButton = false;
  saveobj: UserSite;
  validationErrors: string[] = [];


  @ViewChild('defaultSiteGrid', { static: true })
  public defaultSiteGrid: IgxGridComponent;

  @ViewChild('fromSiteGrid', { static: true })
  public fromSiteGrid: IgxGridComponent;
  @ViewChild('toSiteGrid', { static: true })
  public toSiteGrid: IgxGridComponent;

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
    this.LoadSites();
    this.loadTypes();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    this.userSiteForm = this.fb.group({
      AgentId: this.user.userId,
      Agent: ['', Validators.required],
      site: ['', Validators.required],
      sitetype: ['', Validators.required],
      createUserId: this.user.userId,
    });
  }
  loadPermitedUsers() {
      this.adminServices.getPermitedUsers().subscribe((userList) => {
      this.permitUsers = userList;
    });
  }

  LoadSites() {
    this.masterServices.getStoreSite().subscribe((siteList) => {
    this.SiteList = siteList;
    });
  }

  public onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  saveSite(){
    if (this.saveButton == true) {
      var selUserId = this.userSiteForm.get('Agent').value[0];

        var obj = {
          TypeId: this.userSiteForm.get('sitetype').value[0],
          SiteId: this.userSiteForm.get('site').value[0],
          AgentId: selUserId,
          createUserId: this.user.userId,
        };
        this.saveobj = Object.assign({}, obj);
        this.masterServices.saveUserSite(this.saveobj).subscribe(
        (result) => {
          if (result == 1) {
            this.toastr.success('Site update Successfully !!!');
            this.loadUserSiteList(selUserId);
           
          } else {
            this.toastr.error('Contact Admin. Error No:- ' + result.toString()); }
        },
          (error) => {
          this.validationErrors = error;
        });
    }else {
      this.toastr.error('Save Permission denied !!!');
    }
  }

  deleteUserSite(typeid){
    if (this.removeButton == true) {

      if (typeid==1) {
        var selectedRows = this.defaultSiteGrid.selectedRows;
      } else if (typeid==2) {
        var selectedRows = this.fromSiteGrid.selectedRows;
      } else {
        var selectedRows = this.toSiteGrid.selectedRows;
      }

      var selUserId = this.userSiteForm.get('Agent').value[0];
      var siteList = [];

      selectedRows.forEach((userSiteId) => {
        var data = {
          agentId: selUserId,
          UserSiteId: userSiteId,
          createUserId: this.user.userId,
        };
        siteList.push(data);
      });

      this.masterServices.deleteUserSiteList(siteList).subscribe((result) => {
        if (result == 1) {
          this.toastr.success('User Site delete Successfully !!!');
          this.clearGridRows();
          this.loadUserSiteList(selUserId);
        } else if (result == -1) {
          this.toastr.warning('User Site delete failed !!!');
          this.clearGridRows();
          this.loadUserSiteList(selUserId);
        } else {
          this.toastr.error('Contact Admin. Error No:- ' + result.toString());
        }
      });
      
    }else {
      this.toastr.error('delete Permission denied !!!');
    }
  }

  loadTypes() {
    this.TypeList = [
      { name: 'Default Site' , no:1 },
      { name: 'From Site', no:2 },
      { name: 'To Site' , no:3 },

    ];
  }

  public singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
    }
  }

    /// combo on selection change event loads menus details
    loadSiteEvent(event) {
      /// clear grid data
      this.clearGridRows();
      for (const item of event.added) {
        this.loadUserSiteList(item);
      }
    }

    loadUserSiteList(userid){
      this.masterServices.getUserSiteList(userid).subscribe((Report) => {
        this.defaultSite = Report.filter((x) => x.typeId == 1);
        this.fromSite  = Report.filter((x) => x.typeId == 2);
        this.toSite  = Report.filter((x) => x.typeId == 3);
      });
    }    

    clearGridRows() {
      this.defaultSiteGrid.deselectAllRows();
      this.fromSiteGrid.deselectAllRows();
      this.toSiteGrid.deselectAllRows();
      this.defaultSite = [];
      this.fromSite = [];
      this.toSite = [];
    }

}
