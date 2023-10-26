import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';

@Component({
  selector: 'app-user-permittab',
  templateUrl: './user-permittab.component.html',
  styleUrls: ['./user-permittab.component.css']
})
export class UserPermittabComponent implements OnInit {
  user: User;
  menuPermit: boolean = false;
  approvePermit: boolean = false;
  userMasterSettings: boolean = false;
  reportPermit: boolean = false;
  sitePermit: boolean = false;

  constructor(public accountServices: AccountService) { }

  ngOnInit(): void {
    this.accountServices.currentUser$.forEach((element) => {
      this.user = element;
    });
    this.checkMenuPermission();
  }

  checkMenuPermission() {
    var menus = this.user.permitMenus;
    // console.log(menus);    
    var formMenus = menus.filter((x) => x.mType == 'F'); 
    if (formMenus.filter(x => x.autoIdx == 35 ).length > 0)
        this.menuPermit = true;
    if (formMenus.filter(x => x.autoIdx == 1178 ).length > 0)
        this.approvePermit = true;
    if (formMenus.filter(x => x.autoIdx == 2225 ).length > 0)
        this.userMasterSettings = true;
    if (formMenus.filter(x => x.autoIdx == 2226 ).length > 0)
        this.reportPermit = true;     
    if (formMenus.filter(x => x.autoIdx == 2227 ).length > 0)
        this.sitePermit = true;    
  }

}
