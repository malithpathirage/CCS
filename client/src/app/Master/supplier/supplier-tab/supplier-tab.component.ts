import { Component, OnInit } from '@angular/core';
import { AccountService } from '_services/account.service';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-supplier-tab',
  templateUrl: './supplier-tab.component.html',
  styleUrls: ['./supplier-tab.component.css']
})
export class SupplierTabComponent implements OnInit {
  user: User;
  supHeader: boolean=false;
  supCurrency: boolean=false;
  supAddress: boolean=false;

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
    if (formMenus.filter(x => x.autoIdx == 2238 ).length > 0)
        this.supHeader = true;
    if (formMenus.filter(x => x.autoIdx == 2240 ).length > 0)
        this.supCurrency = true;
    if (formMenus.filter(x => x.autoIdx == 2240 ).length > 0)
        this.supAddress = true;
  }
}