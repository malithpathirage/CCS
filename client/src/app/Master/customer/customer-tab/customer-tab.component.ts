import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';

@Component({
  selector: 'app-customer-tab',
  templateUrl: './customer-tab.component.html',
  styleUrls: ['./customer-tab.component.css']
})
export class CustomerTabComponent implements OnInit {
  user: User;
  cusHeader: boolean = false;
  cusLocation: boolean = false;
  cusUser: boolean = false;
  cusAddList: boolean = false;
  cusBrand: boolean = false;
  cusDivision: boolean = false;
  cusCurrency: boolean = false;
  cusOtherCode: boolean = false;
  cusOther: boolean = false;

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
    if (formMenus.filter(x => x.autoIdx == 62 ).length > 0)
        this.cusHeader = true;
    if (formMenus.filter(x => x.autoIdx == 71 ).length > 0)
        this.cusLocation = true;
    if (formMenus.filter(x => x.autoIdx == 72).length > 0)
        this.cusUser = true;
    if (formMenus.filter(x => x.autoIdx == 73).length > 0)
        this.cusAddList = true;
    if (formMenus.filter(x => x.autoIdx == 74).length > 0)
        this.cusBrand = true;
    if (formMenus.filter(x => x.autoIdx == 75).length > 0)
        this.cusDivision = true;
    if (formMenus.filter(x => x.autoIdx == 76).length > 0)
        this.cusCurrency = true;
    if (formMenus.filter(x => x.autoIdx == 76).length > 0)
        this.cusOtherCode = true;
    if (formMenus.filter(x => x.autoIdx == 76).length > 0)
        this.cusOther = true;
  }
}
