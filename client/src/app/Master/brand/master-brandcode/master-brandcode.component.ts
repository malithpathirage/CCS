import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';
import { Brand } from 'src/app/_models/brand';
import { BrandCode } from 'src/app/_models/brandCode';

@Component({
  selector: 'app-master-brandcode',
  templateUrl: './master-brandcode.component.html',
  styleUrls: ['./master-brandcode.component.css']
})
export class MasterBrandcodeComponent implements OnInit {
  brandCodeForm: FormGroup;
  Brand: Brand[];
  BrandCode: BrandCode[];
  user: User;
  saveobj: BrandCode;
  bcSaveButton: boolean = false;
  bcDeactiveButton: boolean = false;
  validationErrors: string[] = [];
  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

  @ViewChild("BrandCodegrid", { static: true })
  public BrandCodegrid: IgxGridComponent;

  constructor(private accountService: AccountService, private fb: FormBuilder
    , private masterService: MasterService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initilizeForm();
    this.LoadBrand();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach(element => {
      this.user = element;
    });

    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 117).length > 0) {
        this.bcSaveButton = true;
      }
      if (authMenus.filter((x) => x.autoIdx == 117).length > 0) {
        this.bcDeactiveButton = true;
      }
    }

    this.brandCodeForm = this.fb.group({
      AutoId: [0],
      CreateUserId: this.user.userId,
      Name: ['', [Validators.required, Validators.maxLength(50)]],
      BrandId: ['', Validators.required]
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

  LoadBrand() {
    // var user: User = JSON.parse(localStorage.getItem('user'));
    this.masterService.getBrand(this.user.locationId).subscribe(cardList => {
      this.Brand = cardList;
    })
  }

  loadBrandCode(brandId) {
    this.masterService.getBrandCode(brandId).subscribe(Brandswithis => {
      this.BrandCode = Brandswithis;
     // console.log(this.BrandCode);
    })
  }

  loadGridDetails(event) {
    this.clearGridRows();
    for (const item of event.added) {
      this.loadBrandCode(item);
    }
  }

  clearGridRows() {
    this.BrandCodegrid.deselectAllRows();
    this.BrandCode = [];
  }

  deactive(cellValue, cellId) {
    const id = cellId.rowID;

    var obj = {
      createUserId: this.user.userId,
      autoId: id,
      isActive: false,
    };
    this.deactiveBrandCode(obj, 'Deactive');
  }

  active(cellValue, cellId) {
    const id = cellId.rowID;
    var obj = {
      createUserId: this.user.userId,
      autoId: id,
      isActive: true,
    };
    this.deactiveBrandCode(obj, 'Active');
  }

  deactiveBrandCode(obj, status){
    if(this.bcDeactiveButton  == true){
      var brandId = this.brandCodeForm.get('BrandId').value[0];
      this.masterService.deactiveBrandCode(obj).subscribe((result) =>{
        if (result == 1) {
          this.toastr.success('BrandCode' + status + 'Successfully !!!');
          this.loadBrandCode(brandId);
        }else if (result == 2) {
          this.toastr.success('BrandCode' + status + 'Successfully !!!');
          this.loadBrandCode(brandId);
        }else if (result == -1) {
          this.toastr.warning('BrandCode already in use !!!');
          this.loadBrandCode(brandId);
        }else{
          this.toastr.error('Contact Admin. Error No:- ' + result.toString());
        }
      },
      (error) => {
        this.validationErrors = error;
      });
    }
    else {
      this.toastr.error('Disable Permission denied !!!');
    }   
  }

  saveBrandCode() {
    if(this.bcSaveButton == true) {
    var brandid = this.brandCodeForm.get('BrandId').value[0];
    var obj = {
      createUserId: this.user.userId,
      BrandId: this.brandCodeForm.get('BrandId').value[0],
      name: this.brandCodeForm.get('Name').value.trim(),
      autoId: this.brandCodeForm.get('AutoId').value,
    };

    this.saveobj = Object.assign({}, obj);
    this.masterService.saveBrandCode(this.saveobj).subscribe((result) => {
      if (result == 1) {
        this.toastr.success("Brand Code Save Successfully !!!");
        this.loadBrandCode(brandid);
        this.clearControls();
      } else if (result == 2) {
        this.toastr.success("Brand Code update Successfully !!!");
        this.loadBrandCode(brandid);
        this.clearControls();
      } else if (result == -1) {
        this.toastr.warning("Brand Code already exists !!!");
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
    this.brandCodeForm.get('AutoId').setValue(0);
    this.brandCodeForm.get('CreateUserId').setValue(this.user.userId);
    this.brandCodeForm.get('Name').setValue("");
  }

  resetControls() {
    this.brandCodeForm.reset();
    this.clearControls();
    this.clearGridRows();
  }


  onEdit(event, cellId) {
    const ids = cellId.rowID;
    const selectedRowData = this.BrandCodegrid.data.filter((record) => {
      return record.autoId == ids;
    });
    
    this.brandCodeForm.get('Name').setValue(selectedRowData[0]["name"]);
    this.brandCodeForm.get('AutoId').setValue(selectedRowData[0]["autoId"]);
  }

}
