import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';

@Component({
  selector: 'app-storesite-tab',
  templateUrl: './storesite-tab.component.html',
  styleUrls: ['./storesite-tab.component.css']
})
export class StoresiteTabComponent implements OnInit {
  user: User;
  storeSite: boolean = false;
  dispatchSite: boolean = false;
  
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
    if (formMenus.filter(x => x.autoIdx == 37 ).length > 0)
        this.storeSite = true;
    if (formMenus.filter(x => x.autoIdx == 174 ).length > 0)
        this.dispatchSite = true;
  }
}
