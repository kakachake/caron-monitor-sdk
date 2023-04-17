import WebMonitor from "src/core";
import MonitorPlugin from "../plugin";
import { getErrorLines } from "src/utils";
import { lastEvent } from "src/utils/getLastEvent";
import getSelector, { analyzeSelector } from "src/utils/getSelector";

class InjectJsErrorPlugin extends MonitorPlugin {
  apply(monitor: WebMonitor) {
    console.log("InjectJsErrorPlugin", monitor);
    // 监听全局未捕获的错误
    window.addEventListener("error", function (event: ErrorEvent) {
      console.log("err", event.error);
      monitor.collectLog({
        kind: "stability",
        type: "error",
        errorType: "jsError",
        message: event.message,
        filename: event.filename,
        position: `${event.lineno}:${event.colno}`,
        stack: getErrorLines(event.error?.stack || ""),
        timestamp: event.timeStamp,
        url: window.location.href,
        userAgent: navigator.userAgent,
        title: document.title,
        selector: lastEvent ? getSelector(lastEvent.composedPath()) : "",
      });
      analyzeSelector(lastEvent ? getSelector(lastEvent.composedPath()) : "");
    });
    return () => 8;
  }

  unload() {
    //
  }
}
export default InjectJsErrorPlugin;
