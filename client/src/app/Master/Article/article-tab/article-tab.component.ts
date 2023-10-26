import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';

@Component({
  selector: 'app-article-tab',
  templateUrl: './article-tab.component.html',
  styleUrls: ['./article-tab.component.css']
})
export class ArticleTabComponent implements OnInit {
  user: User;
  article: boolean = false;
  articleColor: boolean = false;
  articleSize: boolean = false;
  articleUOM: boolean = false;
  articleBrandAllocation: boolean = false;

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
    if (formMenus.filter(x => x.autoIdx == 64 ).length > 0)
        this.article = true;
    if (formMenus.filter(x => x.autoIdx == 78 ).length > 0)
        this.articleColor = true;
    if (formMenus.filter(x => x.autoIdx == 79).length > 0)
        this.articleSize = true;
    if (formMenus.filter(x => x.autoIdx == 88).length > 0)
        this.articleUOM = true;
    if (formMenus.filter(x => x.autoIdx == 2206).length > 0)
        this.articleBrandAllocation = true;  
  }
}
