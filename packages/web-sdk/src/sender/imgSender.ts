import { Log, SenderOptions } from "src/type";
import Sender from "./sender";

export default class ImgSender extends Sender {
  xhr = new XMLHttpRequest();
  constructor(options: SenderOptions) {
    super(options);
  }

  send(log: Log) {
    const params = Object.entries(log)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
    const img = new Image();
    img.src = `${this.options.host}/logstores/${this.options.logstoreName}/track_ua.gif?APIVersion=0.6.0&${params}`;
  }
}
