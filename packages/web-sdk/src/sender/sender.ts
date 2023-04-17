import { Log, SenderOptions } from "src/type";

export default abstract class Sender {
  options: SenderOptions;
  constructor(options: SenderOptions) {
    this.options = options;
  }

  abstract send(log: Log): any;
}
