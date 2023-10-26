import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/_models/user';
import { Size } from 'src/app/_models/size';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';
import { MaterialType } from 'src/app/_models/materialType';

@Component({
  selector: 'app-master-materialtype',
  templateUrl: './master-materialtype.component.html',
  styleUrls: ['./master-materialtype.component.css']
})
export class MasterMaterialtypeComponent implements OnInit {
  matTypeForm: FormGroup;
  materialTypeList: MaterialType[];
  user: User;
  saveobj: MaterialType;
  validationErrors: string[] = [];
  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;
  saveButton: boolean = false;

  @ViewChild("MatGrid", { static: true })
  public MatGrid: IgxGridComponent;

  constructor(private accountService: AccountService, private masterService: MasterService, private fb: FormBuilder, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadMaterialType();
    this.initilizeForm();
  }

  public onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  loadMaterialType() {
    this.masterService.getMaterialType().subscribe(cardList => {
      this.materialTypeList = cardList;
    })
  }

  refreshPage() {
    this.matTypeForm.reset();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach(element => {
      this.user = element;
    });

    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 119).length > 0) {
        this.saveButton = true;
      }
    }

    this.matTypeForm = this.fb.group({
      AutoId: [0],
      CreateUserId: this.user.userId,
      Code: ['', [Validators.required, Validators.maxLength(5)]],
      Name: ['', [Validators.required, Validators.maxLength(30)]]
    })
  }

  SaveMaterialType() {
    if(this.saveButton == true) {
    var obj = {
      "createUserId": this.user.userId,
      "code": this.matTypeForm.get('Code').value.trim(),
      "name": this.matTypeForm.get('Name').value.trim(),
      "autoId": this.matTypeForm.get('AutoId').value
    }
    this.saveobj = Object.assign({}, obj);
    this.masterService.saveMaterialType(this.saveobj).subscribe((result) => {
      if (result == 1) {
        this.toastr.success("Material Type save Successfully !!!");
        this.loadMaterialType();
        this.clearControls();
      } else if (result == 2) {
        this.toastr.success("Material Type update Successfully !!!");
        this.loadMaterialType();
        this.clearControls();
      } else if (result == -1) {
        this.toastr.warning("Material Type already exists !!!");
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

  onEdit(event, cellId) {
    const ids = cellId.rowID;
    const selectedRowData = this.MatGrid.data.filter((record) => {
      return record.autoId == ids;
    });

    this.matTypeForm.get('Name').setValue(selectedRowData[0]["name"]);
    this.matTypeForm.get('AutoId').setValue(selectedRowData[0]["autoId"]);
    this.matTypeForm.get('Code').setValue(selectedRowData[0]["code"]);
  }

  clearControls() {
    this.matTypeForm.get('AutoId').setValue(0);
    this.matTypeForm.get('CreateUserId').setValue(this.user.userId);
    this.matTypeForm.get('Code').setValue("");
    this.matTypeForm.get('Name').setValue("");
  }

  resetControls() {
    this.matTypeForm.reset();
    this.clearControls();
  }

}
