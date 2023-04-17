import { Log } from "src/type";
import Sender from "./sender";

export default class DefalutSender extends Sender {
  send(log: Log) {
    console.log("send", log);
  }
}
