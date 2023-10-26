import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FPPOProdDetails } from 'src/app/_models/fPPOProdDetails';
import { SalesOrder } from 'src/app/_models/salesOrder';
import { TransProdDetails } from 'src/app/_models/transProdDetails';
import { environment } from 'src/environments/environment';
import { BlockBooking } from 'src/app/_models/blockbooking';
import { ApproveCenter } from 'src/app/_models/ApproveCenter';
import { Ordercreation } from 'src/app/_models/ordercreation';
import { Recipe } from 'src/app/_models/recipe';
import { Costsheet } from 'src/app/_models/costsheet';

var usertoken: any;
//console.log(localStorage);
if (localStorage.length > 0) {
  // usertoken = JSON.parse(localStorage.getItem('token'));
  usertoken = localStorage.getItem('token');
  //console.log(usertoken);
}

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: 'Bearer ' + usertoken
    // 'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>',
    // 'Accept': '*/*'
  }),
};

@Injectable({
  providedIn: 'root'
})
export class SalesorderService {
  baseUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  getSalesOrderRef() {
    return this.http.get<SalesOrder>(this.baseUrl + 'SalesOrder/SORefNo' , httpOptions);
  }

  getSalesOrderDT(OrderRef: number) {
    return this.http.get<any>(this.baseUrl + 'SalesOrder/SO/' + OrderRef , httpOptions);
  }

  getPendCostSalesOrders(customerId: number) {
    return this.http.get<any>(this.baseUrl + 'SalesOrder/PendSO/' + customerId , httpOptions);
  }

  getPendSalesHeader(soHeaderId: number) {
    return this.http.get<any>(this.baseUrl + 'SalesOrder/SOHead/' + soHeaderId , httpOptions);
  }

  saveSalesOrder(model: any) {
    return this.http.post(this.baseUrl + 'SalesOrder/SaSO' , model , httpOptions);
  }

  getSalesOrderList(cusRef: string) {
    return this.http.get<any>(this.baseUrl + 'SalesOrder/SOList/' + cusRef , httpOptions);  
  }
  getSalesOrderListByOrderRef(orederRef: string){
    return this.http.get<any>(this.baseUrl + 'SalesOrder/SalesList/' + orederRef , httpOptions); 
  }
  getCostSalesOrderList(costingId: number) {
    return this.http.get<any>(this.baseUrl + 'SalesOrder/CSOList/' + costingId , httpOptions);  
  }

  getPendOrderItems(id: number) {
    return this.http.get<any>(this.baseUrl + 'SalesOrder/JobPedItems/' + id , httpOptions)
  }

  getPendDelivOrder(model: any) {
    return this.http.post<any>(this.baseUrl + 'SalesOrder/JobPedOrders' , model , httpOptions);
  }

  getRefNumber(transType: string) {
    return this.http.get<any>(this.baseUrl + 'SalesOrder/RefNum/' + transType , httpOptions);
  }

  getCostComination(model: any) {
    return this.http.post<any>(this.baseUrl + 'SalesOrder/CostComb' , model , httpOptions);
  }

  saveJobCard(model: any) {
    return this.http.post(this.baseUrl + 'SalesOrder/SaveJob' , model , httpOptions);
  }

  jobCardCancell(model: any){
    return this.http.post(this.baseUrl + 'SalesOrder/CancelJob' , model , httpOptions); 
  }

  getJobCardDetails(id: number) {
    return this.http.get<any>(this.baseUrl + 'SalesOrder/JobCard/' + id , httpOptions);
  }

  getJobCardList(customerPO: string) {
    return this.http.get<any>(this.baseUrl + 'SalesOrder/JCList/' + customerPO , httpOptions);
  }

  getJobCardLists(jobcardNo: string) {
    return this.http.get<any>(this.baseUrl + 'SalesOrder/JCLists/' + jobcardNo , httpOptions);
  }
  
  getFPOPendingJobs() {
    return this.http.get<any[]>(this.baseUrl + 'SalesOrder/FPO/JobList' , httpOptions);
  }

  getFPONoList(cusRef: string) {
    return this.http.get<any>(this.baseUrl + 'SalesOrder/FPOList/' + cusRef , httpOptions);
  }

  getFPOPendingJobDt(jobId: number) {
    return this.http.get<any[]>(this.baseUrl + 'SalesOrder/FPO/JobList/' + jobId , httpOptions);
  }

  saveFPO(fpoList: any[]) {
    return this.http.post(this.baseUrl + 'SalesOrder/SaveFPO' , fpoList , httpOptions);
  }

  getFPODetails(fpoNo: string) {
    return this.http.get<any[]>(this.baseUrl + 'SalesOrder/FPODetails/' + fpoNo , httpOptions);
  }

  deleteFPO(fpodt: any) {
    return this.http.post(this.baseUrl + 'SalesOrder/DeleteFPO' , fpodt , httpOptions);
  }

  getFPPOInDetails(fPPODId: number) {
    return this.http.get<FPPOProdDetails>(this.baseUrl + 'SalesOrder/FPPOIn/' + fPPODId ,httpOptions );
  }

  saveFPPOInDetails(fppoIn: TransProdDetails) {
    return this.http.post(this.baseUrl + 'SalesOrder/SaveFPPOIn' , fppoIn , httpOptions);
  }

  getTransProductionTot() {
    return this.http.get<any[]>(this.baseUrl + 'SalesOrder/FPPOTot/' ,httpOptions );
  }

  getFPPOOutDetails(fPPODId: number) {
    return this.http.get<FPPOProdDetails>(this.baseUrl + 'SalesOrder/FPPOOut/' + fPPODId ,httpOptions );
  }

  saveFPPOOutDetails(fppoOut: TransProdDetails){
    return this.http.post(this.baseUrl + 'SalesOrder/SaveFPPOOut' , fppoOut , httpOptions);
  }

  saveFPPORejectDetails(transDamg: any[]){
    return this.http.post(this.baseUrl + 'SalesOrder/SaveFPPORej' , transDamg , httpOptions);
  }   

  saveCosting(costDt: any) {
    return this.http.post(this.baseUrl + 'SalesOrder/SaveCost' , costDt , httpOptions );
  }

  getCostHeaderList(custId: number) {
    return this.http.get<any>(this.baseUrl + 'SalesOrder/CostList/' + custId , httpOptions);  
  } 
  
  getCostHeaderByRef(refNo: string){
    return this.http.get<any>(this.baseUrl+ 'SalesOrder/CostRefList/'+ refNo , httpOptions);
  }

  getCostSheetDetails(costHeader: any) {
    return this.http.post<any>(this.baseUrl + 'SalesOrder/CSDt/' , costHeader , httpOptions );
  }

  getCostSheetHeader(costHeader: any) {
    return this.http.post<any>(this.baseUrl + 'SalesOrder/CostHd' , costHeader , httpOptions );
  }

  attachCostSheet(soItem: any) {
    return this.http.post(this.baseUrl + 'SalesOrder/AttachCS' , soItem , httpOptions );
  }

  removeCostSheet(soItem: any) {
    return this.http.post(this.baseUrl + 'SalesOrder/RemoveCS' , soItem , httpOptions );
  }

  getApproveRouteDetails(appRouteDt: any) {
    return this.http.post<any[]>(this.baseUrl + 'SalesOrder/AppRouteDt' , appRouteDt , httpOptions );
  }

  saveApproveCenterDt(approveCenter: ApproveCenter) {
    return this.http.post(this.baseUrl + 'SalesOrder/SaveApprove' , approveCenter , httpOptions );
  }

  getApproveCenterDt(userId: any) {
    return this.http.get<ApproveCenter[]>(this.baseUrl + 'SalesOrder/ACDt/' + userId , httpOptions );
  } 

  uploadFile(obj: any) {
    var files = obj["file"];
    let fileToUpload = <File>files[0];

    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    formData.append('soHeaderId', obj["soHeaderId"]);
    formData.append('userId', obj["userId"]);
    formData.append('autoId', obj["autoId"]);

    // console.log(formData);    
    return this.http.post(this.baseUrl + 'SalesOrder/UploadFile', formData , httpOptions);      
  }

  downloadFile(id: number) {
    return this.http.get<any>(this.baseUrl + 'SalesOrder/DownloadFile/' + id , httpOptions);      
  }

  async getOrderPDF(id):Promise<Blob>{
    const url = `${this.baseUrl}SalesOrder/DownloadFile/${id}`;
    const key: string = 'Bearer ' + usertoken;
    // console.log('key:', key);
  
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', [key]);
      
    return this.http.get(url, {responseType: 'blob', headers: headers}).toPromise();
  }

  // getMINPendFPODetails() {
  //   return this.http.get<any>(this.baseUrl + 'SalesOrder/PendFPO' , httpOptions );
  // }

  getMINDetails(MINHeaderId: number) {
    return this.http.get<any>(this.baseUrl + 'SalesOrder/MINDt/' + MINHeaderId , httpOptions );
  }

  getCartonType(){
    return this.http.get<any []> (this.baseUrl + 'Master/GetCartType', httpOptions);
  }

  getCostLogList(costingId: number) {
    return this.http.get<any>(this.baseUrl + 'SalesOrder/CLogList/' + costingId , httpOptions);  
  }

  cancelSalesOrderDetails(salesorder: any){
    return this.http.post(this.baseUrl + 'SalesOrder/CancelSO' , salesorder , httpOptions);
  }

  getCostAttachedSalesOrderList(costingId: number) {
    return this.http.get<any>(this.baseUrl + 'SalesOrder/CostAttachSOList/' + costingId , httpOptions);  
  }

  getSalesOrderStatusList(cusPoRef: string) {
    const endcodedValue = encodeURIComponent(cusPoRef);
    return this.http.get<any>(this.baseUrl + 'SalesOrder/SOStatusList/' + endcodedValue, httpOptions);  
  }

  updateSalesOrderPrice(model: any) {
    return this.http.post(this.baseUrl + 'SalesOrder/UpSOPr' , model , httpOptions);
  }

  SaveSalesDefault(model: any) {
    return this.http.post(this.baseUrl + 'SalesOrder/SalesDef' , model , httpOptions);
  }

  getSalesOrderDefault(id: number) {
    return this.http.get<any>(this.baseUrl + 'SalesOrder/SOHDefault/' + id,httpOptions);
  }

  getSalesDefault(id: number) {
    return this.http.get<any>(this.baseUrl + 'SalesOrder/SOD/' + id,httpOptions);
  }

  getExchangeRateList(requestdate : string) {
    return this.http.get<any>(this.baseUrl + 'SalesOrder/ExRateByDt/' +requestdate  , httpOptions);  
  }

  getSalesOrderDtList(customerPo: string) {
    return this.http.get<any>(this.baseUrl + 'SalesOrder/SODtList/' + customerPo , httpOptions );
  }

  getDashboardOneDetails(model: any) {
    return this.http.post(this.baseUrl + 'SalesOrder/DashOneD' , model , httpOptions);
  }

  getPoQtyChecked(soHeaderId : number){
    return this.http.get<any>(this.baseUrl + 'SalesOrder/GetCheckQty/' + soHeaderId , httpOptions );
  }

  getPendTransferDeliveries(prod: any){
    return this.http.post<any[]>(this.baseUrl + 'SalesOrder/PendTransfers' , prod , httpOptions);
  }

  getPendTransferPO(refNo: string){
    return this.http.get<any>(this.baseUrl + 'SalesOrder/UnFinishPOs/'+ refNo, httpOptions);
  }

  getTransferAlterDelivery(fppodid: number){
    return this.http.get<any>(this.baseUrl + 'SalesOrder/FairableAlterDel/' + fppodid , httpOptions);
  }

  saveTranfer(transferDt: any) {
    return this.http.post(this.baseUrl + 'SalesOrder/SaveTransfer' , transferDt , httpOptions);
  }

  getTransferList(customerId: number) {
    return this.http.get<any>(this.baseUrl + 'SalesOrder/GetTranferList/' + customerId , httpOptions);
  }

  getTranferDetails(tranferHdId: Number) {
    return this.http.get<any>(this.baseUrl + 'SalesOrder/TranferDetails/' + tranferHdId, httpOptions);
  }
  
  getStoreSite(soDelvId: Number){
    return this.http.get<any>(this.baseUrl + 'SalesOrder/Store/' + soDelvId, httpOptions);
  }
  //#region BlockBooking
    SaveBlockBookingData(wsDt: any) {
        console.log(wsDt);
        return this.http.post(this.baseUrl + 'SalesOrder/SaveBlockBookingData' , wsDt , httpOptions );
      }
      GetBlockBookingData(wsDt: any) {
          console.log(wsDt);
          return this.http.post<BlockBooking[]>(this.baseUrl + 'SalesOrder/GetBlockBookingData', wsDt , httpOptions ); 
      }
  //#endregion BlockBooking
  //#region OrderCreation
GetOCData(wsDt: any) {
  return this.http.post<Ordercreation[]>(this.baseUrl + 'SalesOrder/GetOCData' , wsDt , httpOptions );
}

SaveOCData(wsDt: any) {
  return this.http.post(this.baseUrl + 'SalesOrder/SaveOCData' , wsDt , httpOptions );
}

//#endregion OrderCreation

   //#region Recipe
   GetRecipeData(wsDt: any) {
    return this.http.post<Recipe[]>(this.baseUrl + 'SalesOrder/GetRecipeData', wsDt, httpOptions);
  }

  SaveRecipeData(wsDt: any) {
    return this.http.post(this.baseUrl + 'SalesOrder/SaveRecipeData', wsDt, httpOptions);
  }
  //#endregion Recipe
 //#region Washing Costing
 GetCostingData(wsDt: any) {
  return this.http.post<Costsheet[]>(this.baseUrl + 'SalesOrder/GetCostingData', wsDt, httpOptions);
}

SaveCostingData(wsDt: any) {
  return this.http.post(this.baseUrl + 'SalesOrder/SaveCostingData', wsDt, httpOptions);
}
//#endregion Washing Costing

}
