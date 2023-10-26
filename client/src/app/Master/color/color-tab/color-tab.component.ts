import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';

@Component({
  selector: 'app-color-tab',
  templateUrl: './color-tab.component.html',
  styleUrls: ['./color-tab.component.css']
})
export class ColorTabComponent implements OnInit {
  user: User;
  color: boolean = false;
  colorCard: boolean = false;
  colorAlloc: boolean = false;
  
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
    if (formMenus.filter(x => x.autoIdx == 2 ).length > 0)
        this.color = true;
    if (formMenus.filter(x => x.autoIdx == 42 ).length > 0)
        this.colorAlloc = true;
    if (formMenus.filter(x => x.autoIdx == 66).length > 0)
        this.colorCard = true;
  }

}
