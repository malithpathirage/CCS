import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxComboComponent, IgxDialogComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { IndentType } from 'src/app/_models/IndentDetails';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { IndentdetailsService } from '_services/indentdetails.service';

@Component({
  selector: 'app-adhoc-indent-list',
  templateUrl: './adhoc-indent-list.component.html',
  styleUrls: ['./adhoc-indent-list.component.css']
})
export class AdhocIndentListComponent implements OnInit {
  indentHdForm: FormGroup; 
  user: User;
  indentTypeList = [{ autoId: 1 , type: 'Sales Order'},
      {autoId: 2 , type: 'None'}];
  isArticle:boolean = false;
  isSalesOrder: boolean = false; 
  validationErrors: string[] = [];

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;
  saveButton:boolean = false;

  @ViewChild('type', { read: IgxComboComponent })
  public type: IgxComboComponent; 
  @ViewChild('savedialog', { read: IgxDialogComponent })
  public savedialog: IgxDialogComponent;

  public successInput: Object = {result: 0};

  artIndentList: any= [];
  soIndentList: any=[];

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

  constructor(private accountService: AccountService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private indentServices: IndentdetailsService) { }

  ngOnInit(): void {
    this.initilizeForm();
    // this.loadIndentType();    
    this.setInitialItem();    
  }

  setInitialItem(): void {
    setTimeout(() => {
      this.type.setSelectedItem(2,true);
    }, 200);    
  }

  initilizeForm() {
    var date: Date = new Date(Date.now());
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    var authMenus = this.user.permitMenus;    
    if (authMenus != null) {      
      if (authMenus.filter((x) => x.autoIdx == 2223).length > 0) {
        this.saveButton = true;
      }
    }

    this.indentHdForm = this.fb.group({
      indentId: [0],
      indentType: [2]
    });
  }

  loadIndentType() {
    this.indentTypeList = [{ autoId: 1 , type: 'Sales Order'},
      {autoId: 2 , type: 'None'}];     
  } 
  
  singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
    }
  }

  onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  onTypeSelect(event) {
    for (const item of event.added) {
      if (item == 1) {
        this.isSalesOrder = true;
        this.isArticle = true;
      } else if (item == 2) {
        this.isArticle = true;
        this.isSalesOrder = false;
      }
    }
  }

  getArticleIndentDetails(event){
    this.artIndentList = event;
    // console.log(event);
  }

  getSOIndentDetails(event) {
    this.soIndentList = event;
  }

  onSaveSelected(event) {  
    this.savedialog.close();
    var indentType = this.indentHdForm.get('indentType').value[0];
    var indDtList = [];  
    var indHdList;  
    var indSOList = [];
    /// SAVE Article Indent List
    if (this.artIndentList.length > 0 && indentType == 2) {

      this.artIndentList.forEach(item => {
        indHdList = {
          mrHeaderId:0,
          createUserId:this.user.userId,
          type:IndentType.AdhocIndentNone    
        };
        var obj = {
          articleId:item.articleId, 
          mrDetailsId:0,        
          colorId:item.colorId,
          sizeId:item.sizeId,
          uomId:item.uomId,
          openQty:item.totQty,
          unitPrice:item.unitPrice
        };    
        indDtList.push(obj);    
      }); 
    }
    else if ( this.soIndentList.length > 0 && this.artIndentList.length > 0 && indentType == 1 ) {
      this.soIndentList.forEach(item => {
        indHdList = {
          mrHeaderId:item.soHeaderId,
          createUserId:this.user.userId,
          type:IndentType.AdhocIndentSalesOrder          
        };

        var obj = {
          soDelId: item.soDelId
        }
        indSOList.push(obj);
      });

      this.artIndentList.forEach (line => {
        var obj = {
          articleId:line.articleId,
          mrDetailsId: 0,
          colorId:line.colorId,
          sizeId:line.sizeId,
          uomId:line.uomId,
          openQty:line.totQty,
          unitPrice:line.unitPrice
        };
        indDtList.push(obj);
      });
    }
    
    if (indDtList.length > 0) {
      var indentList = {
        indentHeader: indHdList,
        IndentSODetails: indSOList,
        indentDetails : indDtList
      }  
      this.saveIndent(indentList);
    } 
  }

  saveIndent(indentList) {
    // console.log(indentList);
    this.indentServices.saveIntentDetails(indentList).subscribe(result => {
      // var indentType = this.indentHdForm.get('indentType').value[0];
      if (result == 1) {
        this.toastr.success('Adhoc Indent save successfully !!!');
        this.successInput = {result : 1} ;            
      } else {
        this.toastr.warning('Contact Admin. Error No:- ' + result.toString());
      }
    });
  }

}
