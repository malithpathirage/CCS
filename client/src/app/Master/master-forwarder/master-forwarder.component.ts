import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from '_services/account.service';
import { IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { User } from 'src/app/_models/user';
import { Forwarder } from 'src/app/_models/forwarder';
import { ToastrService } from 'ngx-toastr';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-master-forwarder',
  templateUrl: './master-forwarder.component.html',
  styleUrls: ['./master-forwarder.component.css']
})
export class MasterForwarderComponent implements OnInit {
  ForwarderForm: FormGroup;
  user  : User;
  saveButton : Boolean = false;
  forwarderList : Forwarder[];
  validationErrors: string[] = [];

  public col : IgxColumnComponent;
  public oWidth : string;
  public nWidth : string;

  @ViewChild('ForwarderGrid' , {static : true})
  public ForwarderGrid: IgxGridComponent;
  constructor(private accountService : AccountService,
    private fb : FormBuilder,
    private masterService : MasterService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.getForwardingAgents();
  }
  initializeForm(){
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
      });
      var authMenus = this.user.permitMenus;
      if(authMenus != null) {
        if (authMenus.filter((x) => x.autoIdx == 2193).length > 0) {
          this.saveButton = true;
        }
      }
      this.ForwarderForm = this.fb.group({
        forwarderId: [0],
        createUserId: this.user.userId,
        name : ['', [Validators.required, Validators.maxLength(50)]],
        contact : ['', [Validators.required, Validators.maxLength(20)]], 
        email : ['', [Validators.required, Validators.maxLength(30)]],   
    });
  }
  public onResize(event) {
    this.col = event.column;
    this.oWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }
  getForwardingAgents() {
    this.forwarderList = []
    this.masterService.getForwarder().subscribe((result) => {
      this.forwarderList = result;
      //console.log(result);
    });
  }
  saveForwarder(){
    if(this.saveButton==true){
      var Obj={
        forwarderId: this.ForwarderForm.get('forwarderId').value,
        name: this.ForwarderForm.get('name').value.trim(),
        contact: this.ForwarderForm.get('contact').value.trim(),
        emailId: this.ForwarderForm.get('email').value.trim()
      };
      this.masterService.saveForwarder(Obj).subscribe(
        (result) => {
          if (result == 1){
            this.toastr.success('Forwarder Saves Successfully !!!');
            this.getForwardingAgents();
            this.clearControlls ();
          }else if(result == 2){
            this.toastr.success('Forwarder Updated Successfully !!!');
            this.getForwardingAgents();
            this.clearControlls (); 
          }else if(result == -1){
            this.toastr.warning('Forwarder Alredy Exists !!!');
          }else if(result == -2){
            this.toastr.warning('Forwarder Failed, Already In Use  !!!');
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
    clearControlls (){
      this.ForwarderForm.get('forwarderId').setValue(0);
      this.ForwarderForm.get('name').setValue('');
      this.ForwarderForm.get('contact').setValue('');
      this.ForwarderForm.get('email').setValue('');
    }
    resetControlls (){
      this.clearControlls();
    }
    onEditFowrarder(event, cellId) {
      this.clearControlls();
      const ids = cellId.rowID;
      const selectedRowData = this.ForwarderGrid.data.filter((record) =>{
        return record.forwarderId == ids;
      });
      //console.log(selectedRowData);
      this.ForwarderForm.get('forwarderId').setValue(selectedRowData[0]['forwarderId']);
      this.ForwarderForm.get('name').setValue(selectedRowData[0]['name']);
      this.ForwarderForm.get('contact').setValue(selectedRowData[0]['contact']);
      this.ForwarderForm.get('email').setValue(selectedRowData[0]['emailId']);
    }  
}

