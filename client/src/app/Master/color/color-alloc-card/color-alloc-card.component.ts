import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { Card } from 'src/app/_models/card';
import { ColorAllocation } from 'src/app/_models/colorAllocation';
import { PermitMenu } from 'src/app/_models/permitMenu';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-color-alloc-card',
  templateUrl: './color-alloc-card.component.html',
  styleUrls: ['./color-alloc-card.component.css']
})
export class ColorAllocCardComponent implements OnInit {
  colorAllocForm: FormGroup;
  colorCardList: Card[];
  aColorList: ColorAllocation[];
  naColorList: ColorAllocation[];
  user: User;
  // userObj: User;
  authMenus: PermitMenu[];
  removeButton: boolean = false;
  saveButton: boolean = false;
  validationErrors: string[] = [];
  
  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;
  
  @ViewChild("aColorGrid", { static: true }) 
  public aColorGrid: IgxGridComponent;
  @ViewChild("naColorGrid", { static: true }) 
  public naColorGrid: IgxGridComponent;
  
  constructor(private accountService: AccountService, private fb: FormBuilder
    ,private masterService: MasterService ,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initilizeForm();
    this.loadColorCard();
    this.getButtonPermission();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach(element => {
      this.user = element;
      });

    this.colorAllocForm = this.fb.group ({
      autoId : [0],
      createUserId : this.user.userId,
      colorCard: ['',Validators.required],
      // color:['', Validators.required]
    })
  } 

  public singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
    }
  }

  public onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  //// loads color cards
  loadColorCard(){
    this.masterService.getColorCard().subscribe(cardList => {
      this.colorCardList = cardList;
    })
  }

  onColorCardSelect(event) {
    this.clearGridRows();
    for(const item of event.added) {
      this.loadColorList(item);
    }
  }

  getButtonPermission() {   
    this.authMenus = this.user.permitMenus;  
    
    if(this.authMenus != null) {
    if(this.authMenus.filter(x => x.autoIdx == 38).length > 0) {
      this.saveButton = true;
    }
    if(this.authMenus.filter(x => x.autoIdx == 40).length > 0) {
      this.removeButton = true;
    }
  }
    // console.log(this.authMenus);
    // console.log(this.saveButton);
    // console.log(this.removeButton);
  }

  //// LOADS ASSIGN AND UNASIGNED COLOR LIST 
  loadColorList (colorCardId) {
    this.masterService.getColorAllocDetails(colorCardId).subscribe(result => {
      if(result.length > 0) {
        this.aColorList = result.filter(x => x.isAsign == true);
        this.naColorList = result.filter(x => x.isAsign == false);
      }      
    })
  }

  saveColorAllocation() {
    if(this.saveButton == true) {
    var selectedRows = this.naColorGrid.selectedRows;
    var colorCardId = this.colorAllocForm.get("colorCard").value[0];
    var colorList =[];

    selectedRows.forEach(menuId => {      
      var data = {
        colorCardId: colorCardId,
        colorId: menuId,
        createUserId: this.user.userId,
      };

      colorList.push(data);
    });

    // console.log(colorList);
    this.masterService.saveColorAllocation(colorList).subscribe((result) =>{
      if(result == 1) {
        this.toastr.success("Color Assign Successfully !!!");
        this.clearGridRows();
        this.loadColorList(colorCardId);
      } else if (result == -1) {
        this.toastr.warning("Color Assign failed !!!");
        this.clearGridRows();
        this.loadColorList(colorCardId);
      } else {
        this.toastr.warning("Contact Admin. Error No:- " + result.toString());
      }
    })
  } else {
    this.toastr.error('Save Permission denied !!!');
  }
  }

  clearGridRows() {
    this.naColorGrid.deselectAllRows();
    this.aColorGrid.deselectAllRows();
    this.naColorList = [];
    this.aColorList = [];
  }

  deleteColorAllocation() {
    if(this.removeButton == true) {
    var selectedRows = this.aColorGrid.selectedRows;
    var colorCardId = this.colorAllocForm.get("colorCard").value[0];
    var colorList =[];

    selectedRows.forEach(menuId => {      
      var data = {
        colorCardId: colorCardId,
        colorId: menuId,
        createUserId: this.user.userId,
      };

      // colorList.push(data);
    });

    // console.log(colorList);
    this.masterService.deleteColorAllocation(colorList).subscribe((result) =>{
      if(result == 1) {
        this.toastr.success("Color remove Successfully !!!");
        this.clearGridRows();
        this.loadColorList(colorCardId);
      } else if (result == -1) {
        this.toastr.warning("Color remove failed !!!");
        this.clearGridRows();
        this.loadColorList(colorCardId);
      } else {
        this.toastr.warning("Contact Admin. Error No:- " + result.toString());
      }
    }) 
  } else {
    this.toastr.error('Delete permission denied !!!');
  }
  }



}
