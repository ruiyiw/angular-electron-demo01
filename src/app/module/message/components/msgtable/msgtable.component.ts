import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Subject } from 'rxjs';
import { MsgList } from './MsgList';

@Component({
  selector: 'app-msgtable',
  templateUrl: './msgtable.component.html',
  styleUrls: ['./msgtable.component.scss']
})

export class MsgtableComponent implements OnInit, OnDestroy {

  dtOptions: DataTables.Settings = {};
  msglists : MsgList[] = [];

  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {

    this.msglists = [];

    this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 2,
      };

    // TODO: huixinz
    
    this.httpClient.get<MsgList[]>('assets/data.json')
      .subscribe(data => {
        this.msglists = (data as any).data;
        // Calling the DT trigger to manually render the table
        this.dtTrigger.next(null);
      });
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

}
