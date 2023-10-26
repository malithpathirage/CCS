import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { Color } from 'src/app/_models/color';
import { Card } from 'src/app/_models/card';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';


@Component({
  selector: 'app-master-color',
  templateUrl: './master-color.component.html',
  styleUrls: ['./master-color.component.css']
})
export class MasterColorComponent implements OnInit {
  masterColor: FormGroup;
  // ColorCardList: Card[];
  ColorList: Color[];
  user: User;
  saveobj: Color;
  cSaveButton: boolean = false;
  validationErrors: string[] = [];
  
  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

  @ViewChild("Colorgrid", { static: true }) 
  public Colorgrid: IgxGridComponent;

  constructor(private accountService: AccountService, private fb: FormBuilder
      ,private masterService: MasterService ,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initilizeForm();
    this.LoadColorList();
    // this.LoadColorCard();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach(element => {
      this.user = element;
      });

      var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 100).length > 0) {
        this.cSaveButton = true;
      }
    }

    this.masterColor = this.fb.group ({
      AutoId : [0],
      CreateUserId : this.user.userId,
      Code: ['', [Validators.required , Validators.maxLength(10)]],
      Name: ['', [Validators.required , Validators.maxLength(50)]],
      // LinkColorCard: ['',Validators.required]
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

  // LoadColorCard(){
  //   this.masterService.getColorCard().subscribe(cardList => {
  //     this.ColorCardList = cardList;
  //   })
  // }

  LoadColorList() {    
      this.masterService.getColor().subscribe(colors => {
        this.ColorList = colors;
      })
  }    

  // loadGridDetails(event){
  //   this.clearGridRows();
  //   for(const item of event.added) {
  //     //console.log(item);
  //     this.LoadColorList(item);
  //   }    
  // }

  clearGridRows() {
    this.Colorgrid.deselectAllRows();
    this.ColorList = [];
  }

  // refreshPage() {
  //   this.LoadColorCard();
  // }

  saveColor() { 
    if(this.cSaveButton == true ) {
    // var colorCard = this.masterColor.get('LinkColorCard').value[0];
    var obj = {
      "createUserId": this.user.userId,
      // "linkColorCard" : this.masterColor.get('LinkColorCard').value[0],
      "code" : this.masterColor.get('Code').value.trim(),
      "name" : this.masterColor.get('Name').value.trim(),
      "autoId" : this.masterColor.get('AutoId').value
    }

    this.saveobj = Object.assign({}, obj);
    //console.log(this.saveobj);
    this.masterService.saveColor(this.saveobj).subscribe((result) => {    
      if (result == 1) {
        this.toastr.success("Color save Successfully !!!");
        this.LoadColorList();
        this.clearControls();
      } else if (result == 2) {
        this.toastr.success("Color update Successfully !!!");
        this.LoadColorList();
        this.clearControls();
      } else if (result == -1) {
        this.toastr.warning("Color already exists !!!");
      } else {
        this.toastr.warning("Contact Admin. Error No:- " + result.toString());
      }    
       
    }, error => {
      this.validationErrors = error;
    }) 
    } else {
    this.toastr.error('Save Permission denied !!!');
    }
  }

  clearControls() {
    //this.masterColor.reset();
    this.masterColor.get('AutoId').setValue(0);
    this.masterColor.get('CreateUserId').setValue(this.user.userId);
    this.masterColor.get('Code').setValue("");
    this.masterColor.get('Name').setValue("");
  }

  resetControls(){
    // this.masterColor.reset();
    this.clearControls();
    // this.clearGridRows();
  }

   //// EDIT ROW LOADS DETAILS TO CONTROL 
   onEdit(event,cellId) {
    //console.log(cellId.rowID);
    const ids = cellId.rowID;    
    const selectedRowData = this.Colorgrid.data.filter((record) => {
        return record.autoId == ids;
    });

    //console.log(selectedRowData);
    this.masterColor.get('Name').setValue(selectedRowData[0]["name"]);
    this.masterColor.get('AutoId').setValue(selectedRowData[0]["autoId"]);
    this.masterColor.get('Code').setValue(selectedRowData[0]["code"]); 
  }

}
