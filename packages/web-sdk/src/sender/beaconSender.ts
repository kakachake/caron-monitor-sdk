import { Log } from "src/type";
import Sender from "./sender";

export default class BeaconSender extends Sender {
  send(log: Log) {
    navigator.sendBeacon(this.url, JSON.stringify(log));
  }
}
