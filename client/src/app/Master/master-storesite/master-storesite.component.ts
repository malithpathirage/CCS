import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/_models/user';
import { Size } from 'src/app/_models/size';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';
import { StoreSite } from 'src/app/_models/storeSite';


@Component({
  selector: 'app-master-storesite',
  templateUrl: './master-storesite.component.html',
  styleUrls: ['./master-storesite.component.css'],
})
export class MasterStoresiteComponent implements OnInit {
  mstrStoresite: FormGroup;
  sizeStoreSiteList: StoreSite[];
  sizeList: Size[];
  user: User;
  saveobj: StoreSite;
  saveButton: boolean = false;
  validationErrors: string[] = [];
  STDeactiveButton: boolean=false;
  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;
  @ViewChild('siteGrid', { static: true })
  public siteGrid: IgxGridComponent;
  constructor(
    private accountService: AccountService,
    private masterService: MasterService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.LoadUnits();
    this.initilizeForm();
  }
  LoadUnits() {
    this.masterService.getStoreSite().subscribe((cardList) => {
      this.sizeStoreSiteList = cardList;
    });
  }

  SaveStoreSite() {
    if(this.saveButton == true) {
    var obj = {
      createUserId: this.user.userId,
      siteCode: this.mstrStoresite.get('SiteCode').value.trim(),
      siteName: this.mstrStoresite.get('SiteName').value.trim(),
      autoId: this.mstrStoresite.get('AutoId').value,
    };
    this.saveobj = Object.assign({}, obj);
    //console.log(this.saveobj);
    this.masterService.saveStoreSite(this.saveobj).subscribe(
      (result) => {
        if (result == 1) {
          this.toastr.success('Site save Successfully !!!');
          this.LoadUnits();
          this.clearControls();
        } else if (result == 2) {
          this.toastr.success('Site update Successfully !!!');
          this.LoadUnits();
          this.clearControls();
        } else if (result == -1) {
          this.toastr.warning('Site already exists !!!');
        } else {
          this.toastr.error('Contact Admin. Error No:- ' + result.toString());
        }
      },
      (error) => {
        this.validationErrors = error;
      }
    );
    } else {
      this.toastr.error('Save Permission denied !!!');
    }
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 103).length > 0) {
        this.saveButton = true;
      }
      if (authMenus.filter((x) => x.autoIdx == 103).length > 0) {
        this.STDeactiveButton = true;
      }
    }

    this.mstrStoresite = this.fb.group({
      AutoId: [0],
      CreateUserId: this.user.userId,
      SiteCode: ['', [Validators.required, Validators.maxLength(10)]],
      SiteName: ['', [Validators.required, Validators.maxLength(50)]],
    });
  }

  refreshPage() {
    this.mstrStoresite.reset();
  }

  onEdit(event, cellId) {
    //console.log(cellId.rowID);
    const ids = cellId.rowID;
    const selectedRowData = this.siteGrid.data.filter((record) => {
      return record.autoId == ids;
    });

    //console.log(selectedRowData);
    this.mstrStoresite.get('SiteName').setValue(selectedRowData[0]['siteName']);
    this.mstrStoresite.get('AutoId').setValue(selectedRowData[0]['autoId']);
    this.mstrStoresite.get('SiteCode').setValue(selectedRowData[0]['siteCode']);
  }

  clearControls() {
    //this.masterColor.reset();
    this.mstrStoresite.get('AutoId').setValue(0);
    this.mstrStoresite.get('CreateUserId').setValue(this.user.userId);
    this.mstrStoresite.get('SiteCode').setValue('');
    this.mstrStoresite.get('SiteName').setValue('');
  }

  resetControls() {
    this.mstrStoresite.reset();
    this.clearControls();
    //this.clearGridRows();
  }

  public onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }
  deactive(cellValue, cellId) {
    const id = cellId.rowID;

    var obj = {
      createUserId: this.user.userId,
      autoId: id,
      bActive: false,
    };
    this.deactiveStoreSite(obj, 'Deactive');
    //console.log(obj);
  }

  active(cellValue, cellId) {
    const id = cellId.rowID;
    var obj = {
      createUserId: this.user.userId,
      autoId: id,
      bActive: true,
    };
    this.deactiveStoreSite(obj, 'Active');
  }
  deactiveStoreSite(obj, status){
    if(this.STDeactiveButton  == true){
      this.masterService.storesiteDeactivate(obj).subscribe((result) =>{
        if (result == 1) {
          this.toastr.success('StoreSite' + status + 'Successfully !!!');
          this.LoadUnits();
        }else if (result == 2) {
          this.toastr.success('StoreSite' + status + 'Successfully !!!');
          this.LoadUnits();
        }else if (result == -1) {
          this.toastr.warning('StoreSite Already In Use !!!');
          this.LoadUnits();
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
}
