import { Component, OnInit,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { IgxColumnComponent, IgxGridComponent , IgxCheckboxComponent,IComboSelectionChangeEventArgs } from 'igniteui-angular';
import { AdminService } from '_services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { PermitUser } from 'src/app/_models/permitUser';
import { MasterService } from '_services/master.service';
import { userMasterSettings } from 'src/app/_models/userMasterSettings';

@Component({
  selector: 'app-user-master-settings',
  templateUrl: './user-master-settings.component.html',
  styleUrls: ['./user-master-settings.component.css']
})
export class UserMasterSettingsComponent implements OnInit {
  userMasterSettingsForm : FormGroup;
  user: User;
  userMList: userMasterSettings[];
  permitUsers :PermitUser[];
  saveButton : boolean = false;

  public col : IgxColumnComponent;
  public oWidth : string;
  public nWidth : string;

  @ViewChild('usermasterSettingsGrid' , {static : true})
  public usermasterSettingsGrid: IgxGridComponent;
  @ViewChild('chkIndent', { read: IgxCheckboxComponent })
  public chkIndent: IgxCheckboxComponent;
  @ViewChild('chkCostAtt', { read: IgxCheckboxComponent })
  public chkCostAtt: IgxCheckboxComponent;
  
  constructor(
    private accountService: AccountService,
    private fb : FormBuilder,
    public adminServices: AdminService,
    public masterService: MasterService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadPermitedUsers();
  }
  initializeForm()
  {
    this.accountService.currentUser$.forEach((element) => {
    this.user = element;
    });
    var authMenus = this.user.permitMenus;

      if(authMenus != null) {
          if (authMenus.filter((x) => x.autoIdx == 2193).length > 0) {
            this.saveButton = true;
          }
        }
        this.userMasterSettingsForm = this.fb.group({
          userMasterSetId: [0],
          createUserId: this.user.userId,
          Agent : ['', Validators.required],
          Indent : [],
          CostingA : []
    });  
  }

  loadPermitedUsers() {
    this.adminServices.getPermitedUsers().subscribe((userList) => {
      this.permitUsers = userList;
    });
  }

  public singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
      //console.log(event.newSelection);
    }
  }
  loadUserEvent(event) {

    /// clear userMasterSettingsForm data
    this.clearValues();
    for (const item of event.added) {
     this.masterService.getUserMasterSettings(item).subscribe((userM)=>{
      this.userMList = userM;
      //console.log(userM);
      if (userM.length >0){
        for (let index = 0; index < userM.length; index++){
          this.chkIndent.checked = userM[index]['bIntent'];
          this.chkCostAtt.checked = userM[index]['costAtt'];
        }
      }
    });
    }
  }
  //SAVE USE MASTER SETTINGS
  saveUserMasterSetting(){
    if (this.saveButton == true){
      var obj = {
        createdUserId : this.user.userId, 
        userMasterSetId: this.userMasterSettingsForm.get('userMasterSetId').value,
        agentId: this.userMasterSettingsForm.get('Agent').value[0],
        //bIntent: this.userMasterSettingsForm.get('Indent').value,
        //costing: this.userMasterSettingsForm.get('CostingA').value
        bIntent: this.chkIndent.checked,
        costAtt: this.chkCostAtt.checked
      }
      console.log(obj);
      this.masterService.saveUserMasterSettings(obj).subscribe((result)=>{
        if (result == 1) {
          this.toastr.success('Settings Saved Successfully !!!');
        } else if (result == 2) {
          this.toastr.success('Settings updated Successfully !!!');
        } else {
          this.toastr.error('Contact Admin. Error No:- ' + result.toString());
        }
        this.clearControls();
      });}
    else {
      this.toastr.error('Save Permission denied !!!');
    }
  }

  clearControls() {
    this.userMasterSettingsForm.get('Agent').setValue('');
    this.userMasterSettingsForm.get('Indent').setValue('');
    this.userMasterSettingsForm.get('CostingA').setValue('');
  }

  /// clear userMasterSettingsForm data
  clearValues() {
    this.userMasterSettingsForm.get('Indent').setValue('');
    this.userMasterSettingsForm.get('CostingA').setValue('');
  }

}
