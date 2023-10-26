import { CustomerLoc } from './../../_models/customerLoc';
import { CustomerHd } from './../../_models/customerHd';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IComboSelectionChangeEventArgs, IgxComboComponent } from 'igniteui-angular';

import { ToastrService } from 'ngx-toastr';
import { from } from 'rxjs';
import { User } from 'src/app/_models/user';
import { AccountService } from '_services/account.service';
import { MasterService } from '_services/master.service';
import { ReportService } from '_services/report.service';

@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.css'],
})
export class ReportFormComponent implements OnInit {
  reportForm: FormGroup;
  user: User;
  moduleList: any;
  reportList: any;
  ssrsReportName: string = '';
  dateSelectionList : any;
  customerList: CustomerHd[];
  customerDtList: CustomerLoc[];
  currencyList: any[];
  brandList: any[];
  brandCodeList: any[];
  invoicetypeList: any[];

  @ViewChild('reportName', { read: IgxComboComponent })
  public reportName: IgxComboComponent;
  @ViewChild('module', { read: IgxComboComponent })
  public module: IgxComboComponent;
  @ViewChild('dateRange', { read: IgxComboComponent })
  public dateRange: IgxComboComponent;
  @ViewChild('customerId', { read: IgxComboComponent })
  public customerId: IgxComboComponent;
  @ViewChild('customerLocId', { read: IgxComboComponent })
  public customerLocId: IgxComboComponent;
  @ViewChild('CurrencyId', { read: IgxComboComponent })
  public CurrencyId: IgxComboComponent;
  @ViewChild('brandId', { read: IgxComboComponent })
  public brandId: IgxComboComponent;
  @ViewChild('brandcodeId', { read: IgxComboComponent })
  public brandcodeId: IgxComboComponent;

  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private router: Router,
    private reportService: ReportService,
    private masterServices: MasterService
  ) {}

  ngOnInit(): void {
    this.initilizeForm();
    this.loadModuleList();
    this.loadDateSelectionType();
    this.loadCustomer();
    this.loadCurrency();
    this.loadBrand();
    this.loadInvoiceType();

  }
  initilizeForm() {
    var date: Date = new Date(Date.now());
    this.accountService.currentUser$.forEach((element) => {
      this.user = element;
    });

    this.reportForm = this.fb.group({
      reportId: [0],
      userId: this.user.userId,
      module: ['', Validators.required],
      reportName: ['', Validators.required],
      fromDate: [date],
      toDate: [date],
      dateRange: [0],
      customerLocId:[0],
      customerId:[0],
      brandId:[0],
      CurrencyId:[0],
      brandcodeId:[0],
      invoicetypeId:[0],
      customerRef:[''],
      asAtDate:[date]

    }
      , { validators: this.dateCompaire('fromDate', 'toDate')}
      
    );
  }

   /// VALIDATE FROM AND TO DATE
   dateCompaire( fromDate: string , toDate: string) {     
    var date: Date = new Date(Date.now());
    return (group: FormGroup): { [key: string]: any } => {     
      let vf = group.controls[fromDate];
      let vt = group.controls[toDate];

      // console.log(vf.value);
      // console.log(vt.value);
      if (vf.value != date && vt.value != date) {
        if (vf.value > vt.value) {
          return {
            invalidDate: "Date from should be less than Date to"
          };
        }
      }
      return {};
    };
  }

  loadDateSelectionType() {
    this.dateSelectionList = this.reportService.loadDateSelectionType();
  }

  //// ALOW SINGLE SILECTION ONLY COMBO EVENT
  singleSelection(event: IComboSelectionChangeEventArgs) {
    if (event.added.length) {
      event.newSelection = event.added;
    }
  }

  loadModuleList() {
    this.moduleList = this.reportService.loadModuleList();
  }

  onSelectModule(event) {
    this.reportList = [];
    this.reportForm.get('reportName').setValue('');
    this.ssrsReportName = '';
    var moduleId = this.user.moduleId;
    for (const item of event.added) {
      // console.log(item);
      this.loadReportList(item,moduleId);
    }
  }

  loadReportList(module,moduleId) {
    var obj ={
      module : module,
      moduleId : moduleId
    }
    this.reportService.loadReportDetails(obj).subscribe((result) => {
      this.reportList = result;
    });
  }

  onSelectReport(event) {
    this.ssrsReportName = '';
    this.clearParameters();
    for (const item of event.added) {
      var reportLine = this.reportList.filter((x) => x.autoId == item);

      // console.log(reportLine);
      if (reportLine[0]['fromDate'] == true)
        this.reportForm.get('fromDate').enable();
      else this.reportForm.get('fromDate').disable();

      if (reportLine[0]['toDate'] == true)
        this.reportForm.get('toDate').enable();
      else this.reportForm.get('toDate').disable();

      if (reportLine[0]['bCustomer'] == true)
      this.reportForm.get('customerId').enable();
      else this.reportForm.get('customerId').disable();

      if (reportLine[0]['bDeliveryLocation'] == true)
      this.reportForm.get('customerLocId').enable();
      else this.reportForm.get('customerLocId').disable();

      if (reportLine[0]['bCurrency'] == true)
      this.reportForm.get('CurrencyId').enable();
      else this.reportForm.get('CurrencyId').disable();

      if (reportLine[0]['bBrand'] == true)
      this.reportForm.get('brandId').enable();
      else this.reportForm.get('brandId').disable();

      if (reportLine[0]['bBrandCode'] == true)
      this.reportForm.get('brandcodeId').enable();
      else this.reportForm.get('brandcodeId').disable();

      if(reportLine[0]['bCustomerPO']== true)
      this.reportForm.get('customerRef').enable();
      else this.reportForm.get('customerRef').disable();

      if(reportLine[0]['bInvoiceType']== true)
      this.reportForm.get('invoicetypeId').enable();
      else this.reportForm.get('invoicetypeId').disable();

      if(reportLine[0]['asAtDate']== true)
      this.reportForm.get('asAtDate').enable();
      else this.reportForm.get('asAtDate').disable();

      this.ssrsReportName = reportLine[0]['ssrsReportName'];
    }
  }

  printReport() {
    var fromDate = this.reportForm.get('fromDate').value;
    var toDate = this.reportForm.get('toDate').value;
    var asAtDate=this.reportForm.get('asAtDate').value;
  
    var customerid=this.reportForm.get('customerId').value==''
    ? 0
    :this.reportForm.get('customerId').value[0];
    var deliverlocationid=this.reportForm.get('customerLocId').value==''
    ? 0
    :this.reportForm.get('customerLocId').value[0];
    var currencyid=this.reportForm.get('CurrencyId').value==''
    ? 0
    :this.reportForm.get('CurrencyId').value[0];
    var brandId=this.reportForm.get('brandId').value==''
    ? 0
    :this.reportForm.get('brandId').value[0];
    var brandcodeId=this.reportForm.get('brandcodeId').value==''
    ? 0
    :this.reportForm.get('brandcodeId').value[0];
    var customerRef=this.reportForm.get('customerRef').value.trim();
    var invoiceTypeId=this.reportForm.get('invoicetypeId').value==''
    ? 0
    :this.reportForm.get('invoicetypeId').value[0];

    //if (customerid==undefined){ customerid=0;}
    //if (deliverlocationid==undefined){ deliverlocationid=0;}
    //if (currencyid==undefined){ currencyid=0;}
    //if (brandId==undefined){ brandId=0;}
    //if (brandcodeId==undefined){ brandcodeId=0;}
  
    //if (this.reportForm.get('customerId').enabled && this.reportForm.get('customerId').value=='') {
    //  this.toastr.warning('Select the Customer !!!');
    //} else if (this.reportForm.get('customerLocId').enabled && this.reportForm.get('customerLocId').value=='') {
    //  this.toastr.warning('Select the Delivery Location !!!');
    //} else if (this.reportForm.get('CurrencyId').enabled && this.reportForm.get('CurrencyId').value=='') {
    //  this.toastr.warning('Select the Currency !!!');
    //} else if (this.reportForm.get('brandId').enabled && this.reportForm.get('brandId').value=='') {
    //  this.toastr.warning('Select the Brand Name !!!'); 
    //} else if (this.reportForm.get('brandcodeId').enabled && this.reportForm.get('brandcodeId').value=='') {
    //  this.toastr.warning('Select the Brand Code !!!'); 
    //} else if (this.reportForm.get('customerRef').enabled && this.reportForm.get('customerRef').value=='') {
    //  this.toastr.warning('Select the CustomerPO !!!'); 
    //}else {

        var obj = {
          reportName: this.ssrsReportName,
          fromDate: fromDate,
          toDate: toDate,
          customerid: customerid,
          deliverlocationid: deliverlocationid,
          currencyid:currencyid,
          brandId:brandId,
          brandcodeId:brandcodeId,
          customerRef:customerRef,
          invoiceTypeId:invoiceTypeId,
          asAtDate:asAtDate,
          userLocation: this.user.locationId
        };
        console.log(obj);
          /// STORE OBJECT IN LOCAL STORAGE
          localStorage.setItem('params', JSON.stringify(obj));
          //  var url = '/boldreport?ssrsReportName='+ this.ssrsReportName;
          window.open('/boldreport', '_blank');
    //}
  }

  loadCurrency(){
    this.masterServices.getCurrency().subscribe((curlist)=>{
      this.currencyList=curlist;
    });
  }

  loadBrand() {
    this.masterServices.getBrand(this.user.locationId).subscribe(cardList => {
      this.brandList = cardList;
    })
  }

  loadBrandCode(brandId) {
    this.masterServices.getBrandCode(brandId).subscribe(Brandswithis => {
      console.log(Brandswithis);
      this.brandCodeList = Brandswithis;
     
    })
  }

  onSelectBrand(event) {
    for (const item of event.added) {
      this.loadBrandCode(item);
    }
  }

  onSelectDateRange(event) {
    this.reportForm.get('fromDate').setValue('');
    this.reportForm.get('toDate').setValue('');
    
    for (const item of event.added) {
       //console.log(item);
      this.loadSeletDate(item);
    }
  }

  loadSeletDate(module) {
    //this.dateResultList=[];
    this.masterServices.getDateSelection(module).subscribe((result) => {
      //this.dateResultList=result
      if (result.length>0) {
        
        var fDate: Date = new Date(
          this.datePipe.transform(
            result[0]['fromDate'],
            'yyyy-MM-dd'
          )
        );
        var tDate: Date = new Date(
          this.datePipe.transform(
            result[0]['toDate'],
            'yyyy-MM-dd'
          )
        );
        this.reportForm.get('fromDate').setValue(fDate);
        this.reportForm.get('toDate').setValue(tDate);
      }   
    });
  }
  loadCustomer() {
    var locationId = this.user.locationId;
    this.masterServices.getCustomer(locationId).subscribe((customer) => {
      this.customerList = customer;
      //.filter(x => x.bActive == true);
    });
  }
  onSelectCustomer(event) {
    this.customerDtList = [];

    for (const item of event.added) {
    this.loadCustomerBasedDetails(item);
    }
  }
  loadInvoiceType() {
    this.masterServices.getInvoiceType().subscribe(invTypeList => {
      this.invoicetypeList = invTypeList;
    })
  }
  /// loads CUSTOMER LOACTION
  loadCustomerBasedDetails(item) {
      this.masterServices.getCustomerLocation(item).subscribe(
        (customerDt) => {
            this.customerDtList = customerDt;
          },
          // The 2nd callback handles errors.
          (err) => console.error(err),
          // The 3rd callback handles the "complete" event.
          () => {
            // console.log('location');
        }
      );
  }
  
  clearReport() {
    var date: Date = new Date(Date.now());

    this.reportForm.get('module').setValue('');
    this.reportForm.get('reportName').setValue('');
    this.reportForm.get('fromDate').setValue(date);
    this.reportForm.get('toDate').setValue(date);
    this.reportForm.get('customerId').setValue('');
    this.reportForm.get('customerLocId').setValue('');
    this.reportForm.get('CurrencyId').setValue('');
  }

  clearParameters() {
    this.reportForm.get('customerId').setValue('');
    this.reportForm.get('customerLocId').setValue('');
    this.reportForm.get('CurrencyId').setValue('');
    this.reportForm.get('brandId').setValue('');
    this.reportForm.get('brandcodeId').setValue('');
    this.reportForm.get('invoicetypeId').setValue('');
  }
}
