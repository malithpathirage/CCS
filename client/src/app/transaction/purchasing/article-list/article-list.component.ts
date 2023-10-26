import { Component, EventEmitter, Input, OnInit, Output, SimpleChange, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxComboComponent, IgxDialogComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { Article } from 'src/app/_models/article';
import { Category } from 'src/app/_models/category';
import { Color } from 'src/app/_models/color';
import { ProductGroup } from 'src/app/_models/productGroup';
import { ProductType } from 'src/app/_models/productType';
import { Size } from 'src/app/_models/size';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css'],
})
export class ArticleListComponent implements OnInit {
  articleListForm: FormGroup;
  prodTypeList: ProductType[];
  prodGroupList: ProductGroup[];
  categoryList: Category[];
  articleList: Article[];
  colorList: Color[];
  sizeList: Size[];
  indentArtList: any;
  validationErrors: string[] = [];
  rowId: number = 0;

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

  @ViewChild('articleGrid', { static: true })
  public articleGrid: IgxGridComponent;
  @ViewChild('indentartGrid', { static: true })
  public indentartGrid: IgxGridComponent;

  @ViewChild('color', { read: IgxComboComponent })
  public color: IgxComboComponent;
  @ViewChild('size', { read: IgxComboComponent })
  public size: IgxComboComponent;

  @ViewChild('dialog', { read: IgxDialogComponent })
  public dialog: IgxDialogComponent;

  @Input() data;
  @Output() articleChanged: EventEmitter<any> = new EventEmitter();

  //// FORMAT PRICE
  public options = {
    digitsInfo: '1.2-2',
    currencyCode: '',
  };
  public formatPrice = this.options;

  // Date options
  public dateOptions = {
    format: 'yyyy-MM-dd',
    // timezone: 'UTC+0',
  };
  public formatDateOptions = this.dateOptions;

  constructor(
    private fb: FormBuilder,
    private masterServices: MasterService
  ) {}

  ngOnInit(): void {
    this.initilizeForm();
    this.loadCategory();
  }

  ngOnChanges(changes: { [property: string]: SimpleChange }) {
    let change: SimpleChange = changes['data'];
    if (change.currentValue['result'] == 1) {
      this.refreshIndentArticle();
    }
  }

  initilizeForm() {
    this.articleListForm = this.fb.group({
      category: ['', Validators.required],
      prodType: ['', Validators.required],
      prodGroup: ['', Validators.required],
      articleId: [0, Validators.required],
      article: [{ value: '', disabled: true }, Validators.required],
      color: ['', Validators.required],
      size: ['', Validators.required],
      unit: ['', Validators.required],
      price: [ 0, Validators.required],
      uomId: [''],
      uom: [''],
    });
  }

  onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  loadCategory() {
    this.masterServices.getCategory().subscribe((result) => {
      this.categoryList = result;
    });
  }

  loadProductType(catId: number) {
    this.masterServices.getProductTypeDetils(catId).subscribe((result) => {
      this.prodTypeList = result;
    });
  }

  loadProductGroup(typeId: number) {
    this.masterServices.getProductGroupDt(typeId).subscribe((result) => {
      this.prodGroupList = result;
    });
  }

  singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
    }
  }

  onSelectCategory(event) {
    this.articleListForm.get('prodType').reset();
    this.articleListForm.get('prodGroup').reset();
    this.prodTypeList = [];
    this.prodGroupList = [];
    this.articleList = [];

    for (const item of event.added) {
      this.loadProductType(item);
    }
  }

  onSelectProdType(event) {
    this.articleListForm.get('prodGroup').reset();
    this.prodGroupList = [];
    this.articleList = [];

    for (const item of event.added) {
      this.loadProductGroup(item);
      //this.loadFlexFields(item);
    }
  }

  //// LOADS ARTICLES BASED ON CATEGORY , PROD TYPE AND GROUP
  onSelectProdGroup(event) {
    this.articleList = [];
    var articles: any[];
    for (const item of event.added) {
      var obj = {
        categoryId: this.articleListForm.get('category').value[0],
        proTypeId: this.articleListForm.get('prodType').value[0],
        proGroupId: item,
      };
      //console.log(obj);
      this.masterServices.getArticleDetails(obj).subscribe(
        (result) => {
          articles = result.filter(x => x.isActive == true);
        },
        (error) => {
          this.validationErrors = error;
        },
        () => {
          if (articles.length > 0) {
            // var autoId = 0,
            //   flexLine = [];

            ///// Get Unique Article List
            var uniqeArticle = articles.filter(
              (arr, index, self) =>
                index === self.findIndex((t) => t.autoId === arr.autoId)
            );

            ///// PUSH FLEX FIELD ARTICLE LIST
            // for (let b = 0; b < uniqeArticle.length; b++) {
            //   autoId = uniqeArticle[b]['autoId'];
            //var fieldLine: any = uniqeArticle[b];
            //// GET FLEX FIELD LIST FOR SAME ARTICLE
            // var flexFieldList = articles.filter((x) => x.autoId == autoId);
            // flexLine = [];

            // //// CREATE CHILD OBJECT AS FLEX FIELD
            // for (let a = 0; a < flexFieldList.length; a++) {
            //   const element = flexFieldList[a];
            //   var flexValue = 0;

            //   if (element['dataType'] == 'F')
            //     flexValue = element['fFlexFeildValue'];
            //   else if (element['dataType'] == 'N')
            //     flexValue = element['iFlexFeildValue'];
            //   else if (element['dataType'] == 'T')
            //     flexValue = element['cFlexFeildValue'];
            //   else if (element['dataType'] == 'B')
            //     flexValue = element['bFlexFeildValue'];
            //   else if (element['dataType'] == 'D')
            //     flexValue = element['dFlexFeildValue'];

            //   var obj = {
            //     dataType: element['dataType'],
            //     flexFieldId: element['flexFieldId'],
            //     flexFieldName: element['flexFieldName'],
            //     flexFieldCode: element['flexFieldCode'],
            //     flexFieldValue: flexValue,
            //     valueList: element['valueList'],
            //   };
            //   flexLine.push(obj);
            // }

            // fieldLine.FlexFields = flexLine;
            // }
            this.articleList = uniqeArticle;
          }
        }
      );
    }
  }

  loadColor(articleId) {
    this.colorList = [];
    this.articleListForm.get('color').setValue('');
    this.masterServices.getArticleColor(articleId).subscribe((color) => {
      this.colorList = color;
    });
  }

  loadSize(articleId) {
    this.sizeList = [];
    this.articleListForm.get('size').setValue('');
    this.masterServices.getArticleSize(articleId).subscribe((size) => {
      this.sizeList = size;
    });
  }

  selectArticle(event, cellId) {
    const ids = cellId.rowID;
    const selectedRowData = this.articleGrid.data.filter((record) => {
      return record.autoId == ids;
    });

    // console.log(selectedRowData);
    var article =
      selectedRowData[0]['articleName'] +
      '- (' +
      selectedRowData[0]['stockCode'] +
      ')';
    this.articleListForm.get('article').setValue(article);
    this.articleListForm
      .get('articleId')
      .setValue(selectedRowData[0]['autoId']);
    this.articleListForm.get('uom').setValue(selectedRowData[0]['measurement']);
    this.articleListForm
      .get('uomId')
      .setValue(selectedRowData[0]['measurementId']);

    this.loadColor(selectedRowData[0]['autoId']);
    this.loadSize(selectedRowData[0]['autoId']);
  }

  addArticleDt() {
    // if(this.articleListForm.valid) {
      var articleId = this.articleListForm.get('articleId').value;
      var colorId = this.articleListForm.get('color').value[0];
      var sizeId = this.articleListForm.get('size').value[0];

      const rowData = this.indentartGrid.data.filter((record) => {
        return (
          record.articleId == articleId &&
          record.colorId == colorId &&
          record.sizeId == sizeId
        );
      });

      var autoId = this.findMaxItemId(this.indentartGrid.data) + 1;

      if (rowData.length == 0) {
        var obj = {
          autoId: autoId,
          article: this.articleListForm.get('article').value,
          color: this.color.value,
          size: this.size.value,
          uom: this.articleListForm.get('uom').value,
          unitPrice: this.articleListForm.get('price').value,
          articleId: articleId,
          colorId: colorId,
          sizeId: sizeId,
          uomId: this.articleListForm.get('uomId').value,
          totQty: this.articleListForm.get('unit').value,
        };
        this.indentartGrid.addRow(obj);
      }
      // console.log(this.indentartGrid.data);
      this.articleChanged.next(this.indentartGrid.data);
      this.cleararticleform();
      // } else {
      //   this.articleListForm.dirty;
      //   this.toastr.warning("fill required fields !!!");
      // }      
    }

    findMaxItemId(arr) {
      var maxValue: number = 0;
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].autoId > maxValue) {
          maxValue = arr[i].autoId;
        }
      }
      return maxValue;
    }

    cleararticleform() {
      this.articleListForm.get('article').setValue('');
      this.articleListForm.get('uom').setValue('');
      this.articleListForm.get('uomId').setValue('');
      this.articleListForm.get('unit').setValue('');
      this.articleListForm.get('price').setValue(0);
      this.articleListForm.get('color').setValue('');
      this.articleListForm.get('size').setValue('');
      this.articleListForm.get('articleId').setValue(0);
      this.colorList = [];
    this.sizeList = [];
    this.articleGrid.deselectAllRows();
  }

  openDeleteDialog(event, cellId) {
    this.rowId = cellId;
    this.dialog.open();
  }

  onDialogOKSelected(event) {
    event.dialog.close();
    this.onItemDelete(event, this.rowId);
  }

  onItemDelete(event, cellId) {
    const ids = cellId.rowID;
    this.indentartGrid.deleteRow(ids);
  }

  refreshIndentArticle() {
    this.indentArtList = [];
    this.cleararticleform();
  }
}
