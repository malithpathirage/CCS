import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { Card } from 'src/app/_models/card';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-master-color-card',
  templateUrl: './master-color-card.component.html',
  styleUrls: ['./master-color-card.component.css'],
})
export class MasterColorCardComponent implements OnInit {
  MstrColorCrd: FormGroup;
  user: User;
  deactiveObj: Card;
  CCardList: Card[];
  ccSaveButton: boolean = false;
  ccDisableButton: boolean = false;
  validationErrors: string[] = [];

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

  @ViewChild('MstrCCgrid', { static: true })
  public MstrCCgrid: IgxGridComponent;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private masterService: MasterService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initilizeForm();
    this.LoadColorCard();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 99).length > 0) {
        this.ccSaveButton = true;
      } if (authMenus.filter((x) => x.autoIdx == 140).length > 0) {
        this.ccDisableButton = true;
      }
    }

    this.MstrColorCrd = this.fb.group({
      AutoId: [0],
      CreateUserId: this.user.userId,
      Name: ['', [Validators.required, Validators.maxLength(50)]],
    });
  }

  public onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  LoadColorCard() {
    this.masterService.getColorCard().subscribe((cardList) => {
      this.CCardList = cardList;
    });
  }

  SaveColorCard() {
    if(this.ccSaveButton == true) {
    this.MstrColorCrd.get('Name').setValue(
      this.MstrColorCrd.get('Name').value.trim()
    );

    this.masterService.saveColorCard(this.MstrColorCrd.value).subscribe(
      (result) => {
        if (result == 1) {
          this.toastr.success('Color Card save Successfully !!!');
          this.LoadColorCard();
          this.cancelMenuList();
        } else if (result == 2) {
          this.toastr.success('Color Card update Successfully !!!');
          this.LoadColorCard();
          this.cancelMenuList();
        } else if (result == -1) {
          this.toastr.warning('Color Card already exists !!!');
        } else {
          this.toastr.error('Contact Admin. Error No:- ' + result.toString());
        }
        //this.triggerEvent();
      },
      (error) => {
        this.validationErrors = error;
      }
    );
    } else {
      this.toastr.error('Save Permission denied !!!');
    }
  }

  Deactive(cellValue, cellId) {
    const id = cellId.rowID;
    var obj = {
      createUserId: this.user.userId,
      autoId: id,
      isActive: false,
    };
    this.deactiveColorCard(obj, 'Deactive');
  }

  Active(cellValue, cellId) {
    const id = cellId.rowID;
    var obj = {
      createUserId: this.user.userId,
      autoId: id,
      isActive: true,
    };
    this.deactiveColorCard(obj, 'Active');
  }

  deactiveColorCard(obj, status) {
    if(this.ccDisableButton == true) {
    //console.log(obj);
    this.masterService.deactiveColorCard(obj).subscribe(
      (result) => {
        if (result == 1) {
          this.toastr.success('Color Card ' + status + ' Successfully !!!');
          this.LoadColorCard();
        } else if (result == 2) {
          this.toastr.success('Color Card ' + status + ' Successfully !!!');
          this.LoadColorCard();
        } else if (result == -1) {
          this.toastr.warning('Color Card already in use !!!');
        } else {
          this.toastr.error('Contact Admin. Error No:- ' + result.toString());
        }
        //this.triggerEvent();
      },
      (error) => {
        this.validationErrors = error;
      }
    );
    } else {
      this.toastr.error('Disable permission denied !!!');
    }
  }

  cancelMenuList() {
    this.MstrColorCrd.reset();
    //this.MstrColorCrd.get('Name').setValue("");
    this.MstrColorCrd.get('AutoId').setValue(0);
    this.MstrColorCrd.get('CreateUserId').setValue(this.user.userId);
  }

  //// EDIT ROW LOADS DETAILS TO CONTROL
  onEdit(event, cellId) {
    //console.log(cellId.rowID);
    const ids = cellId.rowID;
    const selectedRowData = this.MstrCCgrid.data.filter((record) => {
      return record.autoId == ids;
    });

    this.MstrColorCrd.get('Name').setValue(selectedRowData[0]['name']);
    this.MstrColorCrd.get('AutoId').setValue(selectedRowData[0]['autoId']);
  }
}
