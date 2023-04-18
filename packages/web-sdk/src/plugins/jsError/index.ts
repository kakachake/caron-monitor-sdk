import WebMonitor from "src/core";
import MonitorPlugin from "../plugin";
import { getErrorLines } from "src/utils";
import { lastEvent } from "src/utils/getLastEvent";
import getSelector, { analyzeSelector } from "src/utils/getSelector";
import { Log } from "src/type";

class InjectJsErrorPlugin extends MonitorPlugin {
  apply(monitor: WebMonitor) {
    // 监听全局未捕获的错误
    window.addEventListener("error", function (event: ErrorEvent) {
      monitor.collectLog({
        kind: "stability",
        type: "error",
        errorType: "jsError",
        message: event.message,
        filename: event.filename,
        position: `${event.lineno}:${event.colno}`,
        stack: getErrorLines(event.error?.stack || ""),
        timestamp: new Date().getTime().toString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        title: document.title,
        selector: lastEvent ? getSelector(lastEvent.composedPath()) : "",
      });
      analyzeSelector(lastEvent ? getSelector(lastEvent.composedPath()) : "");
    });

    // 监听异步错误
    window.addEventListener("unhandledrejection", function (event) {
      console.log(event);
      const log: Partial<Log> = {};
      if (event.reason?.stack) {
        const matchResult = event.reason.stack.match(/at\s+(.+):(\d+):(\d+)/);
        log.filename = matchResult?.[1];
        log.position = `${matchResult?.[2]}:${matchResult?.[3]}`;
      }
      monitor.collectLog({
        filename: log.filename || "",
        position: log.position || "",
        kind: "stability",
        type: "error",
        errorType: "promiseError",
        message: event.reason.message || event.reason,
        stack: getErrorLines(event.reason?.stack || ""),
        timestamp: new Date().getTime().toString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        title: document.title,
        selector: lastEvent ? getSelector(lastEvent.composedPath()) : "",
      });
      analyzeSelector(lastEvent ? getSelector(lastEvent.composedPath()) : "");
    });
  }

  unload() {
    //
  }
}
export default InjectJsErrorPlugin;
