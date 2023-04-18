import { Log, SenderOptions } from "src/type";
const host = "http://caron-monitor.cn-beijing.log.aliyuncs.com";
const logstoreName = "caron_store";

export default abstract class Sender {
  options: SenderOptions & {
    host: string;
    logstoreName: string;
  };
  url = `${host}/logstores/${logstoreName}/track`;
  constructor(options: SenderOptions) {
    this.options = {
      ...options,
      host,
      logstoreName,
    };
  }

  abstract send(log: Log): any;
}
