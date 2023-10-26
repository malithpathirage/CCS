import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { Card } from 'src/app/_models/card';
import { Size } from 'src/app/_models/size';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-master-size',
  templateUrl: './master-size.component.html',
  styleUrls: ['./master-size.component.css'],
})
export class MasterSizeComponent implements OnInit {
  mstrSize: FormGroup;
  // sizeCardList: Card[];
  sizeList: Size[];
  user: User;
  saveobj: Size;
  sSaveButton: boolean = false;
  validationErrors: string[] = [];

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

  @ViewChild('sizeGrid', { static: true })
  public sizeGrid: IgxGridComponent;

  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    private masterService: MasterService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initilizeForm();
    // this.LoadSizeCard();
    this.LoadSizeList();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 98).length > 0) {
        this.sSaveButton = true;
      }
    }

    this.mstrSize = this.fb.group({
      AutoId: [0],
      CreateUserId: this.user.userId,
      Code: ['', [Validators.required, Validators.maxLength(10)]],
      Name: ['', [Validators.required, Validators.maxLength(50)]],
      // LinkSizeCard: ['',Validators.required]
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

  // LoadSizeCard(){
  //   this.masterService.getSizeCard().subscribe(cardList => {
  //     this.sizeCardList = cardList;
  //   })
  // }

  LoadSizeList() {
    this.masterService.getSize().subscribe((sizes) => {
      this.sizeList = sizes;
    });
  }

  // loadGridDetails(event){
  //   this.clearGridRows();
  //   for(const item of event.added) {
  //     //console.log(item);
  //     this.LoadSizeList(item);
  //   }
  // }

  clearGridRows() {
    this.sizeGrid.deselectAllRows();
    this.sizeList = [];
  }

  // refreshPage() {
  //   this.LoadSizeCard();
  // }

  saveSize() {
    // var sizeCard = this.mstrSize.get('LinkSizeCard').value[0];
    // var code = this.mstrSize.get('Code').value;
    // var name = this.mstrSize.get('Name').value;
    if (this.sSaveButton == true) {
      var obj = {
        createUserId: this.user.userId,
        // "linkSizeCard" : sizeCard,
        code: this.mstrSize.get('Code').value.trim(),
        name: this.mstrSize.get('Name').value.trim(),
        autoId: this.mstrSize.get('AutoId').value,
      };

      this.saveobj = Object.assign({}, obj);
      //console.log(this.saveobj);
      this.masterService.saveSize(this.saveobj).subscribe(
        (result) => {
          if (result == 1) {
            this.toastr.success('Size save Successfully !!!');
            this.LoadSizeList();
            this.clearControls();
          } else if (result == 2) {
            this.toastr.success('Size update Successfully !!!');
            this.LoadSizeList();
            this.clearControls();
          } else if (result == -1) {
            this.toastr.warning('Size already exists !!!');
          } else {
            this.toastr.warning(
              'Contact Admin. Error No:- ' + result.toString()
            );
          }
        },
        (error) => {
          this.validationErrors = error;
        });
    } else {
      this.toastr.error('Save permission denied !!!');
    }
  }

  clearControls() {
    //this.masterColor.reset();
    this.mstrSize.get('AutoId').setValue(0);
    this.mstrSize.get('CreateUserId').setValue(this.user.userId);
    this.mstrSize.get('Code').setValue('');
    this.mstrSize.get('Name').setValue('');
  }

  resetControls() {
    // this.mstrSize.reset();
    this.clearControls();
    // this.clearGridRows();
  }

  //// EDIT ROW LOADS DETAILS TO CONTROL
  onEdit(event, cellId) {
    //console.log(cellId.rowID);
    const ids = cellId.rowID;
    const selectedRowData = this.sizeGrid.data.filter((record) => {
      return record.autoId == ids;
    });

    //console.log(selectedRowData);
    this.mstrSize.get('Name').setValue(selectedRowData[0]['name']);
    this.mstrSize.get('AutoId').setValue(selectedRowData[0]['autoId']);
    this.mstrSize.get('Code').setValue(selectedRowData[0]['code']);
  }
}
