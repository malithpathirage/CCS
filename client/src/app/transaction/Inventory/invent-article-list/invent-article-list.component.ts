import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { Article } from 'src/app/_models/article';
import { Category } from 'src/app/_models/category';
import { ProductGroup } from 'src/app/_models/productGroup';
import { ProductType } from 'src/app/_models/productType';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-invent-article-list',
  templateUrl: './invent-article-list.component.html',
  styleUrls: ['./invent-article-list.component.scss']
})
export class InventArticleListComponent implements OnInit {
  articleForm: FormGroup;
  
  prodTypeList: ProductType[];
  prodGroupList: ProductGroup[];
  categoryList: Category[];
  articleList: Article[];

  validationErrors: string[] = [];
  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

  @Output() articleEvent = new EventEmitter<any>();
  @ViewChild('articleGrid', { static: true })
  public articleGrid: IgxGridComponent;

  constructor(private fb: FormBuilder,
    private masterServices: MasterService) { }

  ngOnInit() {
    this.initilizeForm();
    this.loadCategory();
  }

  initilizeForm() {
   this.articleForm = this.fb.group({
      category: ['', Validators.required],
      prodType: ['', Validators.required],
      prodGroup: ['', Validators.required],
    }); 
  }

  loadCategory() {
    this.masterServices.getCategory().subscribe((result) => {
      this.categoryList = result;
    });
  }

  singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
    }
  }

  onSelectCategory(event) {
    this.articleForm.get('prodType').reset();
    this.articleForm.get('prodGroup').reset();
    this.prodTypeList = [];
    this.prodGroupList = [];
    this.articleList = [];

    for (const item of event.added) {
      this.loadProductType(item);
    }
  }

  loadProductType(catId: number) {
    this.masterServices.getProductTypeDetils(catId).subscribe((result) => {
      this.prodTypeList = result;
    });
  }

  onSelectProdType(event) {
    this.articleForm.get('prodGroup').reset();
    this.prodGroupList = [];
    this.articleList = [];

    for (const item of event.added) {
      this.loadProductGroup(item);
    }
  }

  loadProductGroup(typeId: number) {
    this.masterServices.getProductGroupDt(typeId).subscribe((result) => {
      this.prodGroupList = result;
    });
  }

  //// LOADS ARTICLES BASED ON CATEGORY , PROD TYPE AND GROUP
  onSelectProdGroup(event) {
    this.articleList = [];
    var articles: any[];
    for (const item of event.added) {
      var obj = {
        categoryId: this.articleForm.get('category').value[0],
        proTypeId: this.articleForm.get('prodType').value[0],
        proGroupId: item,
      };
      this.masterServices.getArticleDetails(obj).subscribe(
        (result) => {
          console.log(result);
          articles = result.filter(x => x.isActive == true);
        },
        (error) => {
          this.validationErrors = error;
        },
        () => {
          if (articles.length > 0) {
            var autoId = 0,
              flexLine = [];
            ///// Get Unique Article List
            var uniqeArticle = articles.filter(
              (arr, index, self) =>
                index === self.findIndex((t) => t.autoId === arr.autoId)
            );

            ///// PUSH FLEX FIELD ARTICLE LIST
            for (let b = 0; b < uniqeArticle.length; b++) {
              autoId = uniqeArticle[b]['autoId'];
              var fieldLine: any = uniqeArticle[b];
              //// GET FLEX FIELD LIST FOR SAME ARTICLE
              var flexFieldList = articles.filter((x) => x.autoId == autoId);
              flexLine = [];

              //// CREATE CHILD OBJECT AS FLEX FIELD
              for (let a = 0; a < flexFieldList.length; a++) {
                const element = flexFieldList[a];
                var flexValue = 0;

                if (element['dataType'] == 'F')
                  flexValue = element['fFlexFeildValue'];
                else if (element['dataType'] == 'N')
                  flexValue = element['iFlexFeildValue'];
                else if (element['dataType'] == 'T')
                  flexValue = element['cFlexFeildValue'];
                else if (element['dataType'] == 'B')
                  flexValue = element['bFlexFeildValue'];
                else if (element['dataType'] == 'D')
                  flexValue = element['dFlexFeildValue'];

                var obj = {
                  dataType: element['dataType'],
                  flexFieldId: element['flexFieldId'],
                  flexFieldName: element['flexFieldName'],
                  flexFieldCode: element['flexFieldCode'],
                  flexFieldValue: flexValue,
                  valueList: element['valueList'],
                };
                flexLine.push(obj);
              }
              fieldLine.FlexFields = flexLine;
            }
            this.articleList = uniqeArticle;
          }
        });
    }
  }

  onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  selectArticle($event,cellId) {
    const ids = cellId.rowID;
    const selectedRowData = this.articleGrid.data.filter((record) => {
      return record.autoId == ids;
    });

    this.articleEvent.emit(selectedRowData);
  }

}
