import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';


// Report viewer
import '@boldreports/javascript-reporting-controls/Scripts/bold.report-viewer.min';
import { environment } from 'src/environments/environment';
import { element } from 'protractor';

@Component({
  selector: 'app-boldreport-viewer',
  templateUrl: './boldreport-viewer.component.html',
  styleUrls: ['./boldreport-viewer.component.css']
})
export class BoldreportViewerComponent implements OnInit {
  baseUrl = environment.apiUrl;
  reportUrl = environment.reportUrl;
  title = 'reportviewerapp';
  public serviceUrl: string;
  public reportPath: string;
  public serverUrl: string;
  public processMode: string;
  public parameterSettings: any;
  public parameters: any;
  public isPrintMode: boolean;
  public printOption: any;
  public pageSettings: any;
  public reportFolder: any;
  public ptrackreportFolder: any;
  paraObj: any;
  
  
  // @ViewChild('viewer') viewer: ElementRef
  
  constructor(private route: ActivatedRoute
    ) {
    
    // this.serviceUrl = 'https://localhost:5001/api/ReportViewer';
    // this.reportPath = '~/Resources/sales-order-detail.rdl';
    this.serviceUrl = this.baseUrl + 'ReportViewer';
    this.serverUrl  = this.reportUrl; //http://10.0.2.5:8080/ReportServer  
    this.reportFolder =  "/CCSReport"
    this.ptrackreportFolder = "/MPlusReport" 
    this.processMode = "Remote";
    this.isPrintMode = true;
    // this.pageSettings = { orientation: ej.ReportViewer.Orientation.Landscape }
    // this.printOption = ej.ReportViewer.PrintOptions.NewTab;
    this.parameterSettings =  { hideParameterBlock: true} ;  
    // console.log(this.router.getCurrentNavigation().extras.state);
   }

  ngOnInit(): void {

    this.getReportParameters();
    this.loadSystemReport();
  }

  getReportParameters() {
    // this.paraObj = history.state;
    //// get parameters from local storage and assign to object
    this.paraObj = JSON.parse(localStorage.getItem('params'));
    /// remove local storage
    localStorage.removeItem('params');
    //console.log(this.paraObj);  
  }
  
  loadSystemReport(){
    //console.log(this.paraObj)
    if('moduleId' in this.paraObj){
      if (this.paraObj.moduleId == 1){
        this.loadCCSApprovals();
      }else if(this.paraObj.moduleId == 2){
        this.loadPtrackApprovals();
      }
    } else {
      this.loadReports();
    } 
  };

  loadReports() {
    var reportName = this.paraObj["reportName"];
    this.reportPath = this.reportFolder + "/" + reportName;

    if(reportName == "DispatchNoteFormat") { 
      /// set parameters
      this.parameters = [{
      name: 'DispatchNo',
      labels: ['Dispatch No'],
      values: [this.paraObj["dispatchNo"]],
      nullable: false     
      }]; 
    }else if(reportName == "ReceiptFormat"){
      /// set parameters
      this.parameters = [{
      name: 'receiptId',
      labels: ['receipt Id'],
      values: [this.paraObj["receiptId"]],
      nullable: false
      }];
    }else if(reportName == "PoPrint"){
      /// set parameters
      this.parameters = [{
      name: 'POHdId',
      labels: ['PO Hd Id'],
      values: [this.paraObj["purchaseId"]],
      nullable: false
      }];
    }else if (reportName == "JobDetailsFormat") {
      /// set parameters
      this.parameters = [{
      name: 'JobHeaderId',
      labels: ['JobHeader Id'],
      values: [this.paraObj["jobCardNo"]],
      nullable: false     
      }];
    } else if (reportName == "CostSheetFormat") {
      /// set parameters
      this.parameters = [{
      name: 'CostHeaderId',
      labels: ['Cost Header Id'],
      values: [this.paraObj["costingHdId"]],
      nullable: false     
      }]; 
    }else if (reportName == "GoodsInwardsNoteFormat") {
      /// set parameters
      this.parameters = [{
      name: 'ReferenceNo',
      labels: ['Reference No'],
      values: [this.paraObj["referenceNo"]],
      nullable: false     
      }]; 
    } else if (reportName == "CreditNoteFormat") {
      /// set parameters
      this.parameters = [{
      name: 'CreditNoteHdId',
      labels: ['creditNoteHdId'],
      values: [this.paraObj["creditNoteHdId"]],
      nullable: false     
      }]; 
    }else if (reportName == "CommercialInvoice") {
      /// set parameters
      this.parameters = [{
      name: 'InvoiceHdId',
      labels: ['Invoice Hd Id'],
      values: [this.paraObj["invoiceHdId"]],
      nullable: false     
      }]; 
    } else if (reportName == "TaxInvoice") {
      // console.log(this.paraObj["invoiceHdId"]);
      /// set parameters
      this.parameters = [{
      name: 'InvoiceHdId',
      labels: ['Invoice Hd Id'],
      values: [this.paraObj["invoiceHdId"]],
      nullable: false     
      }]; 
    } else if (reportName == "InternalInvoice") {
      /// set parameters
      this.parameters = [{
      name: 'InvoiceHdId',
      labels: ['Invoice Hd Id'],
      values: [this.paraObj["invoiceHdId"]],
      nullable: false     
      }]; 
    } else if (reportName == "SuspendedTaxInvoice"){
      /// set parameters
      this.parameters = [{
      name: 'InvoiceHdId',
      labels: ['Invoice Hd Id'],
      values: [this.paraObj["invoiceHdId"]],
      nullable: false    
      }]; 
    }
    else if (reportName == "NFE-SuspendedTaxInvoice"){
      /// set parameters
      this.parameters = [{
      name: 'InvoiceHdId',
      labels: ['Invoice Hd Id'],
      values: [this.paraObj["invoiceHdId"]],
      nullable: false    
      }]; 
    }else if (reportName == "MonthlyDispatchSalesReport") {
      /// set parameters
      this.parameters = [{
        name: 'StartDispatchDate',
        labels: ['Start Dispatch Date'],
        values: [this.paraObj["fromDate"]],
        nullable: false     
      }, 
      {
        name: 'EndDispatchDate',
        labels: ['End Dispatch Date'],
        values: [this.paraObj["toDate"]],
        nullable: false     
      },
      {
          name: 'CustomerId',
          lables: ['CustomerId'],
          values: [this.paraObj["customerid"]],
          nullable: true
      },
      {
          name: 'BrandId',
          lables: ['BrandId'],
          values: [this.paraObj["brandId"]],
          nullable: true
      }];} else if (reportName == "MonthlySalesReport") {
      /// set parameters
      this.parameters = [{
        name: 'StartDate',
        labels: ['Start Date'],
        values: [this.paraObj["fromDate"]],
        nullable: false     
      } , 
      {
        name: 'EndDate',
        labels: ['End Date'],
        values: [this.paraObj["toDate"]],
        nullable: false     
        }]; 
    } else if (reportName == "MonthlyProductionPlanReport") {
      /// set parameters
      this.parameters = [{
        name: 'StartDate',
        labels: ['Start Date'],
        values: [this.paraObj["fromDate"]],
        nullable: false     
      } , 
      {
        name: 'EndDate',
        labels: ['End Date'],
        values: [this.paraObj["toDate"]],
        nullable: false     
      }]; 
    } else if (reportName == "MonthlyMasPortalReport") {
      /// set parameters
      this.parameters = [{
        name: 'StartInvoiceDate',
        labels: ['Start Invoice Date'],
        values: [this.paraObj["fromDate"]],
        nullable: false     
      } , 
      {
        name: 'EndInvoiceDate',
        labels: ['End Invoice Date'],
        values: [this.paraObj["toDate"]],
        nullable: false     
        }]; 
    } else if (reportName == "MothlyInvoiceSalesReport") {
      /// set parameters
      this.parameters = [{
        name: 'StartInvoiceDate',
        labels: ['Start Invoice Date'],
        values: [this.paraObj["fromDate"]],
        nullable: false     
      } , 
      {
        name: 'ENDInvoiceDate',
        labels: ['End Invoice Date'],
        values: [this.paraObj["toDate"]],
        nullable: false     
      }];
    }else if (reportName == "MothlyInvoiceSalesReportwithKG"){
      this.parameters = [{
        name: 'StartInvoiceDate',
        lables: ['Start Invoice Date'],
        values: [this.paraObj["fromDate"]],
        nullable: false
      },
      {
        name: 'ENDInvoiceDate',
        lables: ['End Invoice Date'],
        values: [this.paraObj["toDate"]],
        nullable: false
      }];
    }else if (reportName == "PendingInvoiceDetails"){
      this.parameters = [{
        name: 'StartInvoiceDate',
        lables: ['Start Invoice Date'],
        values: [this.paraObj["fromDate"]],
        nullable: false
      },
      {
        name: 'EndInvoiceDate',
        lables: ['End Invoice Date'],
        values: [this.paraObj["toDate"]],
        nullable: false
      }];
    }else if (reportName == "VSPackingProgramReport"){
      this.parameters = [{
        name: 'StartDate',
        lables: ['StartDate'],
        values: [this.paraObj["fromDate"]],
        nullable: false
      },
      {
        name: 'EndDate',
        lables: ['EndDate'],
        values: [this.paraObj["toDate"]],
        nullable: false
      },
      {
        name: 'BrandId',
        lables: ['BrandId'],
        values: [this.paraObj["brandId"]],
        nullable: false
      }];
    }else if (reportName == "VSDeliveryReport"){
      this.parameters = [{
        name: 'StartDate',
        lables: ['StartDate'],
        values: [this.paraObj["fromDate"]],
        nullable: false
      },
      {
        name: 'EndDate',
        lables: ['EndDate'],
        values: [this.paraObj["toDate"]],
        nullable: false
      },
      {
        name: 'BrandId',
        lables: ['BrandId'],
        values: [this.paraObj["brandId"]],
        nullable: false
      },
      {
        name: 'AsAtDate',
        lables: ['As At Date'],
        values: [this.paraObj["asAtDate"]],
        nullable: false
      }];
    }else if (reportName == "VSDeliveryMomentReport"){
      this.parameters = [{
        name: 'StartDate',
        lables: ['StartDate'],
        values: [this.paraObj["fromDate"]],
        nullable: false
      },
      {
        name: 'EndDate',
        lables: ['EndDate'],
        values: [this.paraObj["toDate"]],
        nullable: false
      },
      {
        name: 'BrandId',
        lables: ['BrandId'],
        values: [this.paraObj["brandId"]],
        nullable: false
      }];
    }else if (reportName == "VatDetailReport"){
      this.parameters = [{
        name: 'StartInvoiceDate',
        lables: ['Start Invoice Date'],
        values: [this.paraObj["fromDate"]],
        nullable: false
      },
      {
      name: 'EndInvoiceDate',
      lables: ['End Invoice Date'],
      values: [this.paraObj["toDate"]],
      nullable: false
      },  
      {
        name: 'CustomerId',
        lables: ['Customer Id'],
        values: [this.paraObj["customerid"]],
        nullable: true
      },
      {
        name: 'InvoiceTypeId',
        lables: ['Invoice Type Id'],
        values: [this.paraObj["invoiceTypeId"]],
        nullable: true
      }];
    }else if (reportName == "PaymentSettlementReport"){
      this.parameters = [{
        name: 'STARTDATE',
        lables: ['START DATE'],
        values: [this.paraObj["fromDate"]],
        nullable: false
      },
      {
      name: 'ENDDATE',
      lables: ['END DATE'],
      values: [this.paraObj["toDate"]],
      nullable: false
      },  
      {
        name: 'CustomerId',
        lables: ['Customer Id'],
        values: [this.paraObj["customerid"]],
        nullable: true
      }];
    }else if (reportName == "GRNSupplimentoryDataReport"){
      this.parameters = [{
        name: 'CustomerId',
        lables: ['Customer Id'],
        values: [this.paraObj["customerid"]],
        nullable: false
      },
      {
        name: 'ASATDATE',
        lables: ['AS AT DATE'],
        values: [this.paraObj["toDate"]],
        nullable: false
      }];
    }else if (reportName == "GRNSummeryReport"){
      this.parameters = [
      {
        name: 'ASATDATE',
        lables: ['AS AT DATE '],
        values: [this.paraObj["toDate"]],
        nullable: false
      }];
    }else if (reportName == "AgeAnalysisWithJobNo"){
      this.parameters = [{
        name: 'StartInvoiceDate',
        lables: ['Start Invoice Date'],
        values: [this.paraObj["fromDate"]],
        nullable: false
      },
      {
        name: 'EndInvoiceDate',
        lables: ['End Invoice Date'],
        values: [this.paraObj["toDate"]],
        nullable: false
      }];
    }else if (reportName == "CreditNoteWithKG"){
      this.parameters = [{
        name: 'FROMDATE',
        lables: ['FROMDATE'],
        values: [this.paraObj["fromDate"]],
        nullable: false
      },
      {
        name: 'ENDDATE',
        lables: ['ENDDATE'],
        values: [this.paraObj["toDate"]],
        nullable: false
      }];
    }else if (reportName == "VATCreditNoteDetails"){
      this.parameters = [{
        name: 'FROMDATE',
        lables: ['FROMDATE'],
        values: [this.paraObj["fromDate"]],
        nullable: false
      },
      {
        name: 'ENDDATE',
        lables: ['ENDDATE'],
        values: [this.paraObj["toDate"]],
        nullable: false
      }];
    }else if (reportName == "AgeAnalysisInUSD"){
      this.parameters = [{
        name: 'ASATDATE',
        lables: ['AS AT DATE'],
        values: [this.paraObj["toDate"]],
        nullable: false
      },
      {
        name: 'CustomerId',
        lables: ['Customer Id'],
        values: [this.paraObj["customerid"]],
        nullable: false
      }];
    } else if (reportName == "SupplyPartnerShipmentReport"){
      this.parameters = [{
        name: 'BuyerId',
        lables: ['Buyer Id'],
        values: [this.paraObj["brandId"]],
        nullable: false
      },
      {
        name: 'fromDate',
        lables: ['From Date'],
        values: [this.paraObj["fromDate"]],
        nullable: false
      },
      {
        name: 'Todate',
        lables: ['To date'],
        values: [this.paraObj["toDate"]],
        nullable: false
      }];
    }else if (reportName == "AgeAnalysisSummery") {
      this.parameters = [{
        name: 'ASATDATE',
        lables: ['AS AT DATE'],
        values: [this.paraObj["toDate"]],
        nullable: false
      }];
    }else if (reportName == "WIPValidationReport") {
      this.parameters = [{
        name: 'AsAtDate',
        lables: ['AS AT DATE'],
        values: [this.paraObj["asAtDate"]],
        nullable: false
      }];
    }else if (reportName == "GRNFormat"){
      this.parameters = [{
        name: 'CustId',
        lables: ['Customer Id'],
        values: [this.paraObj["customerid"]],
        nullable: false
      },
      {
        name: 'FromDate',
        lables: ['From Date'],
        values: [this.paraObj["fromDate"]],
        nullable: false
      },
      {
        name: 'Todate',
        lables: ['To date'],
        values: [this.paraObj["toDate"]],
        nullable: false
      }];
    } else if (reportName == "productiontrckingreport"){
      this.parameters = [{
        name: 'PO',
        lables: ['PO'],
        values: [this.paraObj["customerRef"]],
        nullable: false
      }];
    } else if (reportName == "MaterialRequestPrint") {
      /// set parameters
      this.parameters = [{
      name: 'MRId',
      labels: ['MRId'],
      values: [this.paraObj["MRHeaderId"]],
      nullable: false     
      }];
    } else if (reportName == "MonthlyDispatchSalesReportFinance"){
    this.parameters = [{
      name: 'StartDispatchDate',
      labels: ['Start Dispatch Date'],
      values: [this.paraObj["fromDate"]],
      nullable: false
    } ,
    { name: 'EndDispatchDate',
      lables: ['End Dispatch Date'],
      values: [this.paraObj["toDate"]],
      nullable: false
    }];
  } else if (reportName == "PocostingDtReport"){
    this.parameters = [{
      name: 'StartDispatchDate',
      labels: ['Start Dispatch Date'],
      values: [this.paraObj["fromDate"]],
      nullable: false
    } ,
    { name: 'EndDispatchDate',
      lables: ['End Dispatch Date'],
      values: [this.paraObj["toDate"]],
      nullable: false
    }];
  }else if (reportName == "CreditNote"){
    this.parameters = [{
      name: 'FROMDATE',
      labels: ['FROMDATE'],
      values: [this.paraObj["fromDate"]],
      nullable: false
    } ,
    { name: 'ENDDATE',
      lables: ['ENDDATE'],
      values: [this.paraObj["toDate"]],
      nullable: false
    }];
  }else if (reportName == "MonthlyDispatchSalesReports") {
    /// set parameters
    this.parameters = [{
      name: 'StartDispatchDate',
      labels: ['Start Dispatch Date'],
      values: [this.paraObj["fromDate"]],
      nullable: false     
    }, 
    {
      name: 'EndDispatchDate',
      labels: ['End Dispatch Date'],
      values: [this.paraObj["toDate"]],
      nullable: false     
    },
    {
        name: 'CustomerId',
        lables: ['CustomerId'],
        values: [this.paraObj["customerid"]],
        nullable: true
    },
    {
        name: 'BrandId',
        lables: ['BrandId'],
        values: [this.paraObj["brandId"]],
        nullable: true
    }];
  }else if (reportName == "BalancetodispatchReport"){
    this.parameters = [{
      name: 'CustomerId',
      lables: ['Customer Id'],
      values: [this.paraObj["customerid"]],
      nullable: true
    },
    {
      name: 'fromDate',
      lables: ['From Date'],
      values: [this.paraObj["fromDate"]],
      nullable: true
    },
    {
      name: 'Todate',
      lables: ['To date'],
      values: [this.paraObj["toDate"]],
      nullable: true
    }];
    }else if (reportName == "QBUploadReport"){
    this.parameters = [{
      name: 'CustomerId',
      lables: ['Customer Id'],
      values: [this.paraObj["customerid"]],
      nullable: false
    },
    {
      name: 'StartDate',
      lables: ['Start Date'],
      values: [this.paraObj["fromDate"]],
      nullable: false
    },
    {
      name: 'EndDate',
      lables: ['End Date'],
      values: [this.paraObj["toDate"]],
      nullable: false
    }];
  }else if (reportName == "BalancetodispatchFullReport"){
    this.parameters = [{
      name: 'CustomerId',
      lables: ['Customer Id'],
      values: [this.paraObj["customerid"]],
      nullable: true
    },
    {
      name: 'fromDate',
      lables: ['From Date'],
      values: [this.paraObj["fromDate"]],
      nullable: true
    },
    {
      name: 'Todate',
      lables: ['To date'],
      values: [this.paraObj["toDate"]],
      nullable: true
    }];
    }else if (reportName == "DebitNote"){
      this.parameters = [{
        name: 'FROMDATE',
        labels: ['FROMDATE'],
        values: [this.paraObj["fromDate"]],
        nullable: false
      } ,
      { name: 'ENDDATE',
        lables: ['ENDDATE'],
        values: [this.paraObj["toDate"]],
        nullable: false
      }];
    }else if (reportName == "DebitNoteWithKG"){
      this.parameters = [{
        name: 'FROMDATE',
        labels: ['FROMDATE'],
        values: [this.paraObj["fromDate"]],
        nullable: false
      } ,
      { name: 'ENDDATE',
        lables: ['ENDDATE'],
        values: [this.paraObj["toDate"]],
        nullable: false
      }];
    }else if (reportName == "VATDebitNoteDetails"){
      this.parameters = [{
        name: 'FROMDATE',
        labels: ['FROMDATE'],
        values: [this.paraObj["fromDate"]],
        nullable: false
      } ,
      { name: 'ENDDATE',
        lables: ['ENDDATE'],
        values: [this.paraObj["toDate"]],
        nullable: false
      }];
    }else if (reportName == "sp_TransportWFXimport_Report") {
      /// set parameters
      this.parameters = [{
        name: 'FromDate',
        labels: ['From Date'],
        values: [this.paraObj["fromDate"]],
        nullable: false     
      } , 
      {
        name: 'ToDate',
        labels: ['To Date'],
        values: [this.paraObj["toDate"]],
        nullable: false     
      }]; 
    }else if (reportName == "LostTimeReport") {
      /// set parameters
      this.parameters = [{
        name: 'StartDate',
        labels: ['Start Date'],
        values: [this.paraObj["fromDate"]],
        nullable: false     
      } , 
      {
        name: 'EndDate',
        labels: ['End Date'],
        values: [this.paraObj["toDate"]],
        nullable: false     
      }]; 
    }
    else if (reportName == "ie_DateWiseHourlyProductionReport") {
      /// set parameters
      this.parameters = [{
        name: 'FromDate',
        labels: ['From Date'],
        values: [this.paraObj["fromDate"]],
        nullable: false     
      } , 
      {
        name: 'ToDate',
        labels: ['To Date'],
        values: [this.paraObj["toDate"]],
        nullable: false     
      },
      {
        name: 'FactoryId',
        lables: ['Factory Id'],
        values: [this.paraObj["userLocation"]],
        nullable: false
      }]; 
    }
    else if (reportName == "ie_SectionProductionReport") {
      /// set parameters
      this.parameters = [{
        name: 'FromDate',
        labels: ['From Date'],
        values: [this.paraObj["fromDate"]],
        nullable: false     
      } , 
      {
        name: 'ToDate',
        labels: ['To Date'],
        values: [this.paraObj["toDate"]],
        nullable: false     
      },
      {
        name: 'FactoryId',
        lables: ['Factory Id'],
        values: [this.paraObj["userLocation"]],
        nullable: false
      }]; 
    }
    else if (reportName == "ie_StyleWiseHourlyProductionReport") {
      /// set parameters
      this.parameters = [{
        name: 'FromDate',
        labels: ['From Date'],
        values: [this.paraObj["fromDate"]],
        nullable: false     
      } , 
      {
        name: 'ToDate',
        labels: ['To Date'],
        values: [this.paraObj["toDate"]],
        nullable: false     
      },
      {
        name: 'FactoryId',
        lables: ['Factory Id'],
        values: [this.paraObj["userLocation"]],
        nullable: false
      }]; 
    }
  }

  loadCCSApprovals() {
    var reportName = this.paraObj["reportName"];
    this.reportPath = this.reportFolder + "/" + reportName;
    
    if(reportName == "CostSheetFormat") { 
      /// set parameters
      this.parameters = [{
        name: 'CostHeaderId',
        labels: ['Cost Header Id'],
        values: [this.paraObj["docId"]],
        nullable: false     
      }]; 
    }
  }

  loadPtrackApprovals() {
    var reportName = this.paraObj["reportName"];
    this.reportPath = this.ptrackreportFolder + "/" + reportName;

    if(reportName == "BookingRequest") { 
      /// set parameters
      this.parameters = [{
        name: 'BRIdx',
        labels: ['BRIdx'],
        values: [this.paraObj["docId"]],
        nullable: false     
      }]; 
    }else if (reportName == "FactoryLayout") {
      /// set parameters
      this.parameters = [{
      name: 'FLIdx',
      labels: ['FLIdx'],
      values: [this.paraObj["FLIdx"]],
      nullable: false     
      }]; 
    }  
    if(reportName == "TransportbookingInvoice") { 
      /// set parameters
      this.parameters = [{
        name: 'PIHIdx',
        labels: ['PIHIdx'],
        values: [this.paraObj["PIHIdx"]],
        nullable: false     
      }]; 
    }
  }
}
