import { ReportListComponent } from './Users/report-list/report-list.component';
import { ReportFormComponent } from './report/report-form/report-form.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { TestErrorsComponent } from './errors/test-errors/test-errors.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { CustomerTabComponent } from './Master/customer/customer-tab/customer-tab.component';
import { MasterBrandcodeComponent } from './Master/brand/master-brandcode/master-brandcode.component';
import { MasterMaterialtypeComponent } from './Master/master-materialtype/master-materialtype.component';
import { MasterSerialnoDetailsComponent } from './Master/master-serialno-details/master-serialno-details.component';
import { MasterStoresiteComponent } from './Master/master-storesite/master-storesite.component';
import { AuthGuard } from './_guards/auth.guard';
import { BoldreportViewerComponent } from './report/boldreport-viewer/boldreport-viewer.component';
import { ColorTabComponent } from './Master/color/color-tab/color-tab.component';
import { SizeTabComponent } from './Master/size/size-tab/size-tab.component';
import { UnitTabComponent } from './Master/unit/unit-tab/unit-tab.component';
import { FluteTypeComponent } from './Master/flute-type/flute-type.component';
import { SalesAgentComponent } from './Master/sales-agent/sales-agent.component';
import { CurrencyComponent } from './Master/currency/currency.component';
import { CountriesComponent } from './Master/countries/countries.component';
import { PaymentTermsComponent } from './Master/payment-terms/payment-terms.component';
import { AddressTypeComponent } from './Master/address-type/address-type.component';
import { BrandTabComponent } from './Master/brand/brand-tab/brand-tab.component';
import {CustomerTypeComponent } from './Master/customer-type/customer-type.component';
import {PaymentModeComponent} from './Master/payment-mode/payment-mode.component';
import {DispatchSiteComponent} from './Master/master-storesite/dispatch-site/dispatch-site.component';
import {StoresiteTabComponent} from './Master/master-storesite/storesite-tab/storesite-tab.component';
import { MasterCompanyComponent } from './Master/master-company/master-company.component';
import { ErrorLogComponent } from './Users/error-log/error-log.component';
import { CustomerOtherCodeComponent } from './Master/customer/customer-other-code/customer-other-code.component';
import { CustomerOtherComponent } from './Master/customer/customer-other/customer-other.component';
import { MaterialRequestComponent } from './transaction/purchasing/material-request/material-request.component';
import { MaterialRequestApproveComponent } from './transaction/purchasing/material-request-approve/material-request-approve.component';
import { PurchasingOrderComponent } from './transaction/purchasing/purchasing-order/purchasing-order.component';
import { MrIndentListComponent } from './transaction/purchasing/mr-indent-list/mr-indent-list.component';
import { UserIndentListComponent } from './transaction/purchasing/user-indent-list/user-indent-list.component';
import { AdhocIndentListComponent } from './transaction/purchasing/adhoc-indent-list/adhoc-indent-list.component';
import { MasterPortsComponent } from './Master/master-ports/master-ports.component';
import { SupplierTabComponent } from './Master/supplier/supplier-tab/supplier-tab.component';
import { SupplierTypeComponent } from './Master/supplier-type/supplier-type.component';
import { AccountTypeComponent } from './Master/account-type/account-type.component';
import { ShipmentModeComponent } from './Master/shipment-mode/shipment-mode.component';
import { MasterForwarderComponent } from './Master/master-forwarder/master-forwarder.component';
import { PurchaseOrderTypeComponent } from './Master/purchase-order-type/purchase-order-type.component';
import { MasterBasisComponent } from './Master/master-basis/master-basis.component';
import { DeliveryTermsComponent } from './Master/delivery-terms/delivery-terms.component';

//MPlus
import { GrnComponent } from './transaction/purchasing/grn/grn.component';
import { StockAdjuestmentComponent } from './transaction/Inventory/stock-adjuestment/stock-adjuestment.component';
import { UserRegisterComponent } from './Users/user-register/user-register.component';
import { MenuListComponent } from './Users/menu-list/menu-list.component';
import { UserPermittabComponent } from './Users/user-permittab/user-permittab.component';
import { MasterProductTabComponent } from './Master/Product/master-product-tab/master-product-tab.component';
import { FlexFieldTabComponent } from './Master/Article/flex-field-tab/flex-field-tab.component';
import { ArticleTabComponent } from './Master/Article/article-tab/article-tab.component';
import { CodeDefinitionComponent } from './Users/code-definition/code-definition.component';
import { ArticleUmoConversionComponent } from './Master/Article/article-umo-conversion/article-umo-conversion.component';
import { ApproveCenterComponent } from './Users/approve-center/approve-center.component';
import { ArticleBrandAllocationComponent } from './Master/Article/article-brand-allocation/article-brand-allocation.component';
import { UserMasterSettingsComponent } from './Users/user-master-settings/user-master-settings.component';
import { ProdDispatchComponent } from './transaction/dispatch/prod-dispatch/prod-dispatch.component';


const routes: Routes = [
  {path:'', component: LoginComponent},
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'Home', component: HomeComponent },
      { path: 'UserRegister', component: UserRegisterComponent },
      { path: 'MenuList', component: MenuListComponent },
      { path: 'UserPermission', component: UserPermittabComponent },
      { path: 'ColorTab', component: ColorTabComponent },
      { path: 'SizeTab', component: SizeTabComponent },
      { path: 'MasterStoresite', component: MasterStoresiteComponent },
      { path: 'Brand', component: BrandTabComponent },
      { path: 'MasterBrandCode', component: MasterBrandcodeComponent },
      { path: 'MasterMaterialtype', component: MasterMaterialtypeComponent },
      { path: 'MasterCustomer', component: CustomerTabComponent },
      { path: 'SerialNoDetails', component: MasterSerialnoDetailsComponent },
      { path: 'ProductMenu', component: MasterProductTabComponent },
      { path: 'FlexField', component: FlexFieldTabComponent },
      { path: 'Article', component: ArticleTabComponent },
      { path: 'boldreport', component: BoldreportViewerComponent },
      { path: 'Unit', component: UnitTabComponent },
      { path: 'boldreport', component: BoldreportViewerComponent },
      { path: 'CustomerType', component: CustomerTypeComponent },
      { path: 'DispatchSite', component: DispatchSiteComponent },
      { path: 'PaymentMode', component: PaymentModeComponent },
      { path: 'MasterCompany', component: MasterCompanyComponent },
      { path: 'StoresiteTab', component: StoresiteTabComponent },
      { path: 'Unit', component: UnitTabComponent },
      { path: 'FluteType', component: FluteTypeComponent },
      { path: 'SalesAgent', component: SalesAgentComponent },
      { path: 'Currency', component: CurrencyComponent },
      { path: 'Countries', component: CountriesComponent },
      { path: 'PayTerms', component: PaymentTermsComponent },
      { path: 'CodeDefinition', component: CodeDefinitionComponent },
      { path: 'AddressType', component: AddressTypeComponent },
      { path: 'ArticleUOM', component: ArticleUmoConversionComponent },
      { path: 'ApproveCenter', component: ApproveCenterComponent },
      { path: 'Report', component: ReportFormComponent },
      { path: 'ReportList', component: ReportListComponent },
      { path: 'ErrorLog', component: ErrorLogComponent },
      { path: 'ApproveCenter', component: ApproveCenterComponent },
      { path: 'articleBrandAllocation', component: ArticleBrandAllocationComponent },
      { path: 'CustomerOtherCode', component: CustomerOtherCodeComponent },
      { path: 'CustomerOther', component: CustomerOtherComponent },
      { path: 'UserMasterSettings', component: UserMasterSettingsComponent },
      {path:'Home', component: HomeComponent},
      {path:'UserRegister', component: UserRegisterComponent },
      {path:'MenuList', component: MenuListComponent},
      {path:'UserPermission', component: UserPermittabComponent},
      {path:'ColorTab', component: ColorTabComponent},
      {path:'SizeTab', component: SizeTabComponent},
      {path:'MasterStoresite', component: MasterStoresiteComponent},
      {path:'Brand', component: BrandTabComponent},
      {path:'MasterBrandCode', component: MasterBrandcodeComponent},
      {path:'MasterMaterialtype', component: MasterMaterialtypeComponent},
      {path:'MasterCustomer', component: CustomerTabComponent},
      {path:'SerialNoDetails', component: MasterSerialnoDetailsComponent},
      {path:'ProductMenu', component: MasterProductTabComponent},
      {path:'FlexField', component: FlexFieldTabComponent},
      {path:'Article', component: ArticleTabComponent},
      {path:'boldreport', component: BoldreportViewerComponent },
      {path:'Unit', component: UnitTabComponent},
      {path:'boldreport', component: BoldreportViewerComponent },
      {path:'CustomerType', component:CustomerTypeComponent},
      {path:'DispatchSite', component:DispatchSiteComponent},
      {path:'PaymentMode',component:PaymentModeComponent},
      {path:'MasterCompany' , component:MasterCompanyComponent},
      {path:'StoresiteTab',component:StoresiteTabComponent},
      {path:'Unit',component: UnitTabComponent},
      {path:'FluteType', component: FluteTypeComponent},
      {path:'SalesAgent', component: SalesAgentComponent},
      {path:'Currency', component: CurrencyComponent},
      {path:'Countries', component: CountriesComponent},
      {path:'PayTerms', component: PaymentTermsComponent},
      {path:'CodeDefinition', component: CodeDefinitionComponent},
      {path:'AddressType', component: AddressTypeComponent},
      {path:'ArticleUOM', component: ArticleUmoConversionComponent},
      {path:'ApproveCenter', component: ApproveCenterComponent},
      {path:'Report', component: ReportFormComponent},
      {path:'ReportList', component: ReportListComponent},
      {path:'ErrorLog', component: ErrorLogComponent},
      {path:'MaterialReq', component: MaterialRequestComponent},
      {path:'MRApprove', component: MaterialRequestApproveComponent},
      {path:'PurchasingOrder', component: PurchasingOrderComponent},
      {path:'MRIndent', component: MrIndentListComponent},
      {path:'UserIndent', component: UserIndentListComponent},
      {path:'AdhocIndent', component: AdhocIndentListComponent},
      {path:'Ports',component:MasterPortsComponent},
      {path:'Supplier',component:SupplierTabComponent},
      {path:'Ports', component: MasterPortsComponent },
      {path:'SupplierType',component:SupplierTypeComponent},
      {path: 'Ports', component: MasterPortsComponent },
      {path:'SupplierType',component:SupplierTypeComponent},
      {path:'AccountType',component:AccountTypeComponent},
      {path:'ShipmentMode',component:ShipmentModeComponent},
      {path:'GRN', component: GrnComponent},
      {path:'Forwarder', component: MasterForwarderComponent},
      {path:'POType', component:PurchaseOrderTypeComponent},
      {path:'Basis',component:MasterBasisComponent},
      {path:'DeliveryT', component: DeliveryTermsComponent},
      {path:'stockAdj',component:StockAdjuestmentComponent},
      {path: 'Dispatch' , component: ProdDispatchComponent},

    ]
  },  
  {path:'not-found', component: NotFoundComponent},
  {path:'server-error', component: ServerErrorComponent},
  {path:'errors', component: TestErrorsComponent},  
  {path:'**', component: NotFoundComponent , pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
