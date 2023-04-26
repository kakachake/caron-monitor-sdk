import { Log, SenderOptions } from "src/type";

export default abstract class Sender {
  options: SenderOptions;
  url: string;
  constructor(options: SenderOptions) {
    this.options = {
      ...options,
    };
    this.url = `${this.options.host}/logstores/${this.options.logstoreName}/track`;
  }

  abstract send(log: Log): any;
}
