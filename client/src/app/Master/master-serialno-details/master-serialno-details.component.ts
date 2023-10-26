import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxDatePickerComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/_models/category';
import { SequenceSettings } from 'src/app/_models/sequenceSettings';
import { SerialNo } from 'src/app/_models/serialNo';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-master-serialno-details',
  templateUrl: './master-serialno-details.component.html',
  styleUrls: ['./master-serialno-details.component.css'],
})
export class MasterSerialnoDetailsComponent implements OnInit {
  serialNoForm: FormGroup;
  serialNoList: SequenceSettings[];
  user: User;
  validationErrors: string[] = [];
  categoryList: Category[];
  saveButton: boolean = false;

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

  @ViewChild('SerialNoGrid', { static: true })
  public SerialNoGrid: IgxGridComponent;   

  constructor(private accountService: AccountService, private fb: FormBuilder
    ,private masterService: MasterService ,private toastr: ToastrService) {}

  ngOnInit(): void {
    this.initilizeForm();
    // this.loadCategory();
    this.loadSeqSettings();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 93).length > 0) {
        this.saveButton = true;
      }
    }

    this.serialNoForm = this.fb.group({
      autoId: [0],
      createUserId: this.user.userId,
      transType: ['', [Validators.required, Validators.maxLength(50)]],
      prefix: ['', [Validators.required, Validators.maxLength(10)]],
      seqLength: ['', Validators.required],
      seqNo: ['', Validators.required],
      // currentYear: [''],
    });
  }

  public singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
    }
  }

  // loadCategory() {
  //   this.masterService.getCategory().subscribe((cardList) => {
  //     this.categoryList = cardList;
  //   });
  // }

  public onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  loadSeqSettings() {
    // var user: User = JSON.parse(localStorage.getItem('user'));
    this.masterService.getSeqSettings(this.user.locationId).subscribe((cardList) => {
      this.serialNoList = cardList;
    });
  }

  saveSerialNo() {
    if(this.saveButton == true) {
    // var user: User = JSON.parse(localStorage.getItem('user'));

    var obj = {
      createUserId: this.user.userId,
      transType: this.serialNoForm.get('transType').value.trim(),
      prefix: this.serialNoForm.get('prefix').value.trim(),
      seqLength: this.serialNoForm.get('seqLength').value,
      seqNo: this.serialNoForm.get('seqNo').value,
      autoId: this.serialNoForm.get('autoId').value,
      // currentYear: this.serialNoForm.get('currentYear').value == null ? 0 : this.serialNoForm.get('currentYear').value,
      locationId: this.user.locationId
    };

    this.masterService.saveSeqSettings(obj).subscribe(
      (result) => {
        if (result == 1) {
          this.toastr.success('Seq Settings save Successfully !!!');
          this.loadSeqSettings();
          this.clearControls();
        } else if (result == 2) {
          this.toastr.success('Seq Settings update Successfully !!!');
          this.loadSeqSettings();
          this.clearControls();
        } else if (result == -1) {
          this.toastr.warning('Seq Settings already exists !!!');
        } else {
          this.toastr.error('Contact Admin. Error No:- ' + result.toString());
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
    this.serialNoForm.reset();

    this.serialNoForm.get('autoId').setValue(0);
    this.serialNoForm.get('createUserId').setValue(this.user.userId);

    // this.serialNoForm.get('name').enable();
    // this.serialNoForm.get('prefix').enable();
  }

 
  //// EDIT ROW LOADS DETAILS TO CONTROL
  onEdit(event, cellId) {
    const ids = cellId.rowID;
    const selectedRowData = this.SerialNoGrid.data.filter((record) => {
      return record.autoId == ids;
    });

    this.serialNoForm.get('transType').setValue(selectedRowData[0]['transType']);
    this.serialNoForm.get('prefix').setValue(selectedRowData[0]['prefix']);
    this.serialNoForm.get('seqLength').setValue(selectedRowData[0]['seqLength']);
    this.serialNoForm.get('seqNo').setValue(selectedRowData[0]['seqNo']);
    // this.serialNoForm.get('currentYear').setValue(selectedRowData[0]['currentYear']);
    this.serialNoForm.get('autoId').setValue(selectedRowData[0]['autoId']);
  }
}
