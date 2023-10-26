import { ErrorLogComponent } from './Users/error-log/error-log.component';
import { MaterialIssueComponent } from './transaction/material-issue/material-issue.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SharedModule } from './_modules/shared.module';
import { TestErrorsComponent } from './errors/test-errors/test-errors.component';
import { ErrorInterceptor } from './interceptor/error.interceptor';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { MainsidebarComponent } from './mainsidebar/mainsidebar.component';
import { FooterComponent } from './footer/footer.component';
import { UserRegisterComponent } from './Users/user-register/user-register.component';
import { MenuListComponent } from './Users/menu-list/menu-list.component';
import { MasterSizeComponent } from './Master/size/master-size/master-size.component';
import { MasterColorComponent } from './Master/color/master-color/master-color.component';
import { MasterColorCardComponent } from './Master/color/master-color-card/master-color-card.component';
import { MasterSizeCardComponent } from './Master/size/master-size-card/master-size-card.component';
import { DatePipe } from '@angular/common';
import { MasterStoresiteComponent } from './Master/master-storesite/master-storesite.component';
import { MasterUnitsComponent } from './Master/unit/master-units/master-units.component';
import { MasterBrandComponent } from './Master/brand/master-brand/master-brand.component';
import { MasterBrandcodeComponent } from './Master/brand/master-brandcode/master-brandcode.component';
import { MasterMaterialtypeComponent } from './Master/master-materialtype/master-materialtype.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CustomerTabComponent } from './Master/customer/customer-tab/customer-tab.component';
import { CustomerHeaderComponent } from './Master/customer/customer-header/customer-header.component';
import { CustomerUserComponent } from './Master/customer/customer-user/customer-user.component';
import { CustomerAddressComponent } from './Master/customer/customer-address/customer-address.component';
import { CustomerBrandComponent } from './Master/customer/customer-brand/customer-brand.component';
import { CustomerDivisionComponent } from './Master/customer/customer-division/customer-division.component';
import { CustomerCurrencyComponent } from './Master/customer/customer-currency/customer-currency.component';
import { CustomerDefaultComponent } from './Master/customer/customer-default/customer-default.component';
import { CustomerLocationsComponent } from './Master/customer/customer-locations/customer-locations.component';
import { MasterSerialnoDetailsComponent } from './Master/master-serialno-details/master-serialno-details.component';
import { MasterProductTabComponent } from './Master/Product/master-product-tab/master-product-tab.component';
import { FlexFieldTabComponent } from './Master/Article/flex-field-tab/flex-field-tab.component';
import { ReportViewerComponent } from './report/report-viewer/report-viewer.component';
import { ReportViewerModule } from 'ngx-ssrs-reportviewer';
import { BoldReportViewerModule } from '@boldreports/angular-reporting-components';
import { BoldreportViewerComponent } from './report/boldreport-viewer/boldreport-viewer.component';
import { ColorTabComponent } from './Master/color/color-tab/color-tab.component';
import { ColorAllocCardComponent } from './Master/color/color-alloc-card/color-alloc-card.component';
import { SizeTabComponent } from './Master/size/size-tab/size-tab.component';
import { SizeAllocCardComponent } from './Master/size/size-alloc-card/size-alloc-card.component';
import { ArticleTabComponent } from './Master/Article/article-tab/article-tab.component';
import { UnitConversionComponent } from './Master/unit/unit-conversion/unit-conversion.component';
import { UnitTabComponent } from './Master/unit/unit-tab/unit-tab.component';
import { FluteTypeComponent } from './Master/flute-type/flute-type.component';
import { SalesAgentComponent } from './Master/sales-agent/sales-agent.component';
import { CurrencyComponent } from './Master/currency/currency.component';
import { CountriesComponent } from './Master/countries/countries.component';
import { PaymentTermsComponent } from './Master/payment-terms/payment-terms.component';
import { CodeDefinitionComponent } from './Users/code-definition/code-definition.component';
import { AddressTypeComponent } from './Master/address-type/address-type.component';
import { NgYasYearPickerModule } from 'ngy-year-picker';
import { ArticleUmoConversionComponent } from './Master/Article/article-umo-conversion/article-umo-conversion.component';
import { BrandTabComponent } from './Master/brand/brand-tab/brand-tab.component';
import { UserPermittabComponent } from './Users/user-permittab/user-permittab.component';
import { ApproveCenterComponent } from './Users/approve-center/approve-center.component';
import { CustomerTypeComponent } from './Master/customer-type/customer-type.component';
import { PaymentModeComponent } from './Master/payment-mode/payment-mode.component';
import { DispatchSiteComponent } from './Master/master-storesite/dispatch-site/dispatch-site.component';
import { StoresiteTabComponent } from './Master/master-storesite/storesite-tab/storesite-tab.component';
import { MasterCompanyComponent } from './Master/master-company/master-company.component';
import { ReportFormComponent } from './report/report-form/report-form.component';
import { ReportListComponent } from './Users/report-list/report-list.component';
import { ArticleBrandAllocationComponent } from './Master/Article/article-brand-allocation/article-brand-allocation.component';
import { CustomerOtherCodeComponent } from './Master/customer/customer-other-code/customer-other-code.component';
import { CustomerOtherComponent } from './Master/customer/customer-other/customer-other.component';
import { UserMasterSettingsComponent } from './Users/user-master-settings/user-master-settings.component';
import { MaterialRequestComponent } from './transaction/purchasing/material-request/material-request.component';
import { MaterialRequestApproveComponent } from './transaction/purchasing/material-request-approve/material-request-approve.component';
import { PurchasingOrderComponent } from './transaction/purchasing/purchasing-order/purchasing-order.component';
import { MrIndentListComponent } from './transaction/purchasing/mr-indent-list/mr-indent-list.component';
import { UserIndentListComponent } from './transaction/purchasing/user-indent-list/user-indent-list.component';
import { AdhocIndentListComponent } from './transaction/purchasing/adhoc-indent-list/adhoc-indent-list.component';
import { IndentDetailsComponent } from './transaction/purchasing/indent-details/indent-details.component';
import { SalesorderListComponent } from './transaction/purchasing/salesorder-list/salesorder-list.component';
import { ArticleListComponent } from './transaction/purchasing/article-list/article-list.component';
import { MasterPortsComponent } from './Master/master-ports/master-ports.component';
import { SupplierHeaderComponent } from './Master/supplier/supplier-header/supplier-header.component';
import { SupplierCurrencyComponent } from './Master/supplier/supplier-currency/supplier-currency.component';
import { SupplierTabComponent } from './Master/supplier/supplier-tab/supplier-tab.component';
import { SupplierTypeComponent } from './Master/supplier-type/supplier-type.component';
import { AccountTypeComponent } from './Master/account-type/account-type.component';
import { ShipmentModeComponent } from './Master/shipment-mode/shipment-mode.component';
import { SupplierAddressComponent } from './Master/supplier/supplier-address/supplier-address.component';
import { GrnComponent } from './transaction/purchasing/grn/grn.component';
import { MasterForwarderComponent } from './Master/master-forwarder/master-forwarder.component';
import { PurchaseOrderTypeComponent } from './Master/purchase-order-type/purchase-order-type.component';
import { MasterBasisComponent } from './Master/master-basis/master-basis.component';
import { DeliveryTermsComponent } from './Master/delivery-terms/delivery-terms.component';
import { StockAdjuestmentComponent } from './transaction/Inventory/stock-adjuestment/stock-adjuestment.component';
import { InventArticleListComponent } from './transaction/Inventory/invent-article-list/invent-article-list.component';
import { IgxExcelExporterService, IgxCsvExporterService, IgxIconModule, IgxDatePickerModule, IgxComboModule, IgxInputGroupModule, IgxCheckboxModule, IgxRadioModule, IgxGridModule, IgxTabsModule, IgxMaskModule, IgxActionStripModule, IgxAvatarModule, IgxTooltipModule, IgxDialogModule, IgxCardModule, IgxDividerModule, IgxHierarchicalGridModule, IgxTimePickerModule, IgxExpansionPanelModule } from 'igniteui-angular';
import { MasterProdTypeComponent } from './Master/Product/master-prod-type/master-prod-type.component';
import { MasterProdGroupComponent } from './Master/Product/master-prod-group/master-prod-group.component';
import { MasterProdSubCategoryComponent } from './Master/Product/master-prod-sub-category/master-prod-sub-category.component';
import { FlexFieldDetailsComponent } from './Master/Article/flex-field-details/flex-field-details.component';
import { MasterArticleComponent } from './Master/Article/master-article/master-article.component';
import { AppComponentComponent } from './Master/Article/app-component/app-component.component';
import { AssignProdtypeCatComponent } from './Master/Product/assign-prodtype-cat/assign-prodtype-cat.component';
import { AssignProdgroupTypeComponent } from './Master/Product/assign-prodgroup-type/assign-prodgroup-type.component';
import { AssignColorComponent } from './Master/Article/assign-color/assign-color.component';
import { AssignSizeComponent } from './Master/Article/assign-size/assign-size.component';
import { UserApproveComponent } from './Users/user-approve/user-approve.component';
import { UserSiteComponent } from './Users/user-site/user-site.component';
import { UserReportComponent } from './Users/user-report/user-report.component';
import { MasterProdComponent } from './Master/Product/master-prod/master-prod.component';
import { AssignMainCategoryComponent } from './Master/Product/assign-main-category/assign-main-category.component';
import { AssignCategoryComponent } from './Master/Product/assign-category/assign-category.component';
import { SubCategoryComponent } from './Master/Product/sub-category/sub-category.component';
import { SpecialCategoryComponent } from './Master/Product/special-category/special-category.component';
import { UserPwchangeComponent } from './Users/user-pwchange/user-pwchange.component';
import { UserPermissionComponent } from './Users/user-permission/user-permission.component';
import { ModuleRegisterComponent } from './Users/module-register/module-register.component';
import { FlexFieldValueListComponent } from './Master/Article/flex-field-value-list/flex-field-value-list.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { ProdDispatchComponent } from './transaction/dispatch/prod-dispatch/prod-dispatch.component';
import { StockArticleListComponent } from './transaction/dispatch/stock-article-list/stock-article-list.component';




@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    LoginComponent,     
    TestErrorsComponent,
    NotFoundComponent,
    ServerErrorComponent,
    MainsidebarComponent,
    FooterComponent,    
    UserRegisterComponent, 
    UserPwchangeComponent, 
    MenuListComponent, 
    UserPermissionComponent, 
    ModuleRegisterComponent, 
    MasterSizeComponent, 
    MasterColorComponent, 
    MasterColorCardComponent, 
    MasterSizeCardComponent, 
    MasterStoresiteComponent,
    MasterUnitsComponent,
    MasterBrandComponent,
    MasterBrandcodeComponent,
    MasterMaterialtypeComponent,
    CustomerTabComponent,
    CustomerHeaderComponent,
    CustomerUserComponent,
    CustomerAddressComponent,
    CustomerBrandComponent,
    CustomerDivisionComponent,
    CustomerCurrencyComponent,
    CustomerDefaultComponent,
    CustomerLocationsComponent,
    MasterProdTypeComponent,
    MasterProdGroupComponent,
    MasterProdSubCategoryComponent,
    MasterSerialnoDetailsComponent,
    MasterProductTabComponent,
    FlexFieldDetailsComponent,
    FlexFieldValueListComponent,
    FlexFieldTabComponent,
    MasterArticleComponent,
    AppComponentComponent,
    AssignProdtypeCatComponent,
    AssignProdgroupTypeComponent,
    ReportViewerComponent,
    BoldreportViewerComponent,
    ColorTabComponent,
    ColorAllocCardComponent,
    SizeTabComponent,
    SizeAllocCardComponent,
    ArticleTabComponent,
    AssignColorComponent,
    AssignSizeComponent,
    UnitConversionComponent,
    UnitTabComponent,
    FluteTypeComponent,
    SalesAgentComponent,
    CurrencyComponent,
    CountriesComponent,
    PaymentTermsComponent,
    CodeDefinitionComponent,
    AddressTypeComponent,
    ArticleUmoConversionComponent,
    BrandTabComponent,
    UserApproveComponent,
    UserPermittabComponent,
    ApproveCenterComponent,
    ReportFormComponent,
    ReportListComponent,
    MaterialIssueComponent,
    ErrorLogComponent,
    CustomerTypeComponent,
    PaymentModeComponent,
    DispatchSiteComponent,
    StoresiteTabComponent,
    MasterCompanyComponent,
    ArticleBrandAllocationComponent,
    CustomerOtherCodeComponent,
    CustomerOtherComponent,
    UserMasterSettingsComponent,
    UserSiteComponent,
    UserReportComponent,
    MaterialRequestComponent,
    MaterialRequestApproveComponent,
    PurchasingOrderComponent,
    MrIndentListComponent,
    UserIndentListComponent,
    AdhocIndentListComponent,
    IndentDetailsComponent,
    SalesorderListComponent,
    ArticleListComponent,
    MasterPortsComponent,
    SupplierHeaderComponent,
    SupplierCurrencyComponent,
    SupplierTabComponent,
    SupplierTypeComponent,
    AccountTypeComponent,
    ShipmentModeComponent,
    SupplierAddressComponent,
    GrnComponent,
    MasterProdComponent,
    MasterForwarderComponent,
    PurchaseOrderTypeComponent,
    MasterBasisComponent,
    DeliveryTermsComponent,
    StockAdjuestmentComponent,
    InventArticleListComponent,
    SpecialCategoryComponent,
    SubCategoryComponent,
    AssignCategoryComponent,
    AssignMainCategoryComponent,
    SpinnerComponent,
    StockAdjuestmentComponent,
    ProdDispatchComponent,
    StockArticleListComponent,
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    IgxIconModule,
    BrowserAnimationsModule,
    SharedModule,
    CollapseModule.forRoot(), 
    IgxDatePickerModule,
    IgxComboModule,
    IgxInputGroupModule,
    IgxCheckboxModule,
    IgxRadioModule,
    IgxGridModule,
    IgxTabsModule,
    IgxMaskModule,
    IgxActionStripModule,
    IgxAvatarModule,
    IgxTooltipModule,
    IgxDialogModule,
    IgxCardModule,
	  IgxDividerModule,
    ReportViewerModule,
    BoldReportViewerModule,
    IgxHierarchicalGridModule,
    NgYasYearPickerModule,
    BrowserModule,
    IgxTimePickerModule,
    IgxExpansionPanelModule
  ],
  providers: [
    DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
    ,IgxExcelExporterService, IgxCsvExporterService
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
