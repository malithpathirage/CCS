import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';
import { ColorAllocation } from 'src/app/_models/colorAllocation';
import { Brand } from 'src/app/_models/brand';
import { Category } from 'src/app/_models/category';
import { brandAllocation} from 'src/app/_models/brandAllocation';

@Component({
  selector: 'app-master-brandcategory',
  templateUrl: './master-brandcategory.component.html',
  styleUrls: ['./master-brandcategory.component.css']
})
export class MasterBrandcategoryComponent implements OnInit {
  brandcategory: FormGroup;
  SaveButton: boolean = false;
  removeButton: boolean = false;
  user: User;
  categoryList: Category[];
  aBrandList: brandAllocation[];
  naBrandList: brandAllocation[];

  
  @ViewChild("aBrandGrid", { static: true }) 
  public aBrandGrid: IgxGridComponent;

  @ViewChild("naBrandGrid", { static: true }) 
  public naBrandGrid: IgxGridComponent;

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private masterService: MasterService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initilizeForm();
    this.loadCategory();

  }

  public onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }


  initilizeForm() {
    this.accountService.currentUser$.forEach(element => {
      this.user = element;
      });

    this.brandcategory = this.fb.group ({
      autoId : [0],
      createUserId : this.user.userId,
      categoryList: ['',Validators.required],
      categoryId: ['', Validators.required]
    })
  } 

  //// ALOW SINGLE SILECTION ONLY COMBO EVENT
  singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
    }
  }

  onSelectCategory(event) {
    this.clearGridRows();
    for(const item of event.added) {
      this.loadBrandList(item);
    }
  }

  loadCategory() {
    this.masterService.getCategory().subscribe((result) => {
      this.categoryList = result;
    });
  }
  

  deleteBrandAllocation() {
    var selectedRows = this.aBrandGrid.selectedRows;
    var mainCatId = this.brandcategory.get("categoryId").value[0];

    var brandtocatList = [];

    selectedRows.forEach(menuId => {
      var data = {
        maincatid: mainCatId,
        subcatid: menuId,
      };

      brandtocatList.push(data);

      this.masterService.deleteBrandToCategoryAllocation(brandtocatList).subscribe((result) =>{
        if(result == 1) {
          this.toastr.success("Brand Remove Successfully !!!");
          this.clearGridRows();
          this.loadBrandList(mainCatId);
        } else if (result == -1) {
          this.toastr.warning("Brand Remove failed !!!");
          this.clearGridRows();
          this.loadBrandList(mainCatId);
        } else {
          this.toastr.warning("Contact Admin. Error No:- " + result.toString());
        }
      }) 

    });

    
   }
  

  
  saveBrandAllocation() {
    var selectedRows = this.naBrandGrid.selectedRows;
    var mainCatId = this.brandcategory.get("categoryId").value[0];

    var brandtocatList = [];

    selectedRows.forEach(brandId => {
      var data = {
        maincatid: mainCatId,
        subcatid: brandId,
        createUserId: this.user.userId,
        companyid: this.user.locationId,
        moduleid: this.user.moduleId,
      };

      brandtocatList.push(data);

      this.masterService.saveBrandAllocation(brandtocatList).subscribe((result) => {
        if (result == 1) {
          this.toastr.success("Brand Save Successfully !!!");
          this.clearGridRows();
          this.loadBrandList(mainCatId);
        } else if (result == -1) {
          this.toastr.warning("Brand Remove failed !!!");
          this.clearGridRows();
          this.loadBrandList(mainCatId);
        } else {
          this.toastr.warning("Contact Admin. Error No:- " + result.toString());
        }
      })

    });
  }

  clearGridRows() {
    this.aBrandGrid.deselectAllRows();
    this.naBrandGrid.deselectAllRows();
    this.aBrandList = [];
    this.naBrandList = [];
  }


  //// LOADS ASSIGN AND UNASIGNED BRAND LIST 
  loadBrandList (mainId) {
    this.masterService.getBrandAllocDetails(mainId).subscribe(result => {
      console.log(result);
      if(result.length > 0) {
        this.aBrandList = result.filter(x => x.isAsign == true);
        this.naBrandList = result.filter(x => x.isAsign == false);
      }      
    })
  }   
  

}
