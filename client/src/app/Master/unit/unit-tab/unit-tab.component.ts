import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';

@Component({
  selector: 'app-unit-tab',
  templateUrl: './unit-tab.component.html',
  styleUrls: ['./unit-tab.component.css']
})
export class UnitTabComponent implements OnInit {
  user: User;
  units: boolean = false;
  unitConv: boolean = false;
  
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
    if (formMenus.filter(x => x.autoIdx == 36 ).length > 0)
        this.units = true;
    if (formMenus.filter(x => x.autoIdx == 47 ).length > 0)
        this.unitConv = true;    
  }

}
