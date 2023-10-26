import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { ProductGroup } from 'src/app/_models/productGroup';
import { ProductType } from 'src/app/_models/productType';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-master-prod-group',
  templateUrl: './master-prod-group.component.html',
  styleUrls: ['./master-prod-group.component.css']
})
export class MasterProdGroupComponent implements OnInit {
  prodGroupForm: FormGroup;
  prodGroupList: any[];
  // prodTypeList: ProductType[];
  user: User;
  validationErrors: string[] = [];
  pgSaveButton: boolean = false;
  pgDisableButton: boolean = false;
  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;
  
  @ViewChild("ProdGroupGrid", { static: true }) 
  public ProdGroupGrid: IgxGridComponent;

  constructor(private accountService: AccountService, private fb: FormBuilder
    ,private masterService: MasterService ,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initilizeForm();
    this.loadProductGroup();
    // this.loadProductTypeAll();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach(element => {
      this.user = element;
      });

      var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 114).length > 0) {
        this.pgSaveButton = true;
      } if (authMenus.filter((x) => x.autoIdx == 143).length > 0) {
        this.pgDisableButton = true;
      }       
    }

    this.prodGroupForm = this.fb.group ({
      autoId : [0],
      createUserId : this.user.userId,
      prodGroupName: ['', [Validators.required , Validators.maxLength(50)]],
      prodGroupCode: ['', [Validators.required , Validators.maxLength(10)]],
      //serialNo: ['', [Validators.required ]],
      // prodTypeId: ['', [Validators.required ]]
    })
  } 

  public singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
    }
  }

  // loadProductTypeAll(){
  //   this.masterService.getProductTypeAll().subscribe(typeList => {
  //     this.prodTypeList = typeList;
  //     //console.log(this.prodTypeList);
  //   });    
  // }

  public onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  // onSelectChange(event) {
  //   this.prodGroupList = [];
  //   for (const item of event.added) {
  //     this.loadProductGroup(item);
  //   }
  // }

  loadProductGroup(){
    this.masterService.getProductGroupAll().subscribe(groupList => {
      //console.log(groupList);
      this.prodGroupList = groupList;
    })
  }


  saveProductGroup() { 
    if(this.pgSaveButton == true) {
    // var prodTypeId = this.prodGroupForm.get('prodTypeId').value[0];
    // var user: User = JSON.parse(localStorage.getItem('user'));

    var obj = {
      createUserId: this.user.userId,
      prodGroupName: this.prodGroupForm.get('prodGroupName').value.trim(),
      prodGroupCode: this.prodGroupForm.get('prodGroupCode').value.trim(),
      autoId: this.prodGroupForm.get('autoId').value,
      // prodTypeId: this.prodGroupForm.get('prodTypeId').value[0],
      locationId: this.user.locationId
    };

    this.masterService.saveProductGroup(obj).subscribe((result) => {    
      if (result == 1) {
        this.toastr.success("Product Group save Successfully !!!");
        this.loadProductGroup();
        this.clearControls();
      } else if (result == 2) {
        this.toastr.success("Product Group update Successfully !!!");
        this.loadProductGroup();
        this.clearControls();
      } else if (result == -1) {
        this.toastr.warning("Product Group already exists !!!");
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
    this.prodGroupForm.get('autoId').setValue(0);
    this.prodGroupForm.get('createUserId').setValue(this.user.userId);
    this.prodGroupForm.get('prodGroupCode').reset();
    this.prodGroupForm.get('prodGroupName').reset();

    this.prodGroupForm.get('prodGroupName').enable();
    this.prodGroupForm.get('prodGroupCode').enable();
    // this.prodGroupForm.get('prodTypeId').enable();
  }

  deactive(cellValue, cellId) {
    const id = cellId.rowID;

    var obj = {
      createUserId: this.user.userId,
      autoId: id,
      isActive: false,
    };

    this.deactiveProdGroup(obj, 'Deactive');
  }

  active(cellValue, cellId) {
    const id = cellId.rowID;

    var obj = {
      createUserId: this.user.userId,
      autoId: id,
      isActive: true,
    };
    this.deactiveProdGroup(obj, 'Active');
  }

  deactiveProdGroup(obj, status) {
    if(this.pgDisableButton == true) {
    // console.log(obj);
    // var prodTypeId = this.prodGroupForm.get('prodTypeId').value[0];

    this.masterService.deactiveProductGroup(obj).subscribe(
      (result) => {
        if (result == 1) {
          this.toastr.success('Product Group ' + status + ' Successfully !!!');
          this.loadProductGroup();
        } else if (result == 2) {
          this.toastr.success('Product Group ' + status + ' Successfully !!!');
          this.loadProductGroup();
        } else if (result == -1) {
          this.toastr.warning('Deactive failed, already allocated !!!');
        } else {
          this.toastr.error('Contact Admin. Error No:- ' + result.toString());
        }
      },
      (error) => {
        this.validationErrors = error;
      }
    );
    } else {
      this.toastr.error('Disable permission denied !!!');
    }
  }
 
   //// EDIT ROW LOADS DETAILS TO CONTROL 
  //  onEdit(event,cellId) {
  //   const ids = cellId.rowID;    
  //   const selectedRowData = this.ProdGroupGrid.data.filter((record) => {
  //       return record.autoId == ids;
  //   });

  //   this.prodGroupForm.get('prodGroupName').setValue(selectedRowData[0]["prodGroupName"]);
  //   this.prodGroupForm.get('prodGroupCode').setValue(selectedRowData[0]["prodGroupCode"]);
  //   // this.prodGroupForm.get('serialNo').setValue(selectedRowData[0]["serialNo"]);
  //   // this.prodGroupForm.get('prodTypeId').setValue(selectedRowData[0]["prodTypeId"]);
  //   this.prodGroupForm.get('autoId').setValue(selectedRowData[0]["autoId"]);

  //   this.prodGroupForm.get('prodGroupName').disable();
  //   this.prodGroupForm.get('prodGroupCode').disable();
  //   this.prodGroupForm.get('prodTypeId').disable();
 
  // }

}
