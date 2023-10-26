import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxComboComponent, IgxGridComponent ,IgxDialogComponent} from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { Article } from 'src/app/_models/article';
import { BrandCode } from 'src/app/_models/brandCode';
import { User } from 'src/app/_models/user';
import { MasterService } from '_services/master.service';
import { AccountService } from '_services/account.service';
import { Color } from 'src/app/_models/color';
import { Size } from 'src/app/_models/size';

@Component({
  selector: 'app-article-brand-allocation',
  templateUrl: './article-brand-allocation.component.html',
  styleUrls: ['./article-brand-allocation.component.css']
})
export class ArticleBrandAllocationComponent implements OnInit {
  articleBrandMappingForm: FormGroup;
  
  articleList: Article[];
  BrandCode: BrandCode[];
  showColor: boolean = true;
  showSize: boolean = true;
  colorList: Color[];
  sizeList: Size[];
  articleBrandCodeList :any;
  isProGroupSel: boolean = false;
  acSaveButton: boolean = false;
  acRemoveButton: boolean = false;
  user: User;
  brandcodeId : number;
  brandcodeAutoid : number;
  rowId: number = 0;


  @ViewChild('mbrand', { read: IgxComboComponent })
  public mbrand: IgxComboComponent;
  @ViewChild('cmbcolor', { read: IgxComboComponent })
  public cmbcolor: IgxComboComponent;
  @ViewChild('cmbsize', { read: IgxComboComponent })
  public cmbsize: IgxComboComponent;
  @ViewChild('articleBrandCideGrid', { static: true })
  public articleBrandCideGrid: IgxGridComponent;
  @ViewChild('dialog', { read: IgxDialogComponent })
  public dialog: IgxDialogComponent;

  constructor(private fb: FormBuilder,
    private accountService: AccountService,
    private masterService: MasterService,
    private toastr: ToastrService) { }

    public col: IgxColumnComponent;
    public pWidth: string;
    public nWidth: string;

  ngOnInit(): void {
    this.initilizeForm();
    this.loadArticles();
    this.loadBrandCode();
  }

  initilizeForm() {

    this.articleBrandMappingForm = this.fb.group({
      article: [{ value: '' }], ///, disabled: true
      articleCode: [{ value: '', disabled: true }],
      colorId: ['', Validators.required],
      sizeId: ['', Validators.required],
      brandCode: ['' , Validators.required],
      mbrand: ['' , Validators.required],
    });

    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
      //console.log(this.user.userId);
    });
    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 2207).length > 0) {
        this.acSaveButton = true;
      }
      if (authMenus.filter((x) => x.autoIdx == 2208).length > 0) {
        this.acRemoveButton = true;
      }
    }
  }
   //// ALOW SINGLE SILECTION ONLY COMBO EVENT
   singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
    }
   }
   onSelectBrand(event) { 
      this.articleBrandCodeList=[];
      this.isProGroupSel = false;
      this.articleBrandMappingForm.get('colorId').setValue('');
      this.articleBrandMappingForm.get('sizeId').setValue('');
      this.articleBrandMappingForm.get('article').setValue('');

      for (const item of event.added) {
        this.loadBrandCodeArticle(item);
      }
    }

    onSelectArticle(event) { 
      this.isProGroupSel = false;
        for (const item of event.added) {
        var articleRow = this.articleList.filter(x => x.autoId == item);
        //this.soItemForm.get("articleCode").setValue(articleRow[0]["stockCode"]);
        this.loadColor(item);
        this.loadSize(item);
        }
    }
    onSelectProdGroup(event) {
      
      this.isProGroupSel = false;
      for (const item of event.added) {
        //this.loadArticleDetails(item);
        this.isProGroupSel = true;
      }
    }
    openArticleConfirm(event, cellId) {
      this.rowId = cellId.rowID;
      this.dialog.open();
    }
    onItemEdit(event, cellId){
      this.rowId = cellId.rowID;
      //this.clearControlls();
      const ids = cellId.rowID;
      const selectedRowData = this.articleBrandCideGrid.data.filter((record) =>{
      return record.autoId == ids;
    });
      setTimeout(()=>{
        this.cmbcolor.setSelectedItem(selectedRowData[0]['colorId'],true);
        this.cmbsize.setSelectedItem(selectedRowData[0]['sizeId'],true);
        this.cmbcolor.setSelectedItem(selectedRowData[0]['colorId'],true);
      },1000)
    }
    public onResize(event) {
      this.col = event.column;
      this.pWidth = event.prevWidth;
      this.nWidth = event.newWidth;
    }
    loadArticles() {
      this.masterService.getArticlesAll().subscribe((result) => {
        this.articleList = result;
      });
    }
    loadBrandCode() {
      this.masterService.getBrandCodeList().subscribe(Brandswithis => {
        this.BrandCode = Brandswithis;
        //console.log(this.BrandCode);
      })
    }
    loadColor(articleId) {
      this.colorList = [];
      this.isProGroupSel = false;
      this.articleBrandMappingForm.get('colorId').setValue('');
      this.masterService.getArticleColor(articleId).subscribe((color) => {
        this.colorList = color;
      });
    }
    loadSize(articleId) {
      this.sizeList = [];
      this.articleBrandMappingForm.get('sizeId').setValue('');
      this.masterService.getArticleSize(articleId).subscribe((size) => {
        this.sizeList = size;
      });
    }
    loadBrandCodeArticle(brandcodeId){
      this.articleBrandCodeList=[];

      this.masterService.getBrandCodeArticle(brandcodeId).subscribe((result) => {
        //console.log(result);
        this.articleBrandCodeList = result;
      });
    }

    clearSelection(){
      this.isProGroupSel = false;
      this.articleBrandMappingForm.get('colorId').setValue('');
      this.articleBrandMappingForm.get('sizeId').setValue('');
      this.articleBrandMappingForm.get('article').setValue(''); 
    }

    saveArticleBrandCode() {
      if (this.acSaveButton == true) {
      
        var articleId = this.articleBrandMappingForm.get("article").value[0];
        var BrandCodeId = this.articleBrandMappingForm.get("mbrand").value[0];
        var colId = this.articleBrandMappingForm.get("colorId").value[0];
        var sizId = this.articleBrandMappingForm.get("sizeId").value[0];
        var colorList =[];
    
          
          var data = {
            articleId: articleId,
            BrandCodeId : BrandCodeId,
            colorId: colId,
            sizeId: sizId,
            
          };
          
    
        //console.log(data);
        this.masterService.saveArtBrandCode(data).subscribe((result) =>{
          if(result == 1) {
            this.toastr.success("Article assigned to BrandCode Successfully !!!");
            this.loadBrandCodeArticle(BrandCodeId);
            this.clearSelection();
          } else if (result == -1) {
            this.toastr.warning("Brand Code  Already                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   assigned  !!!");
            
          } else {
            this.toastr.warning("Contact Admin. Error No:- " + result.toString());
          }
      })
       
    } else {
      this.toastr.error('Save Permission denied !!!');
      }
    }
  
  //// DELETE RECORD FROM THE GRID 
  public onDialogOKSelected(event) {   
    event.dialog.close();
    if (this.rowId > 0 ) {
      this.deleteArticle(this.rowId);
    }
  }    

  deleteArticle(brandcodeAutoid) {
    var obj = {
      autoId: brandcodeAutoid,
      brandId:0,
    };
    console.log(brandcodeAutoid);
    if(this.acRemoveButton == true) {
      this.masterService.deleteArticleBrandCodeMapping(obj).subscribe((result) => {
        if (result == 1) {
          this.toastr.success('Article mapping  Delete Successfully !!!');
          this.loadBrandCodeArticle(this.articleBrandMappingForm.get("mbrand").value[0]);
        } else {
          this.toastr.error('Contact Admin. Error No:- ' + result.toString());
        }
      });
    } else {
      this.toastr.error('Delete Permission denied !!!');
    }   
  }


}

