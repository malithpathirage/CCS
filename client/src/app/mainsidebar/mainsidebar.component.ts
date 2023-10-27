
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IComboSelectionChangeEventArgs } from 'igniteui-angular';
import { AccountService } from '_services/account.service';
import { LocalService } from '_services/local.service';
import { RegisterService } from '_services/register.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../_models/user';
import { UserLocation } from '../_models/userLocation';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mainsidebar',
  templateUrl: './mainsidebar.component.html',
  styleUrls: ['./mainsidebar.component.css'],
})
export class MainsidebarComponent implements OnInit {
  pwChangeForm: FormGroup;
  adminGroup: boolean = false;
  masterGroup: boolean = false;
  salesGroup: boolean = false;
  productionGroup: boolean = false;
  menuList: boolean = false;
  userReg: boolean = false;
  userPermit: boolean = false;
  codeDefi: boolean = false;
  serialNoDt: boolean = false;
  mstrSize: boolean = false;
  mstrColor: boolean = false;
  units: boolean = false;
  process: boolean = false;
  prodDef: boolean = false;
  costingGroup: boolean = false;
  fluteType: boolean = false;
  salesAgent: boolean = false;
  currency: boolean = false;
  countries: boolean = false;
  paymentTerms: boolean = false;
  rejReason: boolean = false;
  product: boolean = false;
  brand: boolean = false;
  bank: boolean = false;
  materialType: boolean = false;
  category: boolean = false;
  addressType: boolean = false;
  customer: boolean = false;
  flexField: boolean = false;
  article: boolean = false;
  storeSite: boolean = false;
  salesOrder: boolean = false;
  jobCard: boolean = false;
  fpo: boolean = false;
  fpoIn: boolean = false;
  fpoOut: boolean = false;
  qualityCon: boolean = false;
  dispatch: boolean = false;
  costing: boolean = false;
  costAttach: boolean = false;
  finance: boolean = false;
  exchRate: boolean = false;
  tax: boolean = false;
  min: boolean = false;
  invoice: boolean = false;
  approveCenter: boolean = false;
  receipt: boolean = false;
  receiptAllocation: boolean = false;
  dashboard: boolean = false;
  report: boolean = false;
  reportList: boolean = false;
  errorLog: boolean = false;
  customerType: boolean = false;
  creditNote: boolean = false;
  invoiceType: boolean = false;
  paymentMode: boolean = false;
  mrNote: boolean = false;
  purchasingGroup: boolean = false;
  specialInstruction: boolean = false;
  masterCompany: boolean = false;
  CartonBoxType: boolean = false;
  SupplierType: boolean = false;
  salesOrderStatus: boolean = false;
  SalesOrderDefault: boolean = false;
  crtntrnasfer: boolean = false;
  purchasingOrder: boolean = false;
  mrIndent: boolean = false;
  userIndent: boolean = false;
  adhocIndent: boolean = false;
  indentGroup: boolean = false;
  ports: boolean = false;
  supplier: boolean = false;
  creditNoteAllocation: boolean = false;
  shipmentMode: boolean = false;
  accountType: boolean = false;
  inventoryGroup: boolean = false;
  grn: boolean = false;
  isCollapsed = false;
  userLoc: UserLocation[];
  user: User;
  public selectedNoValueKey: number[];
  cartonMenuStatus: boolean = false;
  ptrackMenuStatus: boolean = false;
  mtrackMenuStatus: boolean = false;
  mwsMenuStatus: boolean = false;
  workstudyGroup: boolean = false;
  operationgroup: boolean = false;
  sectionmaster: boolean = false;
  CartonType: boolean = false;
  debitNote: boolean = false;
  machinetype: boolean = false;
  GRNType: boolean = false;
  operation: boolean = false;
  factorywisesection: boolean = false;
  operationassigntofactory: boolean = false;
  operationassigntofactorysection: boolean = false;
  operationbreakdown: boolean = false;
  validationErrors: string[] = [];
  dashboard1: boolean = false;
  factorylayout: boolean = false;
  SystemTitle: string; y
  CPDProduction: boolean = false;
  transportGroup: boolean = false;
  forwarder: boolean = false;
  POType: boolean = false;
  DispatchR: boolean = false;
  Basis: boolean = false;
  AdditionalC: boolean = false;
  DeliveryT: boolean = false;
  FROrdAssociation: boolean = false;
  stylesmv: boolean = false;
  paymentinvoice: boolean = false;
  fixedAssetGroup: boolean = false;

  @ViewChild('navMenu', { static: false }) navMenu: ElementRef<HTMLElement>;

  constructor(
    public accountServices: AccountService,
    private router: Router,
    private localService: LocalService,
    private fb: FormBuilder,
    private registerService: RegisterService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.accountServices.currentUser$.forEach((element) => {
      this.user = element;
    });

    if (this.user.moduleId == 2) {
      this.ptrackMenuStatus = true;
      this.SystemTitle = 'MPlus EE'
    } else if (this.user.moduleId == 3) {
      this.mwsMenuStatus = true;
      this.SystemTitle = 'MWS - EE'
    } else if (this.user.moduleId == 4) {
      this.mtrackMenuStatus = true;
      this.SystemTitle = 'SMF - EE'
    } else {
      this.cartonMenuStatus = true;
      this.SystemTitle = 'CCS - EE'
    }
    //console.log(this.cartonMenuStatus);
    this.loadUserLocation();
    this.checkMenuPermission();
    this.initilizeForm();
  }

  initilizeForm() {
    this.pwChangeForm = this.fb.group({
      cAgentName: [this.user.userName, Validators.required],
      OldPassword: [],

      cPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(10),
        ],
      ],
      confirmPassword: [
        '',
        [Validators.required, this.matchValues('cPassword')],
      ],
    });
  }

  menuClose() {
    this.navMenu.nativeElement.click();
  }

  /// CHECK THE PASSWORD MATCH BY THE CONFIRM PASSWORD
  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value
        ? null
        : { isMatching: true };
    };
  }

  public singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
    }
  }

  loadUserLocation() {
    //console.log(this.user);
    this.userLoc = this.user.locations;
    var selectRow = this.userLoc.filter((x) => x.isDefault == true);

    selectRow.forEach((element) => {
      this.user['locationId'] = element.companyId;
      // this.user.locations = [];
      // localStorage.setItem('user', JSON.stringify(this.user));
      this.selectedNoValueKey = [element.companyId];
    });

  }

  selectLocation(event) {
    // var user: User = JSON.parse(localStorage.getItem('user'));
    var user: User = this.user;
    for (const item of event.added) {
      /// loads locations
      user['locationId'] = item;
      this.localService.storagesetJsonValue('user', user);
      // localStorage.setItem('user', JSON.stringify(user));
      //console.log(user);
    }
    this.router.navigate(['/']);
  }

  logout() {
    this.accountServices.logout();
    this.accountServices.decodedToken = null;
    this.router.navigateByUrl('/');
  }

  checkMenuPermission() {
    var menus = this.user.permitMenus;
    //console.log(menus);
    var formMenus = menus.filter((x) => x.mType == 'F');

    if (formMenus.filter((x) => x.groupName == 'Dashboard').length > 0) {
      this.dashboard = true;
    if (formMenus.filter((x) => x.autoIdx == 1184).length > 0)
        this.approveCenter = true;

    }/// USER PERMITET ADMIN GROUP
    if (formMenus.filter((x) => x.groupName == 'Admin').length > 0) {
      this.adminGroup = true;

      //// SUB MENU OF ADMIN GROUP
      if (formMenus.filter((x) => x.autoIdx == 35).length > 0)
        this.userPermit = true;
      if (formMenus.filter((x) => x.autoIdx == 29).length > 0)
        this.userReg = true;
      if (formMenus.filter((x) => x.autoIdx == 35).length > 0)
        this.menuList = true;
    
    }
    if (formMenus.filter((x) => x.groupName == 'Master').length > 0) {
      this.masterGroup = true;
      if (formMenus.filter((x) => x.autoIdx == 3 || x.autoIdx == 3 || x.autoIdx == 3).length > 0)
      this.article = true;
    }
    if (formMenus.filter((x) => x.groupName == 'Purchasing').length > 0) {
      this.purchasingGroup = true;

      //// SUB MENU OF Order GROUP
      if (formMenus.filter((x) => x.autoIdx == 3).length > 0)
        this.mrNote = true;
      if (formMenus.filter((x) => x.autoIdx == 3).length > 0)
        this.purchasingOrder = true;
    }
    if (formMenus.filter((x) => x.groupName == 'Indent').length > 0) {
      this.indentGroup = true;

      //// SUB MENU OF Indent GROUP
      if (formMenus.filter((x) => x.autoIdx == 3).length > 0)
        this.mrIndent = true;
      if (formMenus.filter((x) => x.autoIdx == 3).length > 0)
        this.userIndent = true;
    }
  }

  clearChangPwControls() {
    this.pwChangeForm.get("OldPassword").setValue("");
    this.pwChangeForm.get("cPassword").setValue("");
    this.pwChangeForm.get("confirmPassword").setValue("");
  }

  changeUserPassword() {

    var obj = {
      cAgentName: this.pwChangeForm.get("cAgentName").value,
      cPassword: this.pwChangeForm.get("cPassword").value,
      createUserId: this.user.userId
    }

    this.registerService.changeUserPassword(obj).subscribe(
      () => {
        this.logout();
      },
      (error) => {
        this.validationErrors = error;
      });
  }
}
