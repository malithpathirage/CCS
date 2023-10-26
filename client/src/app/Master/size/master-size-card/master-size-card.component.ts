import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { Card } from 'src/app/_models/card';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-master-size-card',
  templateUrl: './master-size-card.component.html',
  styleUrls: ['./master-size-card.component.css'],
})
export class MasterSizeCardComponent implements OnInit {
  sizeCrdForm: FormGroup;
  user: User;
  sCardList: Card[];
  validationErrors: string[] = [];
  scSaveButton: boolean = false;
  scDisableButton: boolean = false;

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;
  @ViewChild('sizeCGrid', { static: true })
  public sizeCGrid: IgxGridComponent;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private masterService: MasterService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initilizeForm();
    this.loadSizeCard();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 97).length > 0) {
        this.scSaveButton = true;
      }
      if (authMenus.filter((x) => x.autoIdx == 139).length > 0) {
        this.scDisableButton = true;
      }
    }

    this.sizeCrdForm = this.fb.group({
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

  loadSizeCard() {
    this.masterService.getSizeCard().subscribe((cardList) => {
      this.sCardList = cardList;
    });
  }

  saveSizeCard() {
    if (this.scSaveButton == true) {
      this.sizeCrdForm
        .get('Name')
        .setValue(this.sizeCrdForm.get('Name').value.trim());

      this.masterService.saveSizeCard(this.sizeCrdForm.value).subscribe(
        (result) => {
          if (result == 1) {
            this.toastr.success('Size Card save Successfully !!!');
            this.loadSizeCard();
            this.clearControls();
          } else if (result == 2) {
            this.toastr.success('Size Card update Successfully !!!');
            this.loadSizeCard();
            this.clearControls();
          } else if (result == -1) {
            this.toastr.warning('Size Card already exists !!!');
          } else {
            this.toastr.warning(
              'Contact Admin. Error No:- ' + result.toString()
            );
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

  clearControls() {
    this.sizeCrdForm.reset();
    //this.MstrColorCrd.get('Name').setValue("");
    this.sizeCrdForm.get('AutoId').setValue(0);
    this.sizeCrdForm.get('CreateUserId').setValue(this.user.userId);
  }

  //// EDIT ROW LOADS DETAILS TO CONTROL
  onEdit(event, cellId) {
    //console.log(cellId.rowID);
    const ids = cellId.rowID;
    const selectedRowData = this.sizeCGrid.data.filter((record) => {
      return record.autoId == ids;
    });

    this.sizeCrdForm.get('Name').setValue(selectedRowData[0]['name']);
    this.sizeCrdForm.get('AutoId').setValue(selectedRowData[0]['autoId']);
  }

  Deactive(cellValue, cellId) {
    const id = cellId.rowID;
    var obj = {
      createUserId: this.user.userId,
      autoId: id,
      isActive: false,
    };
    this.deactiveSizeCard(obj, 'Deactive');
  }

  Active(cellValue, cellId) {
    const id = cellId.rowID;
    var obj = {
      createUserId: this.user.userId,
      autoId: id,
      isActive: true,
    };
    this.deactiveSizeCard(obj, 'Active');
  }

  deactiveSizeCard(obj, status) {
    if (this.scDisableButton == true) {
      //console.log(obj);
      this.masterService.deactiveSizeCard(obj).subscribe(
        (result) => {
          if (result == 1) {
            this.toastr.success('Size Card ' + status + ' Successfully !!!');
            this.loadSizeCard();
          } else if (result == 2) {
            this.toastr.success('Size Card ' + status + ' Successfully !!!');
            this.loadSizeCard();
          } else if (result == -1) {
            this.toastr.warning('Size Card already in use !!!');
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
}
