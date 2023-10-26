import { Component, OnInit,Input, ChangeDetectorRef } from '@angular/core';
import { SpinnerService } from '_services/spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {

  @Input() message = '';

  showspinner = false;

  constructor(private spinerService: SpinnerService,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.init();
  }

  init() {
    this.spinerService.getSpinnerOberver().subscribe((status) => {
      this.showspinner = status === 'start';
      this.cdRef.detectChanges();
    });
  }

}
