import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { Company } from 'src/app/_models/company';
import { DelUserModule } from 'src/app/_models/delUserModule';
import { PermitUser } from 'src/app/_models/permitUser';
import { SysModule } from 'src/app/_models/sysModule';
import { User } from 'src/app/_models/user';
import { UserLocation } from 'src/app/_models/userLocation';
import { UserModule } from 'src/app/_models/userModule';
import { AccountService } from '_services/account.service';
import { AdminService } from '_services/admin.service';
import { MasterService } from '_services/master.service';
import { RegisterService } from '_services/register.service';

@Component({
  selector: 'app-module-register',
  templateUrl: './module-register.component.html',
  styleUrls: ['./module-register.component.css'],
})
export class ModuleRegisterComponent implements OnInit {
  user: User;
  userList: PermitUser[];
  UserModList: UserModule[];
  locations: Location[];
  company: Company[];
  moduleList: SysModule[];
  moduleForm: FormGroup;
  delobj: DelUserModule;
  defObj: UserLocation;
  modSaveButton: boolean = false;
  modDeleteButton: boolean = false;
  validationErrors: string[] = [];

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;
  @ViewChild('Modulegrid', { static: true })
  public Modulegrid: IgxGridComponent;

  constructor(
    private fb: FormBuilder,
    private registerServices: RegisterService,
    private toastr: ToastrService,
    private adminServices: AdminService,
    private accountService: AccountService,
    private masterServices: MasterService
  ) {}

  ngOnInit(): void {
    this.initilizeForm();
    this.LoadModules();
    this.LoadPermitedUsers();
    //this.LoadLocation();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    var authMenus = this.user.permitMenus;
    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 90).length > 0) {
        this.modSaveButton = true;
      }
      if (authMenus.filter((x) => x.autoIdx == 96).length > 0) {
        this.modDeleteButton = true;
      }
    }

    this.moduleForm = this.fb.group({
      UserId: ['', Validators.required],
      SysModuleId: ['', Validators.required],
      LocationId: ['', Validators.required],
      CompanyId: ['', Validators.required],
    });
  }

  public onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  /// IG COMBO SELECT ONLY ONE VALUE
  public singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
    }
  }

  LoadCompany(event) {
    for (const item of event.added) {
      /// loads locations
      this.masterServices.getCompany(item).subscribe((comp) => {
        this.company = comp;
      });
    }
  }

  LoadModules() {
    this.registerServices.getSysModules().subscribe((modules) => {
      this.moduleList = modules;
    });
  }

  LoadPermitedUsers() {
    this.adminServices.getPermitedUsers().subscribe((users) => {
      this.userList = users;
    });
  }

  LoadLocation(event) {
    //console.log(event.added[0]);
    for (const item of event.added) {
      var obj = {
        SysModuleId: this.moduleForm.get('SysModuleId').value[0],
        CompanyId: item,
      };
      /// loads locations
      this.registerServices.getLocation(obj).subscribe((loc) => {
        this.locations = loc;
      });
    }
  }

  LoadUserModuleEvent(event) {
    this.UserModList = [];
    for (const item of event.added) {
      this.LoadUserModule(item);
    }
  }

  /// loads user modules with locations
  LoadUserModule(userId) {
    this.registerServices.getUserModule(userId).subscribe((modList) => {
      this.UserModList = modList;
      // console.log(this.UserModList);
    });
  }

  saveUserModule() {
    if (this.modSaveButton == true) {
      //console.log(this.moduleForm.value);
      var modelList = [];
      var locList = this.moduleForm.get('LocationId').value;
      var userId = this.moduleForm.get('UserId').value[0];
      var CompanyId = this.moduleForm.get('CompanyId').value[0];

      locList.forEach((loc) => {
        var data = {
          UserId: userId,
          SysModuleId: this.moduleForm.get('SysModuleId').value[0],
          LocationId: loc,
          CompanyId: CompanyId,
        };
        modelList.push(data);
      });

      //console.log(modelList);
      this.registerServices.saveUserModule(modelList).subscribe(
        (result) => {
          if (result == 1) {
            this.toastr.success('Module assign Successfully !!!');
            this.clearControls();
            this.LoadUserModule(userId);
          } else if (result == -1) {
            this.toastr.warning('Module assign fail !!!');
          } else {
            this.toastr.warning(
              'Contact Admin. Error No:- ' + result.toString()
            );
          }
        },
        (error) => {
          this.validationErrors = error;
        }
      );
    } else {
      this.toastr.error('Save Permission denied !!!');
    }
  }

  onDelete(event, cellId) {
    if(this.modDeleteButton == true) {
    //console.log(cellId.rowID);
    const rowNo = cellId.rowID;
    //console.log(rowNo);
    const selectedRowData = this.Modulegrid.data.filter((record) => {
      return record.rowNo == rowNo;
    });
    //console.log(selectedRowData[0]);

    var userId = this.moduleForm.get('UserId').value[0];

    var obj = {
      UserId: userId,
      UserLocId: selectedRowData[0]['userLocId'],
      UserModuleId: selectedRowData[0]['userModId'],
    };

    this.delobj = Object.assign({}, obj);

    //console.log(this.delobj);
    this.registerServices.deleteUserModule(this.delobj).subscribe(
      (result) => {
        if (result == 1) {
          this.toastr.success('Location remove Successfully !!!');
          this.LoadUserModule(userId);
        } else if (result == -1) {
          this.toastr.warning('Location not exists !!!');
        } else {
          this.toastr.error('Contact Admin. Error No:- ' + result.toString());
        }
      },
      (error) => {
        this.validationErrors = error;
      });
    } else {
      this.toastr.error('Delete Permission denied !!!');
    }
  }

  clearControls() {
    this.moduleForm.get('CompanyId').setValue('');
    this.moduleForm.get('SysModuleId').setValue('');
    this.moduleForm.get('LocationId').setValue('');
  }

  refresh() {
    this.clearControls();
    this.moduleForm.get('UserId').setValue('');
    this.Modulegrid.deselectAllRows();
    this.UserModList = [];
  }

  setDefault(event, cellId) {
    var userId = this.moduleForm.get('UserId').value[0];
    const rowNo = cellId.rowID;

    const selectedRowData = this.Modulegrid.data.filter((record) => {
      return record.rowNo == rowNo;
    });

    var obj = {
      userId: userId,
      autoId: selectedRowData[0]['userLocId'],
    };

    //this.defObj = Object.assign({}, obj);
    //console.log(this.defObj);

    this.adminServices.SetDefaultLocation(obj).subscribe(
      (result) => {
        if (result == 1) {
          this.toastr.success('Default location set Successfully !!!');
          this.LoadUserModule(userId);
        } else if (result == -1) {
          this.toastr.warning('Default location set Failed !!!');
        } else {
          this.toastr.error('Contact Admin. Error No:- ' + result.toString());
        }
      },
      (error) => {
        this.validationErrors = error;
      }
    );
  }
}
