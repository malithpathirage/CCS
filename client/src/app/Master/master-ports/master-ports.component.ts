import { Component, OnInit,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { IComboSelectionChangeEventArgs, IgxColumnComponent, IgxComboComponent, IgxGridComponent, IgxCheckboxComponent } from 'igniteui-angular';
import { Countries } from 'src/app/_models/countries';
import { MasterService } from '_services/master.service';
import { Ports } from 'src/app/_models/ports';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-master-ports',
  templateUrl: './master-ports.component.html',
  styleUrls: ['./master-ports.component.css']
})
export class MasterPortsComponent implements OnInit {
  masterPortsForm: FormGroup;
  user  : User;
  saveButton : Boolean = false;
  countryList: Countries[];
  mCountry: number=0;
  portList: Ports[];
  validationErrors: string[] = [];

  public col : IgxColumnComponent;
  public oWidth : string;
  public nWidth : string;

  @ViewChild("portgrid", { static: true })
  public portgrid: IgxGridComponent;
  @ViewChild('country', { read: IgxComboComponent })
  public country: IgxComboComponent;
  @ViewChild('chkload', { read: IgxCheckboxComponent })
  public chkload: IgxCheckboxComponent;
  @ViewChild('chkdispatch', { read: IgxCheckboxComponent })
  public chkdispatch: IgxCheckboxComponent;

  constructor(private accountService : AccountService,
    private fb: FormBuilder,
    private masterServices: MasterService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadCountry();
    this.loadPorts();
  }
  initializeForm(){
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });
    var authMenus = this.user.permitMenus;
    if (authMenus != null) {
      if (authMenus.filter((x) => x.autoIdx == 173).length > 0) {
        this.saveButton = true;
      }
    }
    this.masterPortsForm = this.fb.group({
      portId: [0],
      portCode: ['', [Validators.required, Validators.maxLength(50)]],
      portName: ['', [Validators.required , Validators.maxLength(50)]],
      countryId: ['', [Validators.required]],
      portOfLoading:[],
      portOfDischarge:[]   
    });
  }
  public singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
      //console.log(event.newSelection);
    }
  }
  loadCountry() {
    this.masterServices.getCountries().subscribe(result => {
      this.countryList=result
      //console.log(result);
    });
  }
  loadPorts() {
    this.masterServices.getPort().subscribe(result => {
     this.portList = result;
    // console.log(this.portList);
    }); 
  }
  public onResize(event) {
    this.col = event.column;
    this.oWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }
  savePorts(){
    if (this.saveButton == true){
      var Obj = {
        createUserId : this.user.userId, 
        portCode : this.masterPortsForm.get('portCode').value.trim(),
	      portName : this.masterPortsForm.get('portName').value.trim(),
	      countryId : this.masterPortsForm.get('countryId').value[0],
	      portOfLoading : this.chkload.checked,
	      portOfDischarge : this.chkdispatch.checked,
        portId : this.masterPortsForm.get('portId').value
      };
     // console.log(Obj);
      this.masterServices.savePorts(Obj).subscribe(
        (result) => {
          if (result == 1){
            this.toastr.success('Port Saves Successfully !!!');
            this.loadPorts();
            this.clearControls();
          }else if(result == 2){
            this.toastr.success('Port Updated Successfully !!!');
            this.loadPorts();
            this.clearControls(); 
          }else if(result == -1){
            this.toastr.warning('Port Alredy Exists !!!');
          }else if(result == -2){
            this.toastr.warning('Port Save Failed, Already In Use  !!!');
          }else{
            this.toastr.error('Contact Admin. Error No:- ' + result.toString());
          }
        },(error) => {
          this.validationErrors = error;
        });   
      } else {
        this.toastr.error('Save Permission Denied !!!');
      }   
  } 
  onEditPort (event, cellId) {
    this.clearControls();
    const ids = cellId.rowID;
    const selectedRowData = this.portgrid.data.filter((record) =>{
      return record.portId == ids;
    });
    //console.log(selectedRowData );
    this.masterPortsForm.get('portCode').setValue(selectedRowData[0]['portCode']);
    this.masterPortsForm.get('portName').setValue(selectedRowData[0]['portName']);
    //this.masterPortsForm.get('countryId').setValue(selectedRowData[0]['countryId']);
    this.masterPortsForm.get('portOfLoading').setValue(selectedRowData[0]['portOfLoading']);
    this.masterPortsForm.get('portOfDischarge').setValue(selectedRowData[0]['portOfDischarge']);
    this.masterPortsForm.get('portId').setValue(selectedRowData[0]['portId']);
    this.country.setSelectedItem(selectedRowData[0]['countryId'], true);
  }
  
  clearControls() {
    this.masterPortsForm.get('portCode').setValue('');
    this.masterPortsForm.get('portName').setValue('');
    this.masterPortsForm.get('countryId').setValue('');
    this.masterPortsForm.get('portOfLoading').setValue(false);
    this.masterPortsForm.get('portOfDischarge').setValue(false);
    this.masterPortsForm.get('portId').setValue(0);
  }
  resetControls() {
   this.clearControls();
  }
}
