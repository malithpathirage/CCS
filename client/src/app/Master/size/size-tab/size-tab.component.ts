import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';

@Component({
  selector: 'app-size-tab',
  templateUrl: './size-tab.component.html',
  styleUrls: ['./size-tab.component.css']
})
export class SizeTabComponent implements OnInit {
  user: User;
  size: boolean = false;
  sizeCard: boolean = false;
  sizeAlloc: boolean = false;

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
    if (formMenus.filter(x => x.autoIdx == 3 ).length > 0)
        this.size = true;
    if (formMenus.filter(x => x.autoIdx == 43 ).length > 0)
        this.sizeAlloc = true;
    if (formMenus.filter(x => x.autoIdx == 65).length > 0)
        this.sizeCard = true;
  }

}
