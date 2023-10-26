import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';

@Component({
  selector: 'app-brand-tab',
  templateUrl: './brand-tab.component.html',
  styleUrls: ['./brand-tab.component.css']
})
export class BrandTabComponent implements OnInit {
  user: User;
  brand: boolean = false;
  brandCode: boolean = false;
  brandcategory : boolean = false;
  
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
    if (formMenus.filter(x => x.autoIdx == 58 ).length > 0)
        this.brand = true;
    if (formMenus.filter(x => x.autoIdx == 70 ).length > 0)
      this.brandCode = true;
    if (formMenus.filter(x => x.autoIdx == 70 ).length > 0)
    this.brandcategory = true;    
  }

}
