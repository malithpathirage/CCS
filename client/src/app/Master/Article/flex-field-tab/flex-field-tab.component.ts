import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';

@Component({
  selector: 'app-flex-field-tab',
  templateUrl: './flex-field-tab.component.html',
  styleUrls: ['./flex-field-tab.component.css']
})
export class FlexFieldTabComponent implements OnInit {
  user: User;
  flexFieldDt: boolean = false;
  flexFieldVal: boolean = false;
  
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
    if (formMenus.filter(x => x.autoIdx == 63 ).length > 0)
        this.flexFieldDt = true;
    if (formMenus.filter(x => x.autoIdx == 77 ).length > 0)
        this.flexFieldVal = true;
  }

}
