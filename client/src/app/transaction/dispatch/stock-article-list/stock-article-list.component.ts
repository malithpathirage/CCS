import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DispatchService } from '_services/dispatch.service';
import { MasterService } from '_services/master.service';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { DispatchStockDto } from 'src/app/_models/DispatchStockDto';
import { Category } from 'src/app/_models/category';
import { ProductGroup } from 'src/app/_models/productGroup';
import { ProductType } from 'src/app/_models/productType';

@Component({
  selector: 'app-stock-article-list',
  templateUrl: './stock-article-list.component.html',
  styleUrls: ['./stock-article-list.component.css']
})
export class StockArticleListComponent implements OnInit {
  articleForm: FormGroup;  
  prodTypeList: ProductType[];
  prodGroupList: ProductGroup[];
  categoryList: Category[];
  articleList: DispatchStockDto[];

  validationErrors: string[] = [];
  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

  @Output() articleEvent = new EventEmitter<any>();
  @Input() dispatchData;
  @ViewChild('articleGrid', { static: true })
  public articleGrid: IgxGridComponent;

    // Date options
    public dateOptions = {
      format: 'yyyy-MM-dd'
    };
  
    public formatDateOptions = this.dateOptions;

  constructor(private fb: FormBuilder,
    private masterServices: MasterService,
    private dispatchService: DispatchService) { }

  ngOnInit() {    
    this.initilizeForm();
    this.loadCategory();
  }

  ngOnChanges(_changes: SimpleChanges) {
    if(this.dispatchData?.fromSite == 0) {
      this.resetArticleList();
    }
  } 

  resetArticleList() {
    this.articleForm.reset();
    this.prodTypeList = [];
    this.prodGroupList = [];
    this.articleList = [];
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
    for (const item of event.added) {
      var obj = {
        category: this.articleForm.get('category').value[0],
        prodType: this.articleForm.get('prodType').value[0],
        prodGroup: item,
        fromSiteId: this.dispatchData.fromSite
      };
      this.dispatchService.getDispatchStock(obj).subscribe((result) => {
        if (result.length > 0) {
          this.articleList = result.filter(x => x.stockQty > 0);
        }
      });
    }
  }

  onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  selectArticle(_event,cellId) {
    const ids = cellId.rowID;
    const selectedRowData = this.articleGrid.data.filter((record) => {
      return record.stockId == ids;
    });

    this.articleEvent.emit(selectedRowData);
  }

}
