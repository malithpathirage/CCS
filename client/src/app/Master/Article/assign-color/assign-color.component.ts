import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxComboComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { Card } from 'src/app/_models/card';
import { Color } from 'src/app/_models/color';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-assign-color',
  templateUrl: './assign-color.component.html',
  styleUrls: ['./assign-color.component.css']
})
export class AssignColorComponent implements OnInit {
  assignColorForm: FormGroup;
  articleList: any[];
  pColorList: Color[];
  npColorList: Color[];
  acSaveButton: boolean = false;
  acRemoveButton: boolean = false;
  user: User;

  @ViewChild('carticle', { read: IgxComboComponent })
  public carticle: IgxComboComponent;

  @ViewChild('npColorGrid', { static: true })
  public npColorGrid: IgxGridComponent;
  @ViewChild('pColorGrid', { static: true })
  public pColorGrid: IgxGridComponent;

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;
  
  constructor(private fb: FormBuilder,
    private accountService: AccountService,
    private masterService: MasterService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initilizeForm();
    this.loadArticles();
    this.DefaultSelection();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
      //console.log(this.user.userId);
    });

    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 134).length > 0) {
        this.acSaveButton = true;
      }
      if (authMenus.filter((x) => x.autoIdx == 135).length > 0) {
        this.acRemoveButton = true;
      }
    }

    this.assignColorForm = this.fb.group({
      userId: this.user.userId,     
      colorCard: [{value: '' , disabled: true }],     
      carticle: ['']     
    });   
  }

   //// ALOW SINGLE SILECTION ONLY COMBO EVENT
   singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
    }
  }

  public onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  loadArticles() {
    this.masterService.getCCardArticles().subscribe((result) => {
      this.articleList = result
    });
    // console.log(this.colorCard);
  }

  onSelectArticle(event) {
    this.clearGridDetails();
    this.assignColorForm.get("colorCard").setValue("");
    for (const item of event.added) {
      var selectedRow = this.articleList.filter(x => x.autoId == item);

      if(selectedRow.length > 0) {
        this.assignColorForm.get("colorCard").setValue(selectedRow[0]["colorCard"]);
      }

      this.loadColorDetails(item);
    }
  }

  //// loads both permited and not permited color list
  loadColorDetails(articleId) {
    this.masterService.getArtColorPermitDt(articleId).subscribe (result => {
      // console.log(result);
      this.pColorList = result.filter(x => x.isAsign == 1); 
      this.npColorList = result.filter(x => x.isAsign == 0);
    })
  }

  saveArticleColor() {
    if (this.acSaveButton == true) {
    var selectedRows = this.npColorGrid.selectedRows;
    var articleId = this.assignColorForm.get("carticle").value[0];
    var colorList =[];

    selectedRows.forEach(colorId => {      
      var data = {
        colorId: colorId,
        articleId: articleId,
        createUserId: this.user.userId,
      };
      colorList.push(data);
    });

    // console.log(colorList);
    this.masterService.saveArtColor(colorList).subscribe((result) =>{
      if(result == 1) {
        this.toastr.success("Color assigned Successfully !!!");
        this.clearGridDetails();
        this.loadColorDetails(articleId);
      } else if (result == -1) {
        this.toastr.warning("Color assigned failed !!!");
        this.clearGridDetails();
        this.loadColorDetails(articleId);
      } else {
        this.toastr.warning("Contact Admin. Error No:- " + result.toString());
      }
    })
  } else {
    this.toastr.error('Save Permission denied !!!');
  }
  }

  deleteArticleColor() {
    if (this.acRemoveButton == true) {
    var selectedRows = this.pColorGrid.selectedRows;
    var articleId = this.assignColorForm.get("carticle").value[0];
    var colorList =[];

    selectedRows.forEach(colorId => {      
      var data = {
        colorId: colorId,
        articleId: articleId,
        createUserId: this.user.userId,
      };

      colorList.push(data);
    });

    // console.log(colorList);
    this.masterService.deleteArtColor(colorList).subscribe((result) =>{
      if(result == 1) {
        this.toastr.success("Color deleted Successfully !!!");
        this.clearGridDetails();
        this.loadColorDetails(articleId);
      } else if (result == -1) {
        this.toastr.warning("Color already used !!!");
        this.clearGridDetails();
        this.loadColorDetails(articleId);
      } else {
        this.toastr.warning("Contact Admin. Error No:- " + result.toString());
      }
    })
  } else {
    this.toastr.error('Delete permission denied !!!');
  }
  }

  clearGridDetails(){
    this.npColorGrid.deselectAllRows();
    this.pColorGrid.deselectAllRows();
    this.npColorList = [];
    this.pColorList = [];
  }

  DefaultSelection(){
    this.masterService.getRCardArticles().subscribe((result) => {
      var item = result[0].autoId;
      this.carticle.setSelectedItem(item,true);
    });
  }
}
