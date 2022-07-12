import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { MsgList } from '../module/message/components/msgtable/MsgList';

@Injectable({
  providedIn: 'root'
})

export class SignalrService {
  public data: Array<MsgList> = new Array<MsgList>();
  // public data: MsgList[];
  public dtOptions: DataTables.Settings = {};

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
          count++;
          this.data.push(msg);
        })
        // this.data = data;
        console.log(this.data);
      });
    }

}
