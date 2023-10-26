import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup,FormBuilder, Validators } from '@angular/forms';
import { IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { Basis } from 'src/app/_models/basis';
import { User } from 'src/app/_models/user';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-master-basis',
  templateUrl: './master-basis.component.html',
  styleUrls: ['./master-basis.component.css']
})
export class MasterBasisComponent implements OnInit {
  basisForm: FormGroup;
  user  : User;
  saveButton : boolean=false;
  basisList : Basis[];
  validationErrors: string[] = [];

  public col : IgxColumnComponent;
  public oWidth : string;
  public nWidth : string;

  @ViewChild('masterBasisGrid' , {static : true})
  public masterBasisGrid: IgxGridComponent;

  constructor(private accountService : AccountService,
    private fb : FormBuilder,
    private masterService : MasterService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadBasis();
  }
  initializeForm(){
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
      });
      var authMenus = this.user.permitMenus;
  
        if(authMenus != null) {
            if (authMenus.filter((x) => x.autoIdx == 2257).length > 0) {
              this.saveButton = true;
            }
          }
          this.basisForm = this.fb.group({
            baseId: [0],
            createUserId: this.user.userId,
            description : ['', [Validators.required, Validators.maxLength(50)]]  
    });  
  }
  public onResize(event) {
    this.col = event.column;
    this.oWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }
  loadBasis(){
    this.basisList=[];
    this.masterService.getBasis().subscribe((payModeList) =>{
      this.basisList  = payModeList;
    });
  }
  onEditDispatchReason(event, cellId) {
    this.clearControlls();
    const ids = cellId.rowID;
    const selectedRowData = this.masterBasisGrid.data.filter((record) =>{
      return record.baseId == ids;
    });
    this.basisForm.get('description').setValue(selectedRowData[0]['description']);
    this.basisForm.get('baseId').setValue(selectedRowData[0]['baseId']);
  }
  clearControlls(){
    this.basisForm.get('baseId').setValue(0);
    this.basisForm.get('description').setValue('');
  }
  resetControlls(){
    this.clearControlls();
  }
  saveBasis(){
    if(this.saveButton == true){
      var Obj ={
        baseId: this.basisForm.get('baseId').value,
        description: this.basisForm.get('description').value.trim(),
        userId: this.user.userId,
        modudeId: this.user.moduleId,
        companyId: this.user.locationId
      };
      this.masterService.saveBasis(Obj).subscribe(
        (result) => {
          if (result == 1){
            this.toastr.success('Basis Saves Successfully !!!');
            this.loadBasis();
            this.clearControlls ();
          }else if(result == 2){
            this.toastr.success('Basis Updated Successfully !!!');
            this.loadBasis();
            this.clearControlls (); 
          }else if(result == -1){
            this.toastr.warning('Dispatch reason Alredy Exists !!!');
          }else if(result == -2){
            this.toastr.warning('Dispatch reason Failed, Already In Use  !!!');
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
}
