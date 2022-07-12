import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { elementAt, Subject } from 'rxjs';
import { ErrorMessage, MsgList, Status } from './MsgList';
import { SignalrService } from '../../../../services/signalr.service';

@Component({
  selector: 'app-msgtable',
  templateUrl: './msgtable.component.html',
  styleUrls: ['./msgtable.component.scss']
})

export class MsgtableComponent implements OnInit, OnDestroy {

  dtOptions: DataTables.Settings = {};
  msglists: Array<MsgList> = new Array<MsgList>();
  status: Status = Status.defined;
  selectedItem: number = null;

  dtTrigger: Subject<any> = new Subject<any>();

  // constructor(private httpClient: HttpClient) { }
  constructor(private httpClient: HttpClient, public signalRService: SignalrService) { }

  private startHttpRequest = () => {
    let cnt = 0;
    this.httpClient.get<any>("https://localhost:7194/api/Panel")
      .subscribe(
        res => {
          console.log(res);
        }
      );
  }

  ngOnInit(): void {

    // this.msglists = [];

    this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 2,
      };

    this.getErrorMessages();
  }

  getErrorMessages(){
    // let cnt = 0;
    // this.httpClient.get<any>('https://localhost:7194/api/Panel').subscribe(
    //   (response: Array<ErrorMessage>) => {
    //     response.forEach(element => {
    //       const msg: MsgList = new MsgList(cnt, element.name, element.sensorNo, element.time, element.objectType, element.address);
    //       cnt++;
    //       this.msglists.push(msg);
    //     });
    //     console.log(this.msglists);
    //     // Calling the DT trigger to manually render the table
    //     this.dtTrigger.next(null);
    //   }
    // );
    
    // Start SignalR connection
    this.signalRService.startConnection();
    this.signalRService.addTransferTableDataListener();
    this.startHttpRequest();
  }

  seeDefinedMsgs() {
    this.status = Status.defined;
    console.log('Set status to defined');
  }

  seeCurrentMsgs() {
    this.status = Status.current;
    console.log('Set status to current');
  }

  seeBlockedMsgs() {
    this.status = Status.blocked;
    console.log('Set status to blocked');
  }

  setHighlight(id: number) {
    this.selectedItem = id;
  }

  reverseVisibility() {
    if (this.selectedItem == null) { return; }
    console.log(`Change visibility of ${this.selectedItem}`);
    this.msglists[this.selectedItem].reverseVisibility();
    this.selectedItem = null;
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

}

