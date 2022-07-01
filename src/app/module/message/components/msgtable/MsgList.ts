export class MsgList {
  visibility: boolean;
  name: string;
  sensorNo: string;
  time: string;
  objectType: string;
  address: number;
  constructor(name: string, sensorNo: string, time: string, objectType: string, address: number) {
    this.visibility = true;
    this.name = name;
    this.sensorNo = sensorNo;
    this.time = time;
    this.objectType = objectType;
    this.address = address;
  }
}

export interface ErrorMessage{
  name: string;
  sensorNo: string;
  time: string;
  objectType: string;
  address: number;
}

export enum Status{
  defined = 1,
  current,
  blocked,
}
