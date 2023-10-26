import { Company } from 'src/app/_models/company';
import { Currency } from 'src/app/_models/currency';
import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/_models/user';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IgxColumnComponent, IgxGridComponent , IgxComboComponent, IComboSelectionChangeEventArgs } from 'igniteui-angular';
import { MasterService } from '_services/master.service';
import { AccountService } from '_services/account.service';
import { max } from 'rxjs/operators';

@Component({
  selector: 'app-master-company',
  templateUrl: './master-company.component.html',
  styleUrls: ['./master-company.component.css']
})
export class MasterCompanyComponent implements OnInit {
  masterCompanyForm : FormGroup;
  user : User;
  masterCompanyList : any;
  masterCurrencyList : Currency [];
  validationErrors: string[] = [];
  saveButton : boolean = false;
  isMasterCompanyCell : boolean = false;

  public col: IgxColumnComponent;
  public oWidth : string;
  public nWidth : string;

  @ViewChild ('masterCompanyGrid',{static : true})
  public masterCompanyGrid: IgxGridComponent;

  @ViewChild('Currency', { read: IgxComboComponent })
  public Currency: IgxComboComponent;

  constructor(private accountService : AccountService,
    private fb : FormBuilder,
    private masterService : MasterService,
    private toaster : ToastrService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadCurrancyName();
    this.loadCompanydt();
  }
  initializeForm() {
    this.accountService.currentUser$.forEach((element)=>{
      this.user = element});
      var authMenus = this.user.permitMenus;

      if(authMenus != null) {
          if (authMenus.filter((x) => x.autoIdx == 2201).length > 0) {
            this.saveButton = true;
          }
        //console.log(this.saveButton);
        }
        this.masterCompanyForm = this.fb.group({
          autoId: [0],
          createUserId: this.user.userId,
          companyName: ['',[Validators.required, Validators.maxLength(50)]],
          address : ['',[Validators.required, Validators.maxLength(100)]],
          defCurrencyId : ['',[Validators.required]], 
          svatNo : ['',[Validators.required, Validators.maxLength(50)]],
          boiRegNo : ['',[Validators.required,Validators.maxLength(50)]]
        });
  }
  public singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
    }
  }
  public onResize(event) {
    this.col = event.column;
    this.oWidth = event.prevWidth;
    this.nWidth = event.newWidth; 
  }
  loadCurrancyName(){
    this.masterCurrencyList =[]
    this.masterService.getCurrencyName().subscribe((strCurrencyList) =>{
       this.masterCurrencyList = strCurrencyList
      //console.log(this.masterCurrencyList);
    });
  }
  loadCompanydt(){
    this.masterCompanyList = []
    this.masterService.getMasterCompany().subscribe((strCompanyList) =>{
      this.masterCompanyList = strCompanyList
     //console.log(this.masterCompanyList);
    }); 
  }
  onSelectComapany(event){
    this.isMasterCompanyCell = false;
    //this.masterCompanyList = [];
    this.masterCurrencyList = [];

    for (const item of event.added){
      this.isMasterCompanyCell = true;
      //this.loadCompanydt();
      this.loadCurrancyName();
    }
  }
  saveCompanyDt(){
    if (this.saveButton == true){
      var Obj = {
        createUserId : this.user.userId,
        autoId : this.masterCompanyForm.get('autoId').value,
        companyName : this.masterCompanyForm.get('companyName').value.trim(),
        address : this.masterCompanyForm.get('address').value.trim(),
        defCurrencyId : this.masterCompanyForm.get('defCurrencyId').value[0],
        svatNo : this.masterCompanyForm.get('svatNo').value.trim(),
        boiRegNo : this.masterCompanyForm.get('boiRegNo').value.trim()
      };
      //console.log(Obj);
      this.masterService.saveMasterCompany(Obj).subscribe(
        (result) => {
          if (result == 1){
            this.toaster.success('Company Saved Succesfully !!!');
            this.loadCompanydt();
            this.clearControlls ();
          } 
          else if (result == 2){
            this.toaster.success('Company Updated Succesfully !!!');
            this.loadCompanydt();
            this.clearControlls ();
          }
          else if (result == -1){
            this.toaster.warning('Company Alredy Exists !!!');
          }
          else {
            this.toaster.error('Contact Admin. Error No:- ' + result.toString());
          }
        },
        (error) => {
          this.validationErrors = error;
        });
      }
      else
      {
        this.toaster.error('Save Permission Denied !!!');
      }
  }
  clearControlls (){
    this.masterCompanyForm.get('autoId').setValue(0);
    this.masterCompanyForm.get('companyName').setValue('');
    this.masterCompanyForm.get('address').setValue('');
    this.masterCompanyForm.get('defCurrencyId').setValue('');
    this.masterCompanyForm.get('svatNo').setValue('');
    this.masterCompanyForm.get('boiRegNo').setValue('');
  }
  resetControlls (){
    this.clearControlls();
  }

  onEditCompany(event, cellId) {
    //this.clearControlls();
    const ids = cellId.rowID;
    const selectedRowData = this.masterCompanyGrid.data.filter((record) =>{
      return record.autoId == ids;
    });
    
    this.masterCompanyForm.get('autoId').setValue(selectedRowData[0]['autoId']);
    this.masterCompanyForm.get('companyName').setValue(selectedRowData[0]['companyName']);
    this.masterCompanyForm.get('address').setValue(selectedRowData[0]['address']);
    this.masterCompanyForm.get('svatNo').setValue(selectedRowData[0]['svat']);
    this.masterCompanyForm.get('boiRegNo').setValue(selectedRowData[0]['boiregNo']);
    setTimeout(()=>{
      this.Currency.setSelectedItem(selectedRowData[0]['currencyId'],true);
    },500)
  }
}

