import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IgxColumnComponent, IgxGridComponent } from 'igniteui-angular';
import { Observable, Subscription } from 'rxjs';
import { IndentDtDto } from 'src/app/_models/IndentDtDto';
import { User } from 'src/app/_models/user';
import { IndentdetailsService } from '_services/indentdetails.service';

@Component({
  selector: 'app-indent-details',
  templateUrl: './indent-details.component.html',
  styleUrls: ['./indent-details.component.css'],
})
export class IndentDetailsComponent implements OnInit {
  indentDtList: IndentDtDto[];
  user: User;
  locationList: any;
  indentNo: string = '';
  indentStatus: string;
  indentDate: string;
  assignTo: string;
  article: string;
  company: string;
  division: string;
  title: string;
  indentHeaderId: number = 0;

  public col: IgxColumnComponent;
  public pWidth: string;
  public nWidth: string;

  @Input() events: Observable<any>;
  private eventsSubscription: Subscription;

  @ViewChild('indentDtGrid', { static: true })
  public indentDtGrid: IgxGridComponent;

  constructor(private indentServices: IndentdetailsService) {}

  ngOnInit(): void {
    this.loadIndentDetails();
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

  onResize(event) {
    this.col = event.column;
    this.pWidth = event.prevWidth;
    this.nWidth = event.newWidth;
  }

  loadIndentDetails() {
    this.eventsSubscription = this.events.subscribe((result) => {
      this.indentHeaderId = result[0]['indentHeaderId'];
      this.indentNo = result[0]['indentNo'];
      this.indentStatus = result[0]['statusName'];
      this.indentDate = result[0]['createdDate'];
      this.assignTo = result[0]['assignTo'];
      this.company = result[0]['memberCompany'];
      this.division = result[0]['division'];

      this.indentServices
        .getIntentDetails(this.indentHeaderId)
        .subscribe((result) => {
          // console.log(result);
          if (result.length > 0) {
            this.article =
              result[0]['articleName'] + '-(' + result[0]['stockCode'] + ')';
            result.forEach((item) => {
              item['openQty'] = item['openQty'] - item['orderQty'];
              item['indentQty'] = item['openQty'];
            });
            this.indentDtList = result;
          }
        });
    });
  }

  onAddPurchOrder() {
    var obj = {
      indentHeaderId: this.indentHeaderId.toString(),
    };
    // console.log(obj);
    this.indentServices.getIntentDetailsbyIds(obj).subscribe((result) => {
      window.open('/PurchasingOrder', '_blank');
    });
  }
}
