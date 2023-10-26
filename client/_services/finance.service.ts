import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Bank } from 'src/app/_models/bank';
import { ExchangeRate } from 'src/app/_models/exchangeRate';
import { Tax } from 'src/app/_models/tax';
import { environment } from 'src/environments/environment';
import { Paymentinvoice} from 'src/app/_models/paymentinvoice';

var usertoken: any;

if (localStorage.length > 0) {
  // usertoken = JSON.parse(localStorage.getItem('token'));
  usertoken = localStorage.getItem('token');
  //console.log(usertoken);
}

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: 'Bearer ' +  usertoken
  })
}

@Injectable({
  providedIn: 'root'
})

export class FinanceService {
  baseUrl = environment.apiUrl;

constructor(private http: HttpClient) { }

saveExchangeRate(exchRate: ExchangeRate) {
  return this.http.post(this.baseUrl + 'Finance/SaveExR' , exchRate , httpOptions);
}

getExchangeRate() {
  return this.http.get<any>(this.baseUrl + 'Finance/ExRate' , httpOptions);
}

getTax() {
  return this.http.get<any>(this.baseUrl + 'Finance/Rate' , httpOptions);
}

saveTax(tax: Tax) {
  return this.http.post(this.baseUrl + 'Finance/SaveTax' , tax , httpOptions);
}
getBank() {
  return this.http.get<any>(this.baseUrl + 'Finance/Bank', httpOptions);
}
getBanks(customerId: number) {
  return this.http.get<any>(this.baseUrl + 'Finance/Banks/' + customerId , httpOptions);
}
saveBank(bank: Bank) {
  return this.http.post(this.baseUrl + 'Finance/SaveBank' , bank , httpOptions);
}

getInvoicePendingDt(customerId: number) {
  return this.http.get<any>(this.baseUrl + 'Finance/PInvoice/' + customerId, httpOptions);
}

saveInvoice(invoiceDt: any) {
  return this.http.post(this.baseUrl + 'Finance/SaveInvoice' , invoiceDt , httpOptions);
}

getInvoiceDetails(invoiceNo: string) {
  return this.http.get<any>(this.baseUrl + 'Finance/GetInvDt/' + invoiceNo, httpOptions);
}

approveInvoice(invoiceHd: any) {
  return this.http.post(this.baseUrl + 'Finance/AppInvoice' , invoiceHd , httpOptions);
}

getInvoiceNoList(cusRef: string) {
  return this.http.get<any>(this.baseUrl + 'Finance/InvList/' + cusRef , httpOptions);
}

getInvoiceNoFilter(invoiceNo: string) {
  return this.http.get<any>(this.baseUrl + 'Finance/Invfilter/' + invoiceNo , httpOptions);
}

getReceiptPendInvoice(customerId: number) {
  return this.http.get<any>(this.baseUrl + 'Finance/RecePInv/' + customerId , httpOptions);
}

saveReceipt(receiptDt: any) {
  return this.http.post(this.baseUrl + 'Finance/SaveReceipt' , receiptDt , httpOptions);
}

autoAllocateReceipt(receiptDt: any) {
  return this.http.post(this.baseUrl + 'Finance/AutoAllocate' , receiptDt , httpOptions);
}

getReceiptNoList(receiptDt: any) {
  return this.http.post<any>(this.baseUrl + 'Finance/RecList', receiptDt ,httpOptions);
}

getReceiptDetails(receiptNo: string) {
  return this.http.get<any>(this.baseUrl + 'Finance/RecDt/' + receiptNo, httpOptions);
}

cancelReceipt(receiptDt: any) {
  return this.http.post(this.baseUrl + 'Finance/CanReceipt' , receiptDt , httpOptions);
}
cancelDebitNote(debitnote: any){
  return this.http.post<any>(this.baseUrl + 'Finance/cancelDebit' , debitnote, httpOptions);
}
cancelCreditNote(creditnote: any){
  return this.http.post<any>(this.baseUrl + 'Finance/cancelCredit' , creditnote , httpOptions);
}

cancelInvoiceDetails(invoice: any){
  return this.http.post(this.baseUrl + 'Finance/CancelInv' , invoice , httpOptions);
}

getReceiptAllocationPendingList(customerId: number) {
  return this.http.get<any>(this.baseUrl + 'Finance/RecAllPenList/' + customerId , httpOptions);
}

saveReceiptAllocation(receiptDt: any) {
  return this.http.post(this.baseUrl + 'Finance/SaveReceiptAll' , receiptDt , httpOptions);
}
getDispatchDetails(invoiceId: number) {
  return this.http.get<any>(this.baseUrl + 'Finance/CRDispatch/' + invoiceId , httpOptions);
}
saveCreditNote(creditNote: any) {
  return this.http.post(this.baseUrl + 'Finance/SaveCrNt' , creditNote , httpOptions);
}
getCreditnoteList(customerId: number) {
  return this.http.get<any>(this.baseUrl + 'Finance/CrNoteList/' + customerId , httpOptions);
}
getCreditNoteDetails(creditNoteNo: string) {
  return this.http.get<any>(this.baseUrl + 'Finance/CRNoteDt/' + creditNoteNo, httpOptions);
}
getCNAllocationPendingList(customerId: number) {
  return this.http.get<any>(this.baseUrl + 'Finance/CreditAllPenList/' + customerId , httpOptions);
}
saveCreditNoteAllocation(creditNoteDt:any){
  return this.http.post(this.baseUrl + 'Finance/SaveCreditNAll' , creditNoteDt , httpOptions);
}
saveDebitNote(debitNoteDt: any) {
  return this.http.post(this.baseUrl + 'Finance/SaveDebitNote' , debitNoteDt , httpOptions);
}
getDebitNoteNoList(customerId: number) {
  return this.http.get<any>(this.baseUrl + 'Finance/DebitList/' + customerId , httpOptions);
  }
  
getDebitNoteDetails(debitNoteHdId: Number) {
  return this.http.get<any>(this.baseUrl + 'Finance/DebitDetails/' + debitNoteHdId, httpOptions);
  }
  
//#region Transport
GetPaymentInvoiceData(wsDt: any) {
  return this.http.post<Paymentinvoice[]>(this.baseUrl + 'PMaster/GetPaymentInvoiceData' , wsDt , httpOptions );
}

SavePaymentInvoiceData(wsDt: any) {
  return this.http.post(this.baseUrl + 'PMaster/SavePaymentInvoiceData' , wsDt , httpOptions );
}

//#endregion Transport


}
