import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { elementAt, Subject } from 'rxjs';
import { ErrorMessage, MsgList, Status } from './MsgList';

@Component({
  selector: 'app-msgtable',
  templateUrl: './msgtable.component.html',
  styleUrls: ['./msgtable.component.scss']
})

export class MsgtableComponent implements OnInit, OnDestroy {

  dtOptions: DataTables.Settings = {};
  msglists: Array<MsgList> = new Array<MsgList>();
  status: Status = Status.current;

  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {

    // this.msglists = [];

    this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 2,
      };

    this.getErrorMessages();
  }

  getErrorMessages(){
    this.httpClient.get<any>('https://localhost:7194/api/Panel').subscribe(
      (response: Array<ErrorMessage>) => {
        response.forEach(element => {
          const msg: MsgList = new MsgList(element.name, element.sensorNo, element.time, element.objectType, element.address);
          this.msglists.push(msg);
        });
        console.log(this.msglists);
        // Calling the DT trigger to manually render the table
        this.dtTrigger.next(null);
      }
    );
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

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

}

