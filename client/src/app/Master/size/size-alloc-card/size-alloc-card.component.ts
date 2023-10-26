import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { Card } from 'src/app/_models/card';
import { PermitMenu } from 'src/app/_models/permitMenu';
import { SizeAllocation } from 'src/app/_models/SizeAllocation';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-size-alloc-card',
  templateUrl: './size-alloc-card.component.html',
  styleUrls: ['./size-alloc-card.component.css'],
})
export class SizeAllocCardComponent implements OnInit {
  sizeAllocForm: FormGroup;
  sizeCardList: Card[];
  aSizeList: SizeAllocation[];
  naSizeList: SizeAllocation[];
  user: User;
  userObj: User;
  authMenus: PermitMenu[];
  removeButton: boolean = false;
  saveButton: boolean = false;
  validationErrors: string[] = [];

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

  @ViewChild('aSizeGrid', { static: true })
  public aSizeGrid: IgxGridComponent;
  @ViewChild('naSizeGrid', { static: true })
  public naSizeGrid: IgxGridComponent;

  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    private masterService: MasterService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initilizeForm();
    this.loadSizeCard();
    this.getButtonPermission();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    this.sizeAllocForm = this.fb.group({
      autoId: [0],
      createUserId: this.user.userId,
      sizeCard: ['', Validators.required],
      // color:['', Validators.required]
    });
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

  //// loads Size cards
  loadSizeCard() {
    this.masterService.getSizeCard().subscribe((result) => {
      this.sizeCardList = result;
    });
  }

  onSizeCardSelect(event) {
    this.clearGridRows();
    for (const item of event.added) {
      this.loadSizeList(item);
    }
  }

  getButtonPermission() {
    // this.userObj = JSON.parse(localStorage.getItem('user'));
    this.authMenus = this.user.permitMenus;

    if (this.authMenus != null) {
      if (this.authMenus.filter((x) => x.autoIdx == 39).length > 0) {
        this.saveButton = true;
      }
      if (this.authMenus.filter((x) => x.autoIdx == 41).length > 0) {
        this.removeButton = true;
      }
    }
  }

  //// LOADS ASSIGN AND UNASIGNED SIZE LIST
  loadSizeList(sizeCardId) {
    this.masterService.getSizeAllocDetails(sizeCardId).subscribe((result) => {
      if (result.length > 0) {
        this.aSizeList = result.filter((x) => x.isAsign == true);
        this.naSizeList = result.filter((x) => x.isAsign == false);
      }
    });
  }

  saveSizeAllocation() {
    if (this.saveButton == true) {
      var selectedRows = this.naSizeGrid.selectedRows;
      var sizeCardId = this.sizeAllocForm.get('sizeCard').value[0];
      var sizeList = [];

      selectedRows.forEach((menuId) => {
        var data = {
          sizeCardId: sizeCardId,
          sizeId: menuId,
          createUserId: this.user.userId,
        };

        sizeList.push(data);
      });

      // console.log(sizeList);
      this.masterService.saveSizeAllocation(sizeList).subscribe((result) => {
        if (result == 1) {
          this.toastr.success('Size Assign Successfully !!!');
          this.clearGridRows();
          this.loadSizeList(sizeCardId);
        } else if (result == -1) {
          this.toastr.warning('Size Assign failed !!!');
          this.clearGridRows();
          this.loadSizeList(sizeCardId);
        } else {
          this.toastr.error('Contact Admin. Error No:- ' + result.toString());
        }
      });
    } else {
      this.toastr.error('Save Permission denied !!!');
    }
  }

  clearGridRows() {
    this.naSizeGrid.deselectAllRows();
    this.aSizeGrid.deselectAllRows();
    this.naSizeList = [];
    this.aSizeList = [];
  }

  deleteSizeAllocation() {
    if (this.removeButton == true) {
      var selectedRows = this.naSizeGrid.selectedRows;
      var sizeCardId = this.sizeAllocForm.get('sizeCard').value[0];
      var sizeList = [];

      selectedRows.forEach((menuId) => {
        var data = {
          sizeCardId: sizeCardId,
          sizeId: menuId,
          createUserId: this.user.userId,
        };

        sizeList.push(data);
      });

      // console.log(colorList);
      this.masterService.deleteSizeAllocation(sizeList).subscribe((result) => {
        if (result == 1) {
          this.toastr.success('Size remove Successfully !!!');
          this.clearGridRows();
          this.loadSizeList(sizeCardId);
        } else if (result == -1) {
          this.toastr.warning('Size remove failed !!!');
          this.clearGridRows();
          this.loadSizeList(sizeCardId);
        } else {
          this.toastr.error('Contact Admin. Error No:- ' + result.toString());
        }
      });
    } else {
      this.toastr.error('Delete permission denied !!!');
    }
  }
}
