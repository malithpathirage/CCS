import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { MenuGroup } from 'src/app/_models/menuGroup';
import { MenuList } from 'src/app/_models/menuList';
import { MenuType } from 'src/app/_models/menuType';
import { User } from 'src/app/_models/user';
import { UserLevel } from 'src/app/_models/userLevel';
import { AccountService } from '_services/account.service';
import { AdminService } from '_services/admin.service';
import { RegisterService } from '_services/register.service';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.css']
})
export class MenuListComponent implements OnInit {
  menuList: MenuList[];
  menuType: MenuType[];
  userLevel: UserLevel[];
  menuGroup: MenuGroup[];
  menuListForm: FormGroup;
  validationErrors: string[] = [];
  user: User;
  saveButton: boolean = false;

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;
  //public selectionMode = "Single";
  @ViewChild("Menugrid", { static: true }) 
  public Menugrid: IgxGridComponent;
  

  constructor(public registerService: RegisterService,private fb: FormBuilder, private accountService: AccountService
      , public adminService: AdminService , private toastr: ToastrService ) { 
  }

  ngOnInit(): void {
    this.initilizeForm();    
    this.LoadType();
    this.LoadUserLevel();
    this.LoadMenuGroup();
    this.LoadMenuList();   
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach(element => {
      this.user = element;
      });

      var authMenus = this.user.permitMenus;

      if (authMenus != null) {
        if (authMenus.filter((x) => x.autoIdx == 92).length > 0) {
          this.saveButton = true;
        }
      }

    this.menuListForm = this.fb.group ({
      autoIdx : [0],
      AgentId : this.user.userId,
      menuName: ['', [Validators.required , Validators.maxLength(50)]],
      menuDescription: ['', [Validators.required , Validators.maxLength(100)]],
      groupName: ['', Validators.required],
      mType: ['', Validators.required],
      AgentLevelId: ['', Validators.required]
    })
  }

  public onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
}

  LoadType() {
   var data = [
      {'TName':'F','TDesc': 'Form'},
      {'TName':'B','TDesc': 'Button'}];
    this.menuType = data;    
  }

  LoadMenuGroup() {
    var data = [{ 'groupDesc': 'Dashboard','groupName': 'Dashboard'},
                { 'groupDesc': 'Admin','groupName': 'Admin'},
                { 'groupDesc': 'Master' , 'groupName': 'Master'},
                { 'groupDesc': 'Orders' , 'groupName': 'Orders'},
                { 'groupDesc': 'Production' , 'groupName': 'Production'},
                { 'groupDesc': 'Purchasing' , 'groupName': 'Purchasing'},
                { 'groupDesc': 'Costing' , 'groupName': 'Costing'},
                { 'groupDesc': 'Finance' , 'groupName': 'Finance'},
                { 'groupDesc': 'Indent' , 'groupName': 'Indent'},
                { 'groupDesc': 'Inventory', 'groupName': 'Inventory' },
                { 'groupDesc': 'Integration', 'groupName': 'Integration' },
                { 'groupDesc': 'Fixed Asset' , 'groupName': 'FA'},
              ];
    this.menuGroup = data;  
    //console.log(data);  
  }

  public singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
      //console.log(event.newSelection);
    }
  }

  LoadUserLevel() {
    this.registerService.getUserLevel().subscribe(levels => {
      this.userLevel = levels;
      //console.log(levels);
    });
  }

  LoadMenuList() {
    this.adminService.getMenuList().subscribe(menus => {
      //console.log(menus);
      this.menuList = menus;
    });
  }

  saveMenuList() {
    if(this.saveButton == true) {
    this.menuListForm.get('groupName').setValue(this.menuListForm.get('groupName').value[0]);
    this.menuListForm.get('mType').setValue(this.menuListForm.get('mType').value[0]);
    this.menuListForm.get('AgentLevelId').setValue(this.menuListForm.get('AgentLevelId').value[0]);
    this.menuListForm.get('AgentId').setValue(this.user.userId);
    
    // console.log(this.menuListForm.value);
    this.adminService.saveMenuList(this.menuListForm.value).subscribe((result) => {  
      if (result == 1) {
        this.toastr.success("Menu List save Successfully !!!");
        this.LoadMenuList();
        this.cancelMenuList();
      } else if (result == 2) {
        this.toastr.success("Menu List update Successfully !!!");
        this.LoadMenuList();
        this.cancelMenuList();
      } else if (result == -2) {
        this.toastr.warning("Menu already exists !!!");
      } else {
        this.toastr.warning("Contact Admin. Error No:- " + result.toString());
      }
      
    }, error => {
      this.validationErrors = error;
    }) 
    } else {
      this.toastr.error('Save permission denied !!!');
    }
  }
  
  /// Cancel Menu List Form
  cancelMenuList() {
    this.menuListForm.reset();
    this.menuListForm.get('autoIdx').setValue(0);
    this.Menugrid.deselectAllRows();
  }    
  
  //// EDIT ROW LOADS DETAILS TO CONTROL 
  onEdit(event,cellId) {
    //console.log(cellId.rowID);
    const ids = cellId.rowID;
    //console.log(ids);
    const selectedRowData = this.Menugrid.data.filter((record) => {
        return record.autoIdx == ids;
    });
 
    this.menuListForm.get('menuName').setValue(selectedRowData[0]["menuName"]);
    this.menuListForm.get('menuDescription').setValue(selectedRowData[0]["menuDescription"]);
    this.menuListForm.get('autoIdx').setValue(selectedRowData[0]["autoIdx"]);
    this.menuListForm.get('groupName').setValue([selectedRowData[0]["groupName"]]);
    this.menuListForm.get('mType').setValue([selectedRowData[0]["mType"]]);
    this.menuListForm.get('AgentLevelId').setValue([selectedRowData[0]["iCategoryLevel"]]);
  }

}
