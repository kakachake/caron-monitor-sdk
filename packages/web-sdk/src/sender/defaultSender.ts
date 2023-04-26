import { Log, SenderOptions } from "src/type";
import Sender from "./sender";

export default class DefalutSender extends Sender {
  xhr = new XMLHttpRequest();
  constructor(options: SenderOptions) {
    super(options);
  }

  send(log: Log) {
    this.xhr.open("post", this.url, true);

    const data = {
      __logs__: [log],
    };
    const body = JSON.stringify(data);
    this.xhr.setRequestHeader("Content-Type", "application/json");
    this.xhr.setRequestHeader("x-log-apiversion", "0.6.0");
    this.xhr.setRequestHeader("x-log-bodyrawsize", body.length.toString());
    this.xhr.onload = () => {
      // console.log(this.xhr.response);
    };
    // console.log(body);

    this.xhr.send(JSON.stringify(data));
  }
}
