import { customerothercode } from './../src/app/_models/customerothercode';
import { CartonBoxType } from 'src/app/_models/carton-box-type';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Article } from 'src/app/_models/article';
import { Color } from 'src/app/_models/color';
import { Company } from 'src/app/_models/company';
import { CustomerLoc } from 'src/app/_models/customerLoc';
import { CustomerHd } from 'src/app/_models/customerHd';
import { Size } from 'src/app/_models/size';
import { environment } from 'src/environments/environment';
import { Category } from 'src/app/_models/category';
import { MaterialType } from 'src/app/_models/materialType';
import { Card } from 'src/app/_models/card';
import { Units } from 'src/app/_models/units';
import { StoreSite } from 'src/app/_models/storeSite';
import { Process } from 'src/app/_models/process';
import { Brand } from 'src/app/_models/brand';
import { BrandCode } from 'src/app/_models/brandCode';
import { CustomerCurrency } from 'src/app/_models/customerCurrency';
import { CustomerBrand } from 'src/app/_models/customerBrand';
import { CustomerUser } from 'src/app/_models/customerUser';
import { AddressType } from 'src/app/_models/addressType';
import { CustomerAddressList } from 'src/app/_models/customerAddressList';
import { CustomerDivision } from 'src/app/_models/customerDivision';
import { ProdDefinition } from 'src/app/_models/prodDefinition';
import { CostingGroup } from 'src/app/_models/costingGroup';
import { ProductType } from 'src/app/_models/productType';
import { ProductGroup } from 'src/app/_models/productGroup';
import { FlexFieldDetails } from 'src/app/_models/flexFieldDetails';
import { FlexFieldValueList } from 'src/app/_models/flexFieldValueList';
import { CatProdType } from 'src/app/_models/catProdType';
import { ColorAllocation } from 'src/app/_models/colorAllocation';
import { ColorAllocCard } from 'src/app/_models/colorAllocCard';
import { SizeAllocation } from 'src/app/_models/sizeAllocation';
import { SizeAllocCard } from 'src/app/_models/sizeAllocCard';
import { UnitConversion } from 'src/app/_models/unitConversion';
import { FluteType } from 'src/app/_models/fluteType';
import { SpecialInstruction } from 'src/app/_models/specialInstruction';
import { SalesAgent } from 'src/app/_models/salesAgent';
import { Currency } from 'src/app/_models/currency';
import { Countries } from 'src/app/_models/countries';
import { PaymentTerm } from 'src/app/_models/paymentTerm';
import { CodeDefinition } from 'src/app/_models/codeDefinition';
import { SequenceSettings } from 'src/app/_models/sequenceSettings';
import { ArticleUOMConv } from 'src/app/_models/articleUOMConv';
import { CustomerType } from 'src/app/_models/customerType';
import { InvoiceType } from 'src/app/_models/invoiceType';
import { PaymentMode } from 'src/app/_models/paymentmode';
import { DispatchSite } from 'src/app/_models/dispatch-site';
import { ReceiptType } from 'src/app/_models/receiptType';
import { customerother } from 'src/app/_models/customerother';
import { Reasons } from 'src/app/_models/Reasons';
import { userMasterSettings } from 'src/app/_models/userMasterSettings';
import { UserSite } from 'src/app/_models/UserSite';
import { ReportUser } from 'src/app/_models/ReportUser';
import { PurchaseOrderType } from 'src/app/_models/purchaseOrderType';
import { Ports } from 'src/app/_models/ports';
import { Forwarder } from 'src/app/_models/forwarder';
import { DeliveryTerms } from 'src/app/_models/deliveryTerms';
import { ShipmentModes } from 'src/app/_models/shipmentModes';
import { SupplierType } from 'src/app/_models/supplierType';
import { AccountType } from 'src/app/_models/accountType';
import { AdditionalCharges } from 'src/app/_models/additionalCharges';
import { SupplierHeader } from 'src/app/_models/supplierHeader';
import { GrnType } from 'src/app/_models/grnType';
import { Product } from 'src/app/_models/Product';
import { EnumType } from 'src/app/_models/enumType';
import { Basis } from 'src/app/_models/basis';
import { DispatchReason } from 'src/app/_models/dispatchReason';
import { SupplierAddressList } from 'src/app/_models/supplierAddressList';
import { AdditionalChargesModule } from 'src/app/_models/additionalChargesModule';
import { PackmapDto } from 'src/app/_models/PackmapDto';
import { SpecialCategory } from 'src/app/_models/specialCategory';
import { SubCategory } from 'src/app/_models/subCategory';
import { FROrders } from 'src/app/_models/FROrders';
import { maincategory } from 'src/app/_models/maincategory';
import { ProdSubCategory } from 'src/app/_models/ProdSubCategory';
import { RejectReasons } from 'src/app/_models/RejectReasons';
import { fasubcategory } from 'src/app/_models/fasubcategory';
import { Allocations } from 'src/app/_models/Allocations';
import { brandAllocation } from 'src/app/_models/brandAllocation';
import { Model } from 'src/app/_models/model';
import { Season } from 'src/app/_models/season';
import { Gender } from 'src/app/_models/gender';
import { Fabriccom } from 'src/app/_models/fabriccom';
import { Fabriccategory } from 'src/app/_models/fabriccategory';
import { Washtypes } from 'src/app/_models/washtypes';
import { Employee } from 'src/app/_models/employee';
import { Operation } from 'src/app/_models/operation';
import { OperationSectionToEmp } from 'src/app/_models/OperationSectionToEmp';
import { MWSMaster } from 'src/app/_models/mwsmaster';

var usertoken: any;
if (localStorage.length > 0) {
  // usertoken = JSON.parse(localStorage.getItem('token'));
  usertoken = localStorage.getItem('token');
  //console.log(usertoken);
}

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: 'Bearer ' + usertoken,
  }),
};

@Injectable({
  providedIn: 'root',
})
export class MasterService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // getCompany(moduleId: number) {
  //   return this.http.get<Company[]>(this.baseUrl + 'Master/Company/' + moduleId,httpOptions);
  // }
  getCompany(moduleId: number) {
    return this.http.get<Company[]>(
      this.baseUrl + 'Master/Company/' + moduleId,
      httpOptions
    );
  }

  //#region "Size"

  getSizeCard() {
    return this.http.get<Card[]>(this.baseUrl + 'Master/SizeCard', httpOptions);
  }

  getSize() {
    return this.http.get<Size[]>(this.baseUrl + 'Master/Size', httpOptions);
  }

  saveSize(size: Size) {
    return this.http.post(this.baseUrl + 'Master/Size', size, httpOptions);
  }

  saveSizeCard(sizeCard: Card) {
    return this.http.post(
      this.baseUrl + 'Master/SizeCard',
      sizeCard,
      httpOptions
    );
  }

  deactiveSizeCard(model: any) {
    return this.http.post(
      this.baseUrl + 'Master/SizeCard/Deactive',
      model,
      httpOptions
    );
  }

  //#endregion "Size"

  //#region "Color"

  getColorCard() {
    return this.http.get<Card[]>(
      this.baseUrl + 'Master/ColorCard',
      httpOptions
    );
  }

  getColor() {
    return this.http.get<Color[]>(this.baseUrl + 'Master/Color', httpOptions);
  }

  saveColorCard(colorCard: Card) {
    return this.http.post(
      this.baseUrl + 'Master/ColorCard',
      colorCard,
      httpOptions
    );
  }

  saveColor(color: Color) {
    return this.http.post(this.baseUrl + 'Master/Color', color, httpOptions);
  }

  deactiveColorCard(model: any) {
    return this.http.post(
      this.baseUrl + 'Master/ColorCard/Deactive',
      model,
      httpOptions
    );
  }

  //#region "Color Allocation"

  getColorAllocDetails(id: number) {
    return this.http.get<ColorAllocation[]>(
      this.baseUrl + 'Master/ColorAlloc/' + id,
      httpOptions
    );
  }

  saveColorAllocation(colorAlloc: ColorAllocCard[]) {
    return this.http.post(
      this.baseUrl + 'Master/SaveColorAll',
      colorAlloc,
      httpOptions
    );
  }

  deleteColorAllocation(colorAlloc: ColorAllocCard[]) {
    return this.http.post(
      this.baseUrl + 'Master/DelColorAll',
      colorAlloc,
      httpOptions
    );
  }

  //#endregion "Color Allocation"

  //#region "Size Allocation"

  getSizeAllocDetails(id: number) {
    return this.http.get<SizeAllocation[]>(
      this.baseUrl + 'Master/SizeAlloc/' + id,
      httpOptions
    );
  }

  saveSizeAllocation(sizeAlloc: SizeAllocCard[]) {
    return this.http.post(
      this.baseUrl + 'Master/SaveSizeAll',
      sizeAlloc,
      httpOptions
    );
  }

  deleteSizeAllocation(sizeAlloc: SizeAllocCard[]) {
    return this.http.post(
      this.baseUrl + 'Master/DelSizeAll',
      sizeAlloc,
      httpOptions
    );
  }

  //#endregion "Color Allocation"DelSizeAll

  //#endregion "Color"

  //#region "ArticleColor"

  getArticleColor(id: number) {
    return this.http.get<Color[]>(
      this.baseUrl + 'Master/ArtiColor/' + id,
      httpOptions
    );
  }

  getArticleColorAll(id: number) {
    return this.http.get<any>(
      this.baseUrl + 'Master/ArtiColor/' + id,
      httpOptions
    );
  }

  getArtColorPermitDt(id: number) {
    return this.http.get<any>(
      this.baseUrl + 'Master/GetAtiClr/' + id,
      httpOptions
    );
  }

  saveArtColor(artColor: any[]) {
    return this.http.post(
      this.baseUrl + 'Master/SaveArtColor',
      artColor,
      httpOptions
    );
  }

  deleteArtColor(artColor: any[]) {
    return this.http.post(
      this.baseUrl + 'Master/DelArtColor',
      artColor,
      httpOptions
    );
  }

  //#endregion "ArticleColor"

  //#region "ArticleSize"

  getArticleSize(id: number) {
    return this.http.get<Size[]>(
      this.baseUrl + 'Master/ArtiSize/' + id,
      httpOptions
    );
  }

  getArtSizePermitDt(id: number) {
    return this.http.get<any>(
      this.baseUrl + 'Master/GetAtiSize/' + id,
      httpOptions
    );
  }

  saveArticleSize(artSize: any[]) {
    return this.http.post(
      this.baseUrl + 'Master/SaveArtSize',
      artSize,
      httpOptions
    );
  }

  deleteArticleSize(artSize: any[]) {
    return this.http.post(
      this.baseUrl + 'Master/DelArtSize',
      artSize,
      httpOptions
    );
  }

  //#endregion "ArticleSize"

  //#region "Article"

  getArticlesAll() {
    return this.http.get<Article[]>(
      this.baseUrl + 'Master/Articles',
      httpOptions
    );
  }

  getCompArticleAll(companyId: number) {
    return this.http.get<Article[]>(
      this.baseUrl + 'Master/CompArti/' + companyId,
      httpOptions
    );
  }
  getCompActiveArticleAll(companyId: number) {
    return this.http.get<Article[]>(
      this.baseUrl + 'Master/CompArtic/' + companyId,
      httpOptions
    );
  }

  getArticlePrices(articleId: number) {
    return this.http.get<any>(
      this.baseUrl + 'Master/ArtPrice/' + articleId,
      httpOptions
    );
  }

  saveArticle(article: any) {
    return this.http.post(
      this.baseUrl + 'Master/SaveArticle',
      article,
      httpOptions
    );
  }

  getcartonArticleDetails(article: any) {
    return this.http.post<any>(
      this.baseUrl + 'Master/ArtProdWise',
      article,
      httpOptions
    );
  }
  getArticleDetails(article: any) {
    return this.http.post<any>(
      this.baseUrl + 'Master/CartArtProdWise',
      article,
      httpOptions
    );
  }

  getArticleColorSize(categoryId: number) {
    return this.http.get<any>(
      this.baseUrl + 'Master/ArtDt/' + categoryId, httpOptions);
  }

  getCCardArticles() {
    return this.http.get<any>(this.baseUrl + 'Master/CCArticle', httpOptions);
  }

  getRCardArticles() {
    return this.http.get<any>(this.baseUrl + 'Master/RCArticle', httpOptions);
  }

  getSCardArticles() {
    return this.http.get<any>(this.baseUrl + 'Master/SCArticle', httpOptions);
  }

  getDCardArticles() {
    return this.http.get<any>(this.baseUrl + 'Master/DCArticle', httpOptions);
  }

  deactiveArticle(article: any) {
    return this.http.post(
      this.baseUrl + 'Master/DAArticle',
      article,
      httpOptions
    );
  }

  deleteArticle(article: any) {
    return this.http.post(
      this.baseUrl + 'Master/DelArticle',
      article,
      httpOptions
    );
  }

  //#endregion "Article"

  //#region "CodeDefinition"

  getCodeDefinition(codeDef: any) {
    return this.http.post<CodeDefinition[]>(
      this.baseUrl + 'Master/CodeDef',
      codeDef,
      httpOptions
    );
  }

  saveCodeDefinition(codeDef: CodeDefinition) {
    return this.http.post(
      this.baseUrl + 'Master/SaveCDef',
      codeDef,
      httpOptions
    );
  }

  deleteCodeDefinition(codeDef: any) {
    return this.http.post(
      this.baseUrl + 'Master/DeleteCDef',
      codeDef,
      httpOptions
    );
  }

  //#endregion "CodeDefinition"

  //#region "Units"

  getUnits() {
    return this.http.get<Units[]>(this.baseUrl + 'Master/Units', httpOptions);
  }

  saveUnits(model: any) {
    return this.http.post(
      this.baseUrl + 'Master/saveunits',
      model,
      httpOptions
    );
  }

  editUnits(units: Units) {
    return this.http.post(
      this.baseUrl + 'Master/Editunits',
      units,
      httpOptions
    );
  }

  //#endregion "Units"

  //#region "Special Instruction"

  getSpecialInstruction() {
    return this.http.get<SpecialInstruction[]>(
      this.baseUrl + 'Master/SpeInst',
      httpOptions
    );
    // return this.http.get('Master/SpeInst').map res=>res.json());
  }

  saveSpecialInstruction(saveSpeIns: SpecialInstruction) {
    return this.http.post(
      this.baseUrl + 'Master/SaveSpeInst',
      saveSpeIns,
      httpOptions
    );
  }

  //#endregion "Speacial Instruction"

  //#region "Unit Conversion"

  getUnitConversion() {
    return this.http.get<UnitConversion[]>(
      this.baseUrl + 'Master/UnitConv',
      httpOptions
    );
  }

  saveUnitConversion(unitConv: UnitConversion) {
    return this.http.post(
      this.baseUrl + 'Master/SaveUC',
      unitConv,
      httpOptions
    );
  }

  //#endregion "Unit Conversion"

  //#region  "StoreSite"

  getStoreSite() {
    return this.http.get<StoreSite[]>(
      this.baseUrl + 'Master/Storesite',
      httpOptions
    );
  }

  saveStoreSite(model: any) {
    return this.http.post(
      this.baseUrl + 'Master/SaveStoreSite',
      model,
      httpOptions
    );
  }

  storesiteDeactivate(storeSite: any) {
    return this.http.post(
      this.baseUrl + 'Master/DAStoreSite',
      storeSite,
      httpOptions
    );
  }
  //#endregion "StoreSite"

  //#region "Process"

  getProcess(locId: number) {
    return this.http.get<Process[]>(
      this.baseUrl + 'Master/Process/' + locId,
      httpOptions
    );
  }

  saveProcess(model: any) {
    return this.http.post(
      this.baseUrl + 'Master/SaveProcess',
      model,
      httpOptions
    );
  }

  //#endregion "Process"

  //#region "Category"

  getCategory() {
    return this.http.get<Category[]>(
      this.baseUrl + 'Master/Category',
      httpOptions
    );
  }

  saveCategory(model: any) {
    return this.http.post(
      this.baseUrl + 'Master/SaveCategory',
      model,
      httpOptions
    );
  }

  //#endregion "Category"

  //#region "MaterialType"

  getMaterialType() {
    return this.http.get<MaterialType[]>(
      this.baseUrl + 'Master/MaterialType',
      httpOptions
    );
  }

  saveMaterialType(model: any) {
    return this.http.post(
      this.baseUrl + 'Master/SaveMaterialType',
      model,
      httpOptions
    );
  }

  //#endregion "MaterialType"

  //#region "Brand / Brand Code"

  getBrand(locId: number) {
    return this.http.get<Brand[]>(
      this.baseUrl + 'Master/Brand/' + locId,
      httpOptions
    );
  }

  getBrandCode(brandId: number) {
    return this.http.get<BrandCode[]>(
      this.baseUrl + 'Master/BrandCodes/' + brandId,
      httpOptions
    );
  }

  getBrandCodes(brandId: number) {
    return this.http.get<BrandCode[]>(
      this.baseUrl + 'Master/BrandCode/' + brandId,
      httpOptions
    );
  }

  saveBrand(model: any) {
    return this.http.post(
      this.baseUrl + 'Master/SaveBrand',
      model,
      httpOptions
    );
  }

  saveBrandCode(model: any) {
    return this.http.post(
      this.baseUrl + 'Master/SaveBrandCode',
      model,
      httpOptions
    );
  }

  deactiveBrandCode(brandcode: any) {
    return this.http.post(
      this.baseUrl + 'Master/DABrandCode',
      brandcode,
      httpOptions
    );
  }

  //#endregion "Brand / Brand Code"

  //#region "AddressType"

  getAddressType() {
    return this.http.get<AddressType[]>(
      this.baseUrl + 'Master/AddressType',
      httpOptions
    );
  }

  saveAddressType(model: any) {
    return this.http.post(
      this.baseUrl + 'Master/SaveAddType',
      model,
      httpOptions
    );
  }

  //#endregion "AddressType"

  //#region "Customer Header"

  getCust() {
    return this.http.get<CustomerHd[]>(
      this.baseUrl + 'Master/Cust',
      httpOptions
    );
  }

  getCustomer(locId: number) {
    return this.http.get<CustomerHd[]>(
      this.baseUrl + 'Master/Customer/' + locId,
      httpOptions
    );
  }

  getCustomerHdAll(LocId: number) {
    return this.http.get<CustomerHd[]>(
      this.baseUrl + 'Master/CusAll/' + LocId,
      httpOptions
    );
  }

  saveCustomerHeader(model: any) {
    return this.http.post(
      this.baseUrl + 'Master/SaveCustomerHd',
      model,
      httpOptions
    );
  }

  deactiveCustomerHeader(model: any) {
    return this.http.post(
      this.baseUrl + 'Master/CustHdDeactive',
      model,
      httpOptions
    );
  }

  //#endregion "Customer Header"

  //#region "Customer Location"

  getCustomerLocations(CustomerId: number) {
    return this.http.get<CustomerLoc[]>(
      this.baseUrl + 'Master/CustomerLocs/' + CustomerId,
      httpOptions
    );
  }

  getCustomerLocation(CustomerId: number) {
    return this.http.get<CustomerLoc[]>(
      this.baseUrl + 'Master/CustomerLoc/' + CustomerId,
      httpOptions
    );
  }

  deactiveCustomerLoc(customerLoc: number) {
    return this.http.post(
      this.baseUrl + 'Master/DeactCusLoc',
      customerLoc,
      httpOptions
    );
  }

  saveCustomerLocation(model: any) {
    return this.http.post(
      this.baseUrl + 'Master/SaveCustomerLoc',
      model,
      httpOptions
    );
  }

  //#endregion "Customer Location"

  //#region  "Customer Division"

  getCustomerDivision(customerId) {
    return this.http.get<any>(
      this.baseUrl + 'Master/CusDivision/' + customerId,
      httpOptions
    );
  }

  saveCustomerDivision(cusDivision: CustomerDivision) {
    return this.http.post(
      this.baseUrl + 'Master/SaveCD',
      cusDivision,
      httpOptions
    );
  }

  disableCustomerDivision(cusDivision: CustomerDivision) {
    return this.http.post(
      this.baseUrl + 'Master/DisableCD',
      cusDivision,
      httpOptions
    );
  }

  //#endregion "Customer Division"

  //#region "Customer Address"

  saveCustomerAddress(cusAddress: CustomerAddressList) {
    return this.http.post(
      this.baseUrl + 'Master/SaveCusAddress',
      cusAddress,
      httpOptions
    );
  }

  getCustomerAddressList(customerId: number) {
    return this.http.get<any[]>(
      this.baseUrl + 'Master/CusAddress/' + customerId,
      httpOptions
    );
  }

  //getActiveCustomerAddressList(customerId: number) {
  //  return this.http.get<any[]>(
  //    this.baseUrl + 'Master/CusAddr/' + customerId,
  //    httpOptions
  //  );
  //}

  deactiveCustomerAddress(cusAddress: CustomerAddressList) {
    return this.http.post(
      this.baseUrl + 'Master/DeactCusAdd',
      cusAddress,
      httpOptions
    );
  }

  //#endregion "Customer Address"

  //#region "Customer User"

  getCustomerUser(customerId: number) {
    return this.http.get<any>(
      this.baseUrl + 'Master/CustomerUser/' + customerId,
      httpOptions
    );
  }

  getCustomerUserAll(customerId: number) {
    return this.http.get<any>(
      this.baseUrl + 'Master/CustomerUser/All/' + customerId,
      httpOptions
    );
  }

  saveCustomerUser(cusUser: CustomerUser) {
    return this.http.post(
      this.baseUrl + 'Master/SaveCusUser',
      cusUser,
      httpOptions
    );
  }

  deactiveCustomerUser(cusUser: any) {
    return this.http.post(
      this.baseUrl + 'Master/CusUser/Deactive',
      cusUser,
      httpOptions
    );
  }

  //#endregion "Customer User"

  //#region "Customer Brand"

  getCustomerBrand(customerId: number) {
    return this.http.get<any>(
      this.baseUrl + 'Master/CusBrand/' + customerId,
      httpOptions
    );
  }

  saveCustomerBrand(customerBrand: CustomerBrand) {
    return this.http.post(
      this.baseUrl + 'Master/SaveCB',
      customerBrand,
      httpOptions
    );
  }

  deleteCustomerBrand(customerBrand: CustomerBrand) {
    return this.http.post(
      this.baseUrl + 'Master/DeleteCB',
      customerBrand,
      httpOptions
    );
  }

  //#endregion "Customer Brand"

  //#region "Customer Currency"

  getCustomCurrency(id: number) {
    return this.http.get<any>(
      this.baseUrl + 'Master/CusCurrency/' + id,
      httpOptions
    );
  }

  saveCustomerCurrency(cusCurrency: CustomerCurrency) {
    return this.http.post(
      this.baseUrl + 'Master/SaveCusC/',
      cusCurrency,
      httpOptions
    );
  }

  deleteCustomerCurrency(cusCurrency: any) {
    return this.http.post(
      this.baseUrl + 'Master/DeleteCusC',
      cusCurrency,
      httpOptions
    );
  }

  //#endregion "Customer Currency"

  //#region  "Sales Category"

  getSalesCategory() {
    return this.http.get<any>(this.baseUrl + 'Master/SalesCat', httpOptions);
  }

  //#endregion "Sales Category"

  //#region  "Payment Terms"

  getPaymentTerms() {
    return this.http.get<PaymentTerm[]>(
      this.baseUrl + 'Master/PayTerms',
      httpOptions
    );
  }

  savePaymentTerms(payTerms: PaymentTerm) {
    return this.http.post(
      this.baseUrl + 'Master/SavePT',
      payTerms,
      httpOptions
    );
  }

  //#endregion "Payment Terms"

  //#region  "Sales Agent"

  getSalesAgent(locId: number) {
    return this.http.get<SalesAgent[]>(
      this.baseUrl + 'Master/SalesAgent/' + locId,
      httpOptions
    );
  }

  saveSalesAgent(salesAgent: SalesAgent) {
    return this.http.post(
      this.baseUrl + 'Master/SaveSA',
      salesAgent,
      httpOptions
    );
  }

  //#endregion "Sales Agent"

  //#region  "Countries"

  getCountries() {
    return this.http.get<any>(this.baseUrl + 'Master/Countries', httpOptions);
  }

  saveCountries(countries: Countries) {
    return this.http.post(
      this.baseUrl + 'Master/SaveCou',
      countries,
      httpOptions
    );
  }

  //#endregion "Countries"

  //#region "Currency"

  getCurrency() {
    return this.http.get<Currency[]>(
      this.baseUrl + 'Master/Currency',
      httpOptions
    );
  }

  saveCurrency(currency: Currency) {
    return this.http.post(
      this.baseUrl + 'Master/SaveCurr',
      currency,
      httpOptions
    );
  }

  //#endregion "Currency"

  //#region Supplier Type
  getSupplierType() {
    return this.http.get<SupplierType[]>(
      this.baseUrl + 'Master/SupT',
      httpOptions
    );
  }
  //#endregion Supplier Type

  //region Supplier Currency
  getSupplierCurrency(suplierId: number) {
    return this.http.get<any[]>(
      this.baseUrl + 'Master/SupplierC/' + suplierId,
      httpOptions
    );
  }
  saveSupplierCurrency(supplierCurrency: any) {
    return this.http.post(
      this.baseUrl + 'Master/SaveSupC',
      supplierCurrency,
      httpOptions
    );
  }
  deleteSupplierCurrency(supCurrency: any) {
    return this.http.post(
      this.baseUrl + 'Master/DeleteSupC',
      supCurrency,
      httpOptions
    );
  }
  //endregion Supplier Currency

  //#region "Article UOM Conversion"

  getArticleUOMConversion(articleId: number) {
    return this.http.get<any[]>(
      this.baseUrl + 'Master/ArtBase/' + articleId,
      httpOptions
    );
  }

  getArticleUOMConvAll(articleId: number) {
    return this.http.get<any[]>(
      this.baseUrl + 'Master/ArtBaseAll/' + articleId,
      httpOptions
    );
  }

  saveArticleUOMConv(artUOMConv: ArticleUOMConv) {
    return this.http.post(
      this.baseUrl + 'Master/SaveAUOM',
      artUOMConv,
      httpOptions
    );
  }

  activeArticleUOMConv(artUOMConv: any) {
    return this.http.post(
      this.baseUrl + 'Master/ActiveAUOM',
      artUOMConv,
      httpOptions
    );
  }

  //#endregion "Article UOM Conversion"

  //#region "Product Definition"

  getProductDefinitionDt(prodHeaderId: number) {
    return this.http.get<ProdDefinition[]>(
      this.baseUrl + 'Master/ProdDefDt/' + prodHeaderId,
      httpOptions
    );
  }

  getProductDefinitionList() {
    return this.http.get<any>(this.baseUrl + 'Master/ProdDefList', httpOptions);
  }

  saveProductDefinition(prodDefinition: ProdDefinition) {
    return this.http.post(
      this.baseUrl + 'Master/SaveProdDef',
      prodDefinition,
      httpOptions
    );
  }

  deleteProductDefinition(prodDefinition: any) {
    return this.http.post(
      this.baseUrl + 'Master/DeleteProdDef',
      prodDefinition,
      httpOptions
    );
  }

  //#endregion "Product Definition"

  //#region "Costing Group"

  saveCostingGroup(costGroup: CostingGroup) {
    return this.http.post(
      this.baseUrl + 'Master/SaveCostGroup',
      costGroup,
      httpOptions
    );
  }

  getCostingGroup(locId: number) {
    return this.http.get<CostingGroup[]>(
      this.baseUrl + 'Master/CostingGroup/' + locId,
      httpOptions
    );
  }

  //#endregion "Costing Group"

  //#region "Flute Type"

  getFluteType(locId: number) {
    return this.http.get<FluteType[]>(
      this.baseUrl + 'Master/FluteType/' + locId,
      httpOptions
    );
  }

  saveFluteType(fluteType: FluteType) {
    return this.http.post(
      this.baseUrl + 'Master/SaveFT',
      fluteType,
      httpOptions
    );
  }

  //#endregion "Flute Type"

  //#region "Serial No"

  saveSeqSettings(serialNo: SequenceSettings) {
    return this.http.post(
      this.baseUrl + 'Master/SaveSeqSett',
      serialNo,
      httpOptions
    );
  }

  getSeqSettings(locId: number) {
    return this.http.get<SequenceSettings[]>(
      this.baseUrl + 'Master/SeqSettDt/' + locId,
      httpOptions
    );
  }

  //#endregion "Serial No"

  //#region "Product Type"

  saveProductType(prodType: ProductType) {
    return this.http.post(
      this.baseUrl + 'Master/SaveProdType',
      prodType,
      httpOptions
    );
  }

  getProductTypeDetils(catId: number) {
    return this.http.get<ProductType[]>(
      this.baseUrl + 'Master/ProdType/' + catId,
      httpOptions
    );
  }

  getProductTypeAll() {
    return this.http.get<ProductType[]>(
      this.baseUrl + 'Master/ProdType',
      httpOptions
    );
  }

  deactiveProductType(prodType: any) {
    return this.http.post(
      this.baseUrl + 'Master/Deactive/ProdType',
      prodType,
      httpOptions
    );
  }

  assignCatProdType(prodType: any[]) {
    return this.http.post(
      this.baseUrl + 'Master/AssignCatPT',
      prodType,
      httpOptions
    );
  }

  deleteCatProdType(prodType: any[]) {
    return this.http.post(
      this.baseUrl + 'Master/DeleteCatPT',
      prodType,
      httpOptions
    );
  }

  getCatProdTypeDetails(catId: number) {
    return this.http.get<CatProdType[]>(
      this.baseUrl + 'Master/CatProdT/' + catId,
      httpOptions
    );
  }

  //#endregion "Product Type"

  //#region "Product Group"

  saveProductGroup(prodGroup: ProductGroup) {
    return this.http.post(
      this.baseUrl + 'Master/SaveProdGroup',
      prodGroup,
      httpOptions
    );
  }

  getProductGroupDt(prodTypeId: number) {
    return this.http.get<any>(
      this.baseUrl + 'Master/PGroup/' + prodTypeId,
      httpOptions
    );
  }

  getProductGroupAll() {
    return this.http.get<any>(this.baseUrl + 'Master/ProdGroup', httpOptions);
  }

  deactiveProductGroup(prodGroup: ProductGroup) {
    return this.http.post(
      this.baseUrl + 'Master/Deactive/ProdGroup',
      prodGroup,
      httpOptions
    );
  }

  getProdTypeGroup(prodTypeId: number) {
    return this.http.get<any[]>(
      this.baseUrl + 'Master/PTGroup/' + prodTypeId,
      httpOptions
    );
  }

  assignProdTypeGroup(prodType: any[]) {
    return this.http.post(
      this.baseUrl + 'Master/AssignPGroup/',
      prodType,
      httpOptions
    );
  }

  deleteProdTypeGroup(prodType: any[]) {
    return this.http.post(
      this.baseUrl + 'Master/DeletePGroup/',
      prodType,
      httpOptions
    );
  }

  //#endregion "Product Group"

  //#region "Product Sub Category"

  saveProductSubCat(subCat: ProdSubCategory) {
    return this.http.post(
      this.baseUrl + 'Master/SaveProdSubCat',
      subCat,
      httpOptions
    );
  }

  getProductSubCatDt(groupId: number) {
    return this.http.get<any>(
      this.baseUrl + 'Master/PSubCat/' + groupId,
      httpOptions
    );
  }

  deactiveProductSubCat(subCat: ProdSubCategory) {
    return this.http.post(
      this.baseUrl + 'Master/Deactive/PSubCat',
      subCat,
      httpOptions
    );
  }

  //#endregion "Product Sub Category"

  //#region "Flex Field Details"

  saveFlexFieldDetails(flexFieldDt: FlexFieldDetails) {
    return this.http.post(
      this.baseUrl + 'Master/SaveFlexFDt',
      flexFieldDt,
      httpOptions
    );
  }

  getFlexFieldDetails(catId: number) {
    return this.http.get<any[]>(
      this.baseUrl + 'Master/FlexFieldDt/' + catId,
      httpOptions
    );
  }

  deactiveFlexFieldDt(flexFieldDt: FlexFieldDetails) {
    return this.http.post(
      this.baseUrl + 'Master/Deactive/FlexFldDt',
      flexFieldDt,
      httpOptions
    );
  }

  //// GET FLEX FIELD ONLY VALUED
  getFlexFieldDtList() {
    return this.http.get<any[]>(
      this.baseUrl + 'Master/FlexFldDt/Val',
      httpOptions
    );
  }

  /// GET FLEX FIELD LIST RELATED TO CATEGORY AND PROD TYPE
  getFlexFieldCatPTWise(flexFieldDt: any) {
    return this.http.post<any[]>(
      this.baseUrl + 'Master/FFListCatPT',
      flexFieldDt,
      httpOptions
    );
  }

  //#endregion "Flex Field Details"

  //#region "Flex Field ValueList"

  saveFlexFieldValList(flexFldValList: FlexFieldValueList) {
    return this.http.post(
      this.baseUrl + 'Master/SaveFFValList',
      flexFldValList,
      httpOptions
    );
  }

  getFlexFieldValList(flexFldId: number) {
    return this.http.get<any[]>(
      this.baseUrl + 'Master/FFValList/' + flexFldId,
      httpOptions
    );
  }

  deleteFlexFieldValList(flexFldValList: any) {
    return this.http.post(
      this.baseUrl + 'Master/DeleteFFValList',
      flexFldValList,
      httpOptions
    );
  }

  //#endregion "Flex Field ValueList"

  //#region "Reject Reason"

  getRejectReason(locId: number) {
    return this.http.get<RejectReasons[]>(
      this.baseUrl + 'Master/RejReason/' + locId,
      httpOptions
    );
  }

  saveRejectReason(rejReason: RejectReasons) {
    return this.http.post(
      this.baseUrl + 'Master/SaveRReason',
      rejReason,
      httpOptions
    );
  }

  //#endregion

  // getCustomerDt(customerId: number) {
  //   return this.http.get<CustomerDt[]>(this.baseUrl + 'Master/CustomerDt/' + customerId , httpOptions);
  // }

  //#region Customer Type

  getCustomerType() {
    return this.http.get<CustomerType[]>(
      this.baseUrl + 'Master/CusType',
      httpOptions
    );
  }

  saveCustomerType(customerType: CustomerType) {
    return this.http.post(
      this.baseUrl + 'Master/SaveCustType',
      customerType,
      httpOptions
    );
  }

  //#endregion Customer Type

  //#region Invoice Type

  getInvoiceType() {
    return this.http.get<InvoiceType[]>(
      this.baseUrl + 'Master/InvType',
      httpOptions
    );
  }

  saveInvoiceType(invoiceType: InvoiceType) {
    return this.http.post(
      this.baseUrl + 'Master/SaveInvType',
      invoiceType,
      httpOptions
    );
  }

  //#endregion Invoice Type

  //#region Receipt Type

  getReceiptType() {
    return this.http.get<ReceiptType[]>(
      this.baseUrl + 'Master/RecType',
      httpOptions
    );
  }

  //#endregion Receipt Type

  //#region Payment Mode
  getPaymentMode() {
    return this.http.get<PaymentMode[]>(
      this.baseUrl + 'Master/PayMode',
      httpOptions
    );
  }

  savePaymentMode(paymentMode: PaymentMode) {
    return this.http.post(
      this.baseUrl + 'Master/SavePayMode',
      paymentMode,
      httpOptions
    );
  }
  //#endregion Payment Mode

  //#region DispatchSite
  getDispatchSite() {
    return this.http.get<any>(
      this.baseUrl + 'Master/DispatchSite',
      httpOptions
    );
  }

  saveDispatchSite(dispatchSite: DispatchSite) {
    return this.http.post(
      this.baseUrl + 'Master/SaveDisSite',
      dispatchSite,
      httpOptions
    );
  }
  //#endregion DispatchSite

  //region MasterCompany
  getCurrencyName() {
    return this.http.get<any>(this.baseUrl + 'Master/GetCurrency', httpOptions);
  }
  getMasterCompany() {
    return this.http.get<any>(this.baseUrl + 'Master/GetComp', httpOptions);
  }
  saveMasterCompany(company: Company) {
    return this.http.post(
      this.baseUrl + 'Master/SaveComp',
      company,
      httpOptions
    );
  }
  //endregion MasterCompany
  //region CartonType
  getCartonType() {
    return this.http.get<any[]>(
      this.baseUrl + 'Master/GetCartType',
      httpOptions
    );
  }

  getCartonBoxType(id: number) {
    return this.http.get<CartonBoxType[]>(
      this.baseUrl + 'Master/GetCartBoxType/' + id,
      httpOptions
    );
  }

  saveCartonBoxType(cartonBoxType: CartonBoxType) {
    return this.http.post(
      this.baseUrl + 'Master/SaveCarton',
      cartonBoxType,
      httpOptions
    );
  }
  //end region CartonType
  getBrandCodeList() {
    return this.http.get<BrandCode[]>(
      this.baseUrl + 'Master/BrandCode/',
      httpOptions
    );
  }
  saveArtBrandCode(artBrandCode: any) {
    return this.http.post(
      this.baseUrl + 'Master/SaveArtBC',
      artBrandCode,
      httpOptions
    );
  }
  deleteArticleBrandCodeMapping(ArticleBC: CustomerBrand) {
    return this.http.post(
      this.baseUrl + 'Master/DelArtBC/',
      ArticleBC,
      httpOptions
    );
  }
  getBrandCodeArticle(BrandcodeId: number) {
    return this.http.get<any>(
      this.baseUrl + 'Master/BCArticle/' + BrandcodeId,
      httpOptions
    );
  }
  getDateSelection(id: number) {
    return this.http.get<any>(this.baseUrl + 'Master/GetDS/' + id, httpOptions);
  }
  getCustomerOtherCode() {
    return this.http.get<customerothercode[]>(
      this.baseUrl + 'Master/CusCode',
      httpOptions
    );
  }
  saveCustomerOtherCode(customerothercode: customerothercode) {
    return this.http.post(
      this.baseUrl + 'Master/SaveCusCode',
      customerothercode,
      httpOptions
    );
  }
  getCustomerOther() {
    return this.http.get<customerother[]>(
      this.baseUrl + 'Master/CusOther',
      httpOptions
    );
  }
  getCustomerOthers(id: number) {
    return this.http.get<any>(
      this.baseUrl + 'Master/CusOthers/' + id,
      httpOptions
    );
  }
  getCustomerOtherCodes(customerId: number) {
    return this.http.get<any>(
      this.baseUrl + 'Master/CusCodes/' + customerId,
      httpOptions
    );
  }
  saveCustomerOther(customerother: customerother) {
    return this.http.post(
      this.baseUrl + 'Master/SaveCusOther',
      customerother,
      httpOptions
    );
  }
  getReasons(moduleid: number) {
    return this.http.get<Reasons[]>(
      this.baseUrl + 'Master/Reasons/' + moduleid,
      httpOptions
    );
  }
  getUserMasterSettings(userid: number) {
    return this.http.get<userMasterSettings[]>(
      this.baseUrl + 'Master/UserM/' + userid,
      httpOptions
    );
  }

  saveUserMasterSettings(userMasterSettings: userMasterSettings) {
    return this.http.post(
      this.baseUrl + 'Master/SaveUserM',
      userMasterSettings,
      httpOptions
    );
  }
  saveUserSite(UserSite: UserSite) {
    return this.http.post(
      this.baseUrl + 'Master/SUserSite',
      UserSite,
      httpOptions
    );
  }

  getUserSiteList(userId: number) {
    return this.http.get<any[]>(
      this.baseUrl + 'Master/UserSite/' + userId,
      httpOptions
    );
  }
  deleteUserSiteList(model: any) {
    return this.http.post(
      this.baseUrl + 'Master/SiteUserDelete',
      model,
      httpOptions
    );
  }
  saveUserReportList(reportUser: ReportUser[]) {
    return this.http.post(
      this.baseUrl + 'Master/ReportUserSave',
      reportUser,
      httpOptions
    );
  }
  deleteUserReportList(model: any) {
    return this.http.post(
      this.baseUrl + 'Master/ReportUserDelete',
      model,
      httpOptions
    );
  }
  //#region dashBoardSalesStats
  GetDashBoardOneData(dashboardDt: any) {
    return this.http.post<any>(
      this.baseUrl + 'Master/GetDashBoardOneData',
      dashboardDt,
      httpOptions
    );
  }

  GetDashBoardSalesChartData(dashboardDt: any) {
    return this.http.post<any>(
      this.baseUrl + 'Master/DashDt',
      dashboardDt,
      httpOptions
    );
  }

  //#endregion dashBoardSalesStats

  //#region InventorySerialNo

  getInventorySerialNo(serialNo: any) {
    return this.http.post<any>(
      this.baseUrl + 'Master/InvRefNo',
      serialNo,
      httpOptions
    );
  }

  //#endregion InventorySerialNo

  //#region UserSite
  getUserSite(userId: number) {
    return this.http.get<StoreSite[]>(
      this.baseUrl + 'Master/UserSites/' + userId,
      httpOptions
    );
  }

  //#endregion UserSite

  //#region User Master Setting

  getIntentUserMasterSetting() {
    return this.http.get<any>(this.baseUrl + 'Master/UserIntMS', httpOptions);
  }

  //#endregion User Master Setting

  //#region Purchasing OrderType

  getPurchasingOrderType() {
    return this.http.get<PurchaseOrderType[]>(
      this.baseUrl + 'Master/POType',
      httpOptions
    );
  }
  savePurchaseOrderType(poType: PurchaseOrderType) {
    return this.http.post(this.baseUrl + 'Master/SavePoType', poType, httpOptions
    );
  }
  //#endregion Purchasing OrderType

  //#region Ports

  getPorts() {
    return this.http.get<Ports[]>(this.baseUrl + 'Master/Ports', httpOptions);
  }

  getPort() {
    return this.http.get<Ports[]>(this.baseUrl + 'Master/Port', httpOptions);
  }

  savePorts(Ports: Ports) {
    return this.http.post(this.baseUrl + 'Master/SaveP', Ports, httpOptions);
  }
  //#endregion Ports

  //#region SupplierHd
  saveSupplierHd(SupplierHeader: SupplierHeader) {
    return this.http.post(
      this.baseUrl + 'Master/SaveSup',
      SupplierHeader,
      httpOptions
    );
  }
  deactiveSupplier(model: any) {
    return this.http.post(
      this.baseUrl + 'Master/SupplierDeactive',
      model,
      httpOptions
    );
  }
  //#endregion SupplierHd

  //#region Forwarder

  getForwarder() {
    return this.http.get<Forwarder[]>(
      this.baseUrl + 'Master/Forwarder',
      httpOptions
    );
  }
  saveForwarder(forwarder: Forwarder) {
    return this.http.post(
      this.baseUrl + 'Master/SaveForw',
      forwarder,
      httpOptions
    );
  }


  //#endregion Forwarder

  //#region DeliveryTerms

  getDeliveryTerms() {
    return this.http.get<DeliveryTerms[]>(
      this.baseUrl + 'Master/DeliTerms',
      httpOptions
    );
  }
  saveDeliveryTerm(Delivery: any) {
    return this.http.post(
      this.baseUrl + 'Master/SaveDelT',
      Delivery,
      httpOptions
    );
  }

  //#endregion DeliveryTerms

  //#region Shipment Modes

  getShipmentModes() {
    return this.http.get<ShipmentModes[]>(
      this.baseUrl + 'Master/ShipModes',
      httpOptions
    );
  }

  //#endregion Shipment Modes

  //region SupplierType
  saveSupplieType(SupplierType: any) {
    return this.http.post(
      this.baseUrl + 'Master/SaveSupT',
      SupplierType,
      httpOptions
    );
  }
  //endregion SupplierType

  //#region Account Type
  getAccountType() {
    return this.http.get<AccountType[]>(
      this.baseUrl + 'Master/AccountT',
      httpOptions
    );
  }
  saveAccountType(AccountType: any) {
    return this.http.post(
      this.baseUrl + 'Master/SaveAccT',
      AccountType,
      httpOptions
    );
  }
  //#endregion Account Type

  //region GRN Type
  getGRNType() {
    return this.http.get<GrnType[]>(
      this.baseUrl + 'Master/GRNType',
      httpOptions
    );
  }
  saveGRNType(GRNType: any) {
    return this.http.post(
      this.baseUrl + 'Master/SaveGRNT',
      GRNType,
      httpOptions
    );
  }
  //endregion GRN Type

  //region ShipmentType
  //getShipmentType(){
  //  return this.http.get<GRNType[]>(this.baseUrl + 'Master/GRNT', httpOptions);
  //}
  saveShipmentType(ShipmentMode: any) {
    return this.http.post(
      this.baseUrl + 'Master/SaveShipmentM',
      ShipmentMode,
      httpOptions
    );
  }
  //endregion ShipmentType

  //#region PTrack
  WorkStudySavedata(wsDt: any) {
    return this.http.post(
      this.baseUrl + 'PMaster/WorkStudySavedata',
      wsDt,
      httpOptions
    );
  }


  //#endregion PTrack

  //#region Get Employee
  getEmployeeData(location: string) {
    return this.http.get<Employee[]>(this.baseUrl + 'PMaster/EmpGet/' + location, httpOptions);
  }
  //#endregion Get Employee

  //#region Get Operation
  getOperationData(employeeId: number) {
    return this.http.get<Operation[]>(this.baseUrl + 'PMaster/OpeGet/' + employeeId, httpOptions);
  }
  //#endregion Get Operation

  //#region Operation Assigned To Employee Get
  getEmpOperationData(employeeId: number) {
    return this.http.get<any[]>(this.baseUrl + 'PMaster/EmpOpGet/' + employeeId, httpOptions);
  }
  //#endregion Operation Assigned To Employee Get

  //#region Operation Assigned To Employee Get
  saveEmpOperationData(operation: OperationSectionToEmp) {
    return this.http.post(this.baseUrl + 'PMaster/SaveEmp', operation, httpOptions);
  }
  //#endregion Operation Assigned To Employee Get

  //#region Operation Assigned To Employee Deactive
  deactiveOperation(operation: any) {
    return this.http.post(this.baseUrl + 'PMaster/DeactOp', operation, httpOptions);
  }
  //#endregion Operation Assigned To Employee Deactive


  //#region Get Factory Wise Departments
  getFactoryDepartment(locationId: number) {
    return this.http.get<any[]>(this.baseUrl + 'PMaster/DepartGet/' + locationId, httpOptions);
  }
  //#endregion Get Factory Wise Departments

  //region Get Factory , Department Wise Section
  getDepartmentSection(department: any) {
    return this.http.post(this.baseUrl + 'PMaster/GetSec', department, httpOptions);
  }
  //#endregion Get Factory , Department Wise Section

  //#region Get Factory , Department ,Section Wise Sub-Section
  getSectionSubSection(section: any) {
    return this.http.post(this.baseUrl + 'PMaster/GetSubSec', section, httpOptions);
  }
  //#endregion Get Factory , Department ,Section Wise Sub-Section

  //#region Get Factory , Department ,Section ,Sub-Section Wise Lines
  getSubSectionLine(section: any) {
    return this.http.post(this.baseUrl + 'PMaster/GetLine', section, httpOptions);
  }
  //endregion Get Factory , Department ,Section ,Sub-Section Wise Lines

  //#region Get Lost Time Reason
  getLostTimeReason(moduleId: number) {
    return this.http.get<any>(this.baseUrl + 'PMaster/LostRGet/' + moduleId, httpOptions);
  }
  //#endregion Get Lost Time Reason

  //#region Get Lost Time
  getLostDt(lost: any) {
    return this.http.post(this.baseUrl + 'PMaster/GetLost', lost, httpOptions);
  }
  //#endregion Get Lost Time

  //#region Save Lost Time
  saveLostDt(lostS: any) {
    return this.http.post(this.baseUrl + 'PMaster/SaveLost', lostS, httpOptions);
  }
  //#endregion Save Lost Time


  //#region CPD

  SaveCPDData(wsDt: any) {
    return this.http.post(
      this.baseUrl + 'PMaster/SaveCPDData',
      wsDt,
      httpOptions
    );
  }
  //#endregion CPD

  //#region Additional Charges
  getAddtionalCharges() {
    return this.http.get<AdditionalCharges[]>(
      this.baseUrl + 'Master/AddChargs',
      httpOptions
    );
  }

  getAddtionalCharge(moduleId: number) {
    return this.http.get<any[]>(
      this.baseUrl + 'Master/AddCharg/' + moduleId,
      httpOptions
    );
  }
  getAddtionalChargesModule() {
    return this.http.get<AdditionalChargesModule[]>(
      this.baseUrl + 'Master/AddChargM',
      httpOptions
    );
  }
  saveAdditionalCharges(additionalC: any) {
    return this.http.post(
      this.baseUrl + 'Master/SaveAddC',
      additionalC,
      httpOptions
    );
  }
  saveAdditionalChargesModule(additionalC: any) {
    return this.http.post(this.baseUrl + 'Master/SaveAddCM', additionalC, httpOptions);
  }

  deactiveAddChargeM(addchargeM: any) {
    return this.http.post(
      this.baseUrl + 'Master/DAAddM',
      addchargeM,
      httpOptions
    );
  }
  //#endregion Additional Charges

  // #region "Products" 

  getProductsAll() {
    return this.http.get<Product[]>(
      this.baseUrl + 'Master/Products',
      httpOptions
    );
  }
  //#region Enum Type

  getEnumType(enumType: string) {
    return this.http.get<EnumType[]>(
      this.baseUrl + 'Master/Enum/' + enumType,
      httpOptions
    );
  }

  deactiveProduct(products: any) {
    return this.http.post(
      this.baseUrl + 'Master/Deactive/Product',
      products,
      httpOptions
    );
  }
  //#endregion Enum Type

  //#region Basis
  getBasis() {
    return this.http.get<Basis[]>(
      this.baseUrl + 'Master/Basis',
      httpOptions
    );
  }
  saveBasis(basis: any) {
    return this.http.post(
      this.baseUrl + 'Master/SaveBasis',
      basis,
      httpOptions
    );
  }
  //#endregion Basis
  saveProduct(product: Product) {
    return this.http.post(
      this.baseUrl + 'Master/SaveProuct',
      product,
      httpOptions
    );
  }

  getProduct() {
    return this.http.get<Product[]>(this.baseUrl + 'Master/Products', httpOptions);
  }
  // #endregion ""Products"

  //Dispatch Reason
  getDispatchReason() {
    return this.http.get<DispatchReason[]>(this.baseUrl + 'Master/DispatchR', httpOptions);
  }
  saveDispatchReason(dispatchR: DispatchReason) {
    return this.http.post(this.baseUrl + 'Master/SaveDispatchR', dispatchR, httpOptions
    );
  }
  //end Dispatch Reason
  //SupplierAddressList
  getSupplierAddressList(suplierId: number) {
    return this.http.get<any[]>(
      this.baseUrl + 'Master/SupplierA/' + suplierId,
      httpOptions
    );
  }
  saveSupplierAddList(suppAdd: SupplierAddressList) {
    return this.http.post(this.baseUrl + 'Master/SupAddSave', suppAdd, httpOptions
    );
  }
  //end SupplierAddressList

  //#region Transport 
  SaveTransportData(wsDt: any) {
    console.log(wsDt);
    return this.http.post(this.baseUrl + 'PMaster/SaveTransportData', wsDt, httpOptions);
  }

  //#endregion Transport

  //#region Package Mapping 

  savePackagemapping(packmap: any) {
    return this.http.post(this.baseUrl + 'Master/SavePackMap',
      packmap, httpOptions);
  }

  getMappedDt(mapDt: any) {
    return this.http.post<PackmapDto[]>(this.baseUrl + 'Master/GetMappedDt', mapDt, httpOptions);
  }
  //#endregion Package Mapping 

  //#region Special Category
  getSpecialCategory() {
    return this.http.get<any[]>(
      this.baseUrl + 'Master/SpeCat',
      httpOptions
    );
  }

  saveSpecialCategory(specialCategory: SpecialCategory) {
    return this.http.post(
      this.baseUrl + 'Master/SpeCatSve',
      specialCategory,
      httpOptions
    );
  }

  deactiveSpecialCategory(specialCategory: SpecialCategory) {
    return this.http.post(
      this.baseUrl + 'Master/DactCat',
      specialCategory,
      httpOptions
    );
  }
  //#endregion Special Category

  //region Sub Category
  getSubCategory() {
    return this.http.get<any[]>(
      this.baseUrl + 'Master/SubCat',
      httpOptions
    );
  }

  saveSubCategory(subCategory: SubCategory) {
    return this.http.post(
      this.baseUrl + 'Master/SubCatSve',
      subCategory,
      httpOptions
    );
  }

  deactiveSubCategory(subCategory: SubCategory) {
    return this.http.post(
      this.baseUrl + 'Master/DactSubCat',
      subCategory,
      httpOptions
    );
  }

  getProdGroupSubCatDetails(groupId: number) {
    return this.http.get<any[]>(
      this.baseUrl + 'Master/GroupSubCat/' + groupId,
      httpOptions
    );
  }
  //#endregion Sub Category
  //region Prod Group Sub Cat
  assignProGroupSubCat(subCat: any[]) {
    return this.http.post(
      this.baseUrl + 'Master/AssignGroupSubCat',
      subCat,
      httpOptions
    );
  }

  deleteProGroupSubCat(subCat: any[]) {
    return this.http.post(
      this.baseUrl + 'Master/DeleteGroupSubCat',
      subCat,
      httpOptions
    );
  }
  //endregion Prod Group Sub Cat
  //region Prod Sub Cat Category
  getProdSubCatCategoryDetails(subcatId: number) {
    return this.http.get<any[]>(
      this.baseUrl + 'Master/SubCatCat/' + subcatId,
      httpOptions
    );
  }

  assignSubCatCategory(subCat: any[]) {
    return this.http.post(
      this.baseUrl + 'Master/AssignSubCat',
      subCat,
      httpOptions
    );
  }

  deleteSubCatCategory(subCat: any[]) {
    return this.http.post(
      this.baseUrl + 'Master/DeleteSubCat',
      subCat,
      httpOptions
    );
  }
  //endregion Prod Sub Cat Category

  //-------region FR------- 
  getFROrders(requestdate: string) {
    return this.http.get<FROrders[]>(this.baseUrl + 'PMaster/FROrders/' + requestdate, httpOptions);
  }

  getFRWFXDetails(frDt: any) {
    // console.log(frDt);
    return this.http.post<any[]>(this.baseUrl + 'PMaster/getFRWFXDetails', frDt, httpOptions);
  }

  saveFRAssocationOrder(frPODto: any) {
    return this.http.post(this.baseUrl + 'PMaster/SaveFRPO', frPODto, httpOptions);
  }

  getFRNewOrders(ordercode: string) {
    return this.http.get<any[]>(this.baseUrl + 'PMaster/FRNewOrders/' + ordercode, httpOptions);
  }

  //======endregion FR=======

  //-------region Fixed Assets------- 

  getMainCategory() {
    return this.http.get<maincategory[]>(this.baseUrl + 'Master/MainCategory', httpOptions);
  }

  SaveFAMainCategory(famaincategory: maincategory) {
    return this.http.post(this.baseUrl + 'Master/SaveFAmaincategory', famaincategory, httpOptions);
  }

  SaveFASubCategory(fasubcategory: fasubcategory) {
    return this.http.post(this.baseUrl + 'Master/SaveFASubcategory', fasubcategory, httpOptions);
  }

  getFASubCategory() {
    return this.http.get<fasubcategory[]>(this.baseUrl + 'Master/SubCategory', httpOptions);
  }

  getSubAllocDetails(id: number) {
    return this.http.get<ColorAllocation[]>(this.baseUrl + 'Master/FASubAll/' + id, httpOptions);
  }

  saveSubToMainCategoryAllocation(subtomainall: Allocations[]) {
    return this.http.post(this.baseUrl + 'Master/saveFASubtoMain', subtomainall, httpOptions);
  }

  deleteSubToMainCategoryAllocation(subtomainall: Allocations[]) {
    return this.http.post(this.baseUrl + 'Master/deleteFASubtoMain', subtomainall, httpOptions);
  }
  //-------endregion Fixed Assets------- 

  //#region Stock Adj Reason

  getStockAdjuestmentReason() {
    return this.http.get<any[]>(this.baseUrl + 'Master/SAReason', httpOptions);
  }

  //#endregion Stock Adj Reason

  getBrandAllocDetails(id: number) {
    return this.http.get<brandAllocation[]>(this.baseUrl + 'Master/BrandAll/' + id, httpOptions);
  }

  saveBrandAllocation(subtomainall: Allocations[]) {
    return this.http.post(this.baseUrl + 'Master/saveBrandAll', subtomainall, httpOptions);
  }

  deleteBrandToCategoryAllocation(brandToCateall: Allocations[]) {
    return this.http.post(this.baseUrl + 'Master/delBrandToCat', brandToCateall, httpOptions);
  }

  //#region Model
  saveModel(model: any) {
    //console.log(model);
    return this.http.post(this.baseUrl + 'Master/SaveModel', model, httpOptions);
  }

  getModel() {
    return this.http.get<Model[]>(this.baseUrl + 'Master/Model', httpOptions);
  }

  getModelAllocDetails(id: number) {
    return this.http.get<Model[]>(this.baseUrl + 'Master/ModelAll/' + id, httpOptions);
  }


  saveModelAllocation(modelToBrandall: Allocations[]) {
    return this.http.post(this.baseUrl + 'Master/saveModelAll', modelToBrandall, httpOptions);
  }

  deleteModelToBrandAllocation(modelToBrandall: Allocations[]) {
    return this.http.post(this.baseUrl + 'Master/delModelToBrand', modelToBrandall, httpOptions);
  }
  //#endregion Model

  //#region Season
  GetSeason() {
    return this.http.get<Season[]>(
      this.baseUrl + 'Master/GetSeason',
      httpOptions
    );
  }
  //#region  Season

  //#region Gender
  GetGender() {
    return this.http.get<Gender[]>(
      this.baseUrl + 'Master/GetGender',
      httpOptions
    );
  }
  //#region  Gender

  //#region FabricCom
  GetfabricCom() {
    return this.http.get<Fabriccom[]>(
      this.baseUrl + 'Master/GetfabricCom',
      httpOptions
    );
  }
  //#region  FabricCom
  //#region FabricCategory
  GetfabricCategory() {
    return this.http.get<Fabriccategory[]>(
      this.baseUrl + 'Master/GetfabricCategory',
      httpOptions
    );
  }
  //#region  FabricCategory
  //#region WashType
  GetwashType() {
    return this.http.get<Washtypes[]>(
      this.baseUrl + 'Master/GetwashType',
      httpOptions
    );
  }
  //#region  WashType
  //#region  Save Apperale Article
  saveApperaleArticle(article: any) {
    return this.http.post(
      this.baseUrl + 'Master/saveApperaleArticle',
      article,
      httpOptions
    );
  }
  //#endregion Save Apperale Article

  //#region  Management Dashboar - MPlus
  GetDashBoardTwoData(dashboardDt: any) {
    return this.http.post<any[]>(
      this.baseUrl + 'PMaster/GetDashBoardTwoData',
      dashboardDt,
      httpOptions
    );
  }
  //#endregion Management Dashboar - MPlus
  //#region  MWS Master
  SaveMWSMasterData(wsDt: any) {
    //console.log(wsDt);
    return this.http.post(this.baseUrl + 'Master/SaveMWSMasterData', wsDt, httpOptions);
  }

  GetMWSMasterData(wsDt: any) {
    //console.log(wsDt);
    return this.http.post<MWSMaster[]>(this.baseUrl + 'Master/GetMWSMasterData', wsDt, httpOptions);
  }

  //#endregion  MWS Master
  getFactoryMBreaks(location: string) {
    return this.http.get(this.baseUrl + 'Master/GetMachinBK/' + location, httpOptions);
  }

  updateMachineBreakDt(machine: any) {
    return this.http.post<any>(this.baseUrl + 'Master/GetMachinUp', machine, httpOptions);
  }

}
