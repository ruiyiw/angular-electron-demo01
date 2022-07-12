import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { MsgList } from '../module/message/components/msgtable/MsgList';
import { elementAt, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SignalrService {
  public data: Array<MsgList> = new Array<MsgList>();
  public invisibleMsgs: Set<string> = new Set<string>(); // newly added
  public dtTrigger: Subject<any> = new Subject<any>();

  private hubConnection: signalR.HubConnection
    public startConnection = () => {
      this.hubConnection = new signalR.HubConnectionBuilder()
                              .withUrl("https://localhost:7194/myHub")
                              .build();
      this.hubConnection
        .start()
        .then(() => console.log("Connection started!"))
        .catch(err => console.log("Error while starting connection: " + err));
    }

    public addTransferTableDataListener = () => {
      let count = 0;
      this.hubConnection.on("transfertabledata", (data) => {
        this.data = new Array<MsgList>();
        data.forEach(element => {
          const msg = new MsgList(count, element.name, element.sensorNo, element.time, element.objectType, element.address);
          const key = `${element.sensorNo}_${element.address}`;
          if (this.invisibleMsgs.has(key)) {
            msg.visibility = false;
          }
          count++;
          this.data.push(msg);
        })
        // this.data = data
        console.log(this.data);
        // Calling the DT trigger to manually render the table
        this.dtTrigger.next(null);
      });
    }

}
