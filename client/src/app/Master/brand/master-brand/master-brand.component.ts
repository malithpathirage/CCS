import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { Brand } from 'src/app/_models/brand';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-master-brand',
  templateUrl: './master-brand.component.html',
  styleUrls: ['./master-brand.component.css']
})
export class MasterBrandComponent implements OnInit {
  brandForm: FormGroup;
  user: User;
  brandList: Brand[];
  bSaveButton: boolean = false;
  validationErrors: string[] = [];

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;
  @ViewChild("brandgrid", { static: true })
  public brandgrid: IgxGridComponent;

  constructor(private fb: FormBuilder, private accountService: AccountService, private masterService: MasterService
    , private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initilizeForm();
    this.loadBrand();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach(element => {
      this.user = element;
    });

    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 118).length > 0) {
        this.bSaveButton = true;
      }
    }

    this.brandForm = this.fb.group({
      AutoId: [0],
      CreateUserId: this.user.userId,
      Name: ['', [Validators.required, Validators.maxLength(50)]]
    })
  }

  public onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  loadBrand() {
    // var user: User = JSON.parse(localStorage.getItem('user'));

    this.masterService.getBrand(this.user.locationId).subscribe(cardList => {
      this.brandList = cardList;
    })
  }

  saveBrand() {
    if(this.bSaveButton == true) {
    var obj = {
      createUserId: this.user.userId,
      Name: this.brandForm.get('Name').value.trim(),
      autoId: this.brandForm.get('AutoId').value,
      LocationId: 1,
    };
    
    this.masterService.saveBrand(obj).subscribe((result) => {
      if (result == 1) {
        this.toastr.success("Brand save Successfully !!!");
        this.loadBrand();
        this.cancelBrand();
      } else if (result == 2) {
        this.toastr.success("Brand update Successfully !!!");
        this.loadBrand();
        this.cancelBrand();
      } else if (result == -1) {
        this.toastr.warning("Brand already exists !!!");
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

  cancelBrand() {
    this.brandForm.reset();
    this.brandForm.get('AutoId').setValue(0);
    this.brandForm.get('CreateUserId').setValue(this.user.userId);
  }

  onEdit(event, cellId) {
    const ids = cellId.rowID;
    const selectedRowData = this.brandgrid.data.filter((record) => {
      return record.autoId == ids;
    });

    this.brandForm.get('Name').setValue(selectedRowData[0]["name"]);
    this.brandForm.get('AutoId').setValue(selectedRowData[0]["autoId"]);
  }

}
