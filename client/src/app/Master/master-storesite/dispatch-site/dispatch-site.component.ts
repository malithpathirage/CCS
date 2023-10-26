import { StoreSite } from 'src/app/_models/storeSite';
import { AccountService } from '_services/account.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/_models/user';
import { ToastrService } from 'ngx-toastr';
import { DispatchSite } from 'src/app/_models/dispatch-site';
import { IgxColumnComponent, IgxGridComponent , IgxComboComponent, IComboSelectionChangeEventArgs } from 'igniteui-angular';
import { MasterService } from '_services/master.service';

@Component({
  selector: 'app-dispatch-site',
  templateUrl: './dispatch-site.component.html',
  styleUrls: ['./dispatch-site.component.css']
})
export class DispatchSiteComponent implements OnInit {
  dispatchSiteForm : FormGroup;
  user : User;
  saveButton : boolean = false;
  dispatchSiteList : DispatchSite [];
  StoreSiteList : StoreSite [];
  validationErrors: string[] = [];
  isDispatchSiteSel : boolean = false;
  isEditMode : boolean = false;
 
  public col: IgxColumnComponent;
  public oWidth : string;
  public nWidth : string;

  @ViewChild('dispatchSiteGrid', { static: true })
  public dispatchSiteGrid: IgxGridComponent;

  @ViewChild('StoreSite', { read: IgxComboComponent })
  public StoreSite: IgxComboComponent;

  constructor(private accountService : AccountService, 
    private fb : FormBuilder,
    private masterService : MasterService,
    private toastr : ToastrService
    ) { }
    ngOnInit(): void {
    this.initializeForm ();
    this.loadDispatchStoreDt();
    this.loadStoreSiteDt(); 
  }
  initializeForm() {
    this.accountService.currentUser$.forEach((element)=>{
      this.user = element});
      var authMenus = this.user.permitMenus;

      if(authMenus != null) {
          if (authMenus.filter((x) => x.autoIdx == 2195).length > 0) {
            this.saveButton = true;
          }
        }
        this.dispatchSiteForm = this.fb.group({
          autoId: [0],
          createUserId: this.user.userId,
          dispatchId: ['', Validators.required]
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
  loadStoreSiteDt(){
    this.StoreSiteList =[]
    this.masterService.getStoreSite().subscribe((strSiteList) =>
    {this.StoreSiteList = strSiteList
      //console.log(this.StoreSiteList );
     });
     
  }
  loadDispatchStoreDt(){
    this.dispatchSiteList = []
    this.masterService.getDispatchSite().subscribe((dispSiteList) => {
      this.dispatchSiteList = dispSiteList
    });
  }
  onSelectDispatch(event) {
    this.isDispatchSiteSel = false;
    this.StoreSiteList = [];

    for (const item of event.added) {
      this.isDispatchSiteSel = true;
     // this.loadDispatchStoreDt();
      this.loadStoreSiteDt();
    }
  }
  saveDispatchSite(){
    if (this.saveButton == true)
    {
      var Obj = {
        createUserId : this.user.userId,
        dispatchId : this.dispatchSiteForm.get('dispatchId').value[0],
        autoId : this.dispatchSiteForm.get('autoId').value
      };
      //console.log(Obj);
      this.masterService.saveDispatchSite(Obj).subscribe(
        (result) => {
          if (result == 1)
          {
            this.toastr.success('Dispatch Site Saves Successfully !!!');
            this.loadDispatchStoreDt();
            this.clearControlls ();
          }
          else if (result == 2){
            this.toastr.success('Dispatch Site Updated Succesfully !!!');
            this.loadDispatchStoreDt();
            this.clearControlls ();
          }
          else if (result == -1){
            this.toastr.warning('Dispatch Site Alredy Exists !!!');
          }
          else if (result == -2){
            this.toastr.warning('Dispatch Site Failed, Already In Use !!!');
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
   getdispatchsitename(ids) {
    this.loadDispatchStoreDt();
    this.dispatchSiteList = []
    var selectdispach = this.dispatchSiteList.find((field)=>{
      return field.dispatchId ==  ids;
    });
  }
  onEditdispatchSite (event, cellId) {
    this.clearControlls();
    this.isEditMode = true;
    const ids = cellId.rowID;
    this.getdispatchsitename(ids);
    const selectedRowData = this.dispatchSiteGrid.data.filter((record) => {
    return record.autoId == ids;
    });
    this.dispatchSiteForm.get('dispatchId').setValue(selectedRowData[0]['dispatchId']);
    this.dispatchSiteForm.get('autoId').setValue(selectedRowData[0]['autoId']); 
  }
  clearControlls (){
    this.dispatchSiteForm.get('autoId').setValue(0);
    this.dispatchSiteForm.get('dispatchId').setValue('');
  }
  resetControlls (){
    this.clearControlls();
    this.loadDispatchStoreDt();
  }
}
