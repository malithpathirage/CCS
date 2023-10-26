import { customerothercode } from './../../../_models/customerothercode';
import { CustomerHd } from 'src/app/_models/customerHd';
import { Component, OnInit, ViewChild} from '@angular/core';
import { AccountService } from '_services/account.service';
import { User } from 'src/app/_models/user';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterService } from '_services/master.service';
import { customerother } from 'src/app/_models/customerother';
import { IgxColumnComponent, IgxGridComponent , IgxComboComponent, IComboSelectionChangeEventArgs } from 'igniteui-angular';

@Component({
  selector: 'app-customer-other',
  templateUrl: './customer-other.component.html',
  styleUrls: ['./customer-other.component.css']
})
export class CustomerOtherComponent implements OnInit {
  customerOtherForm: FormGroup;
  customerList: CustomerHd[];
  ncustomerList: CustomerHd[];
  customerOtherCodeList: customerothercode[];
  ncustomerOtherCodeList: customerothercode[];
  customerOtherList: customerother[];
  validationErrors: string[] = [];
  user: User;
  saveButton: boolean=false;
  editButton: boolean=false;

  public col : IgxColumnComponent;
  public oWidth : string;
  public nWidth : string;

  @ViewChild('Customer', { read: IgxComboComponent })
  public Customer: IgxComboComponent;
  @ViewChild('Other', { read: IgxComboComponent })
  public Other: IgxComboComponent;
  @ViewChild('CustOther', { read: IgxGridComponent })
  public CustOther: IgxGridComponent;

  constructor(private masterservice: MasterService,
  private accountservices: AccountService,
  private fb: FormBuilder,
  private toastr : ToastrService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadCustomer();
    this.loadCustomerOtherCode(); 
  }
  initializeForm(){
    this.accountservices.currentUser$.forEach((element)=>{
      this.user = element});
      var authMenus = this.user.permitMenus;

      if(authMenus != null) {
        if (authMenus.filter((x) => x.autoIdx == 2195).length > 0) {
          this.saveButton = true;
        }
      }
      this.customerOtherForm = this.fb.group({
        autoId: [0],
        createUserId: this.user.userId,
        customerId:['', Validators.required],
        customerOtherId: ['', Validators.required],
        description:['',[Validators.required,Validators.maxLength(50)]]
  });    
  }
  loadCustomer(){
    
    this.masterservice.getCust().subscribe((result)=>{
      if(this.editButton==true){
        this.ncustomerList = []
        this.ncustomerList=result
      }else{
          this.customerList = []
          this.customerList=result
        } 
    });
  }
  public onResize(event) {
    this.col = event.column;
    this.oWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }
  loadCustomerOtherCode(){
    this.masterservice.getCustomerOtherCode().subscribe((result)=>{
      if(this.editButton==true){
        this.ncustomerOtherCodeList = []
        this.ncustomerOtherCodeList=result
      }else{
        this.customerOtherCodeList = []
        this.customerOtherCodeList=result
      }}); 
  }
  ////CUSTOMER OTHER CODE SELECT EVENT
  onSelectCustomerOtherCode(event){
    this.customerOtherList = []
    for(const item of event.added) {
      //ASSIGN VALUE TO ITEM
      var customerId= this.customerOtherForm.get('customerId').value;
      this.customerOtherCodeList.filter((x)=> x.autoId == item)
      //console.log(item);
      //LOAD CUSTOMER OTHER DEATILS
      this.customerOtherList=[]
      this.masterservice.getCustomerOthers(item).subscribe((result)=>{
      var record =result.filter((x)=>x.customerId==customerId)
      this.customerOtherList=record;
      //console.log(this.customerOtherList);
      });
    }
  }
  //// ALOW SINGLE SILECTION ONLY COMBO EVENT
  singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
    }
  }
  //SAVE CUSTOMER OTHER
  saveCustomerOther(){
    if(this.saveButton==true){
      var Obj ={
        createUserId : this.user.userId,
        customerId: this.customerOtherForm.get('customerId').value[0],
        custOtherId: this.customerOtherForm.get('customerOtherId').value[0],
        description:this.customerOtherForm.get('description').value.trim(),
        autoId: this.customerOtherForm.get('autoId').value
      }; 
      this.masterservice.saveCustomerOther(Obj).subscribe((result)=>{
        if (result==1){
          this.toastr.success('Customer Other Saves Successfully !!!');
          this.clearControlls();
        }
        else if (result==2){
          this.toastr.success('Customer Other Updated Succesfully !!!');
          this.clearControlls();
        }
        else if(result==-1){
          this.toastr.warning('Customer Other Alredy Exists !!!');
        }
        else if(result==-2){
          this.toastr.warning('Customer Other Failed, Already In Use !!!');
        }
        else {
          this.toastr.error('Contact Admin. Error No:- ' + result.toString());
        }
      },
      (error) => {
        this.validationErrors = error;
      });
    }
    else
      {
        this.toastr.error('Save Permission Denied !!!');
    }
  }
  onEditCustomerOther(event,cellID){
    //this.clearControlls();
    const ids = cellID.rowID;
    const selectedRowData = this.CustOther.data.filter((record)=>{
      return record.autoId == ids;
    });
    this.customerOtherForm.get('customerId').setValue(selectedRowData[0]['customerId']);
    this.customerOtherForm.get('customerOtherId').setValue(selectedRowData[0]['customerOtherId']);
    this.customerOtherForm.get('description').setValue(selectedRowData[0]['description']);
    this.customerOtherForm.get('autoId').setValue(selectedRowData[0]['autoId']);
  }
  clearControlls(){
    this.customerOtherForm.get('autoId').setValue(0);
    this.customerOtherForm.get('description').setValue('');
    this.customerOtherForm.get('customerOtherId').setValue('');
    this.customerOtherForm.get('customerId').setValue('');
  }
  resetControlls(){
    this.clearControlls();
  }
}
