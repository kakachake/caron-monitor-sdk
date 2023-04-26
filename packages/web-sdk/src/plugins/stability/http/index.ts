import MonitorPlugin from "../../plugin";
import { XHRLog } from "src/type";

type XMLExtendRequest = XMLHttpRequest & {
  logData: {
    method: string;
    url: string;
    async: boolean;
    body: any;
    startTime: number;
    duration: number;
  };
};

class XhrErrorPlugin extends MonitorPlugin {
  apply() {
    this.injectXHR();
  }

  injectXHR(this: XhrErrorPlugin) {
    const XMLHttpRequest = window.XMLHttpRequest;
    const oldOpen = XMLHttpRequest.prototype.open;
    const self = this;
    // 重写open方法
    XMLHttpRequest.prototype.open = function (
      this: XMLExtendRequest,
      method: string,
      url: string,
      async: boolean
    ) {
      this.logData = {
        method,
        url,
        async,
      } as XMLExtendRequest["logData"];
      return oldOpen.apply(this, [method, url, async]);
    } as XMLHttpRequest["open"];
    const oldSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.send = function (
      this: XMLExtendRequest,
      body: any
    ) {
      this.logData.body = body;
      this.logData.startTime = new Date().getTime();
      if (!this.logData.url.match(self.options.host)) {
        this.addEventListener("load", self.handler("load"), false);
        this.addEventListener("error", self.handler("error"), false);
        this.addEventListener("abort", self.handler("abort"), false);
      }

      return oldSend.apply(this, [body]);
    };
  }

  handler<K extends keyof XMLHttpRequestEventMap>(type: K) {
    const self = this;
    return function (this: XMLHttpRequest, event: XMLHttpRequestEventMap[K]) {
      const duration =
        new Date().getTime() -
        ((this as XMLExtendRequest).logData.startTime || 0);
      const status = this.status; // 200 404 500
      const statusText = this.statusText; // OK Not Found Internal Server Error

      self.monitor.collectLog({
        kind: "stability",
        type: "xhrError",
        errorType: type as XHRLog["errorType"],
        ...(this as XMLExtendRequest).logData,
        duration,
        status,
        statusText,
      });
    };
  }

  unload() {
    //
  }
}
export default XhrErrorPlugin;
