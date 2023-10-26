import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { ToastrService } from 'ngx-toastr';
import { Countries } from 'src/app/_models/countries';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {
  countriesForm: FormGroup;
  countriesList: Countries[]; 
  user: User;
  saveButton: boolean = false;
  validationErrors: string[] = [];

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

  @ViewChild('countriesGrid', { static: true })
  public countriesGrid: IgxGridComponent;
  
  constructor(private accountService: AccountService,
    private masterService: MasterService,
    private fb: FormBuilder,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initilizeForm();
    this.loadCountries();
  }

  initilizeForm() {
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    var authMenus = this.user.permitMenus;

    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 110).length > 0) {
        this.saveButton = true;
      }
    }

    this.countriesForm = this.fb.group({
      autoId: [0],
      createUserId: this.user.userId,
      name: ['', [Validators.required, Validators.maxLength(50)]],
      code: ['', [Validators.required, Validators.maxLength(5) ]],
      alpha2Code: ['', [Validators.maxLength(5)]],
      alpha3Code: ['', [Validators.maxLength(5)]],
      numeric: [0]
    });
  }

  public onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  loadCountries() {
    this.masterService.getCountries().subscribe((result) => {
      this.countriesList = result;
    });
  }  

  saveCountries() {
    if(this.saveButton == true) {
    var obj = {
      createUserId: this.user.userId,
      name: this.countriesForm.get('name').value.trim(),
      code: this.countriesForm.get('code').value.trim(),
      alpha2Code: this.countriesForm.get('alpha2Code').value == null ? '' : this.countriesForm.get('alpha2Code').value.trim(),
      alpha3Code: this.countriesForm.get('alpha3Code').value == null ? '' : this.countriesForm.get('alpha3Code').value.trim(),
      numeric: this.countriesForm.get('numeric').value == null ? 0 : this.countriesForm.get('numeric').value,
      autoId: this.countriesForm.get('autoId').value
    };

    // console.log(obj);
    this.masterService.saveCountries(obj).subscribe(result => {
        if (result == 1) {
          this.toastr.success('Countries save Successfully !!!');
          this.loadCountries();
          this.clearControls();
        } else if (result == 2) {
          this.toastr.success('Countries update Successfully !!!');
          this.loadCountries();
          this.clearControls();
        } else if (result == -1) {
          this.toastr.warning('Countries already exists !!!');
        } else if (result == -2) {
          this.toastr.warning('Countries fail, already in use !!!');
        } else {
          this.toastr.error('Contact Admin. Error No:- ' + result.toString());
        }
      },
      (error) => {
        this.validationErrors = error;
      });
    } else {
      this.toastr.error('Save Permission denied !!!');
    }
  }

  onEditCountries(event, cellId) {
    this.clearControls();
    //console.log(cellId.rowID);
    const ids = cellId.rowID;
    const selectedRowData = this.countriesGrid.data.filter((record) => {
      return record.autoId == ids;
    });

    //console.log(selectedRowData);
    this.countriesForm.get('name').setValue(selectedRowData[0]['name']);
    this.countriesForm.get('autoId').setValue(selectedRowData[0]['autoId']);
    this.countriesForm.get('code').setValue(selectedRowData[0]['code']);
    this.countriesForm.get('alpha2Code').setValue(selectedRowData[0]['alpha2Code']);
    this.countriesForm.get('alpha3Code').setValue(selectedRowData[0]['alpha3Code']);
    this.countriesForm.get('numeric').setValue(selectedRowData[0]['numeric']);
    // this.countriesForm.get('name').disable();
  }

  clearControls() {
    //this.masterColor.reset();
    this.countriesForm.get('autoId').setValue(0);
    this.countriesForm.get('createUserId').setValue(this.user.userId);
    this.countriesForm.get('name').setValue('');
    this.countriesForm.get('code').setValue('');
    this.countriesForm.get('alpha2Code').setValue('');
    this.countriesForm.get('alpha3Code').setValue('');
    this.countriesForm.get('numeric').setValue('');
  }

  resetControls() {
    // this.mstrUnits.reset();
    this.clearControls();
    //this.clearGridRows();
  }

}
