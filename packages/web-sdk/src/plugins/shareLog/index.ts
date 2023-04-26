import WebMonitor from "src/core";
import MonitorPlugin from "../plugin";
import { Log } from "src/type";

class ShareLogPlugin extends MonitorPlugin {
  apply(monitor: WebMonitor) {
    //
    console.log("user");

    monitor.hooks.beforeLog.tap("User", (log: Log) => {
      console.log("log：", log);
      log.url = window.location.href;
      log.userAgent = navigator.userAgent;
      log.title = document.title;
      log.timestamp = new Date().getTime().toString();
    });
  }
  unload() {
    //
  }
}

export default ShareLogPlugin;
