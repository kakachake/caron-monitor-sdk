import WebMonitor from "src/core";
import MonitorPlugin from "../../plugin";
import { getErrorLines } from "src/utils";
import { lastEvent, lastEventSelectors } from "src/utils/getLastEvent";
import getSelector, { analyzeSelector } from "src/utils/getSelector";
import { ErrorLog } from "src/type";

class InjectJsErrorPlugin extends MonitorPlugin {
  apply(monitor: WebMonitor) {
    // 监听全局未捕获的错误
    window.addEventListener(
      "error",
      function (event: any) {
        console.log("compose", lastEvent, lastEvent?.composedPath());
        console.log(lastEvent);
        if (event.target && (event.target.src || event.target.href)) {
          monitor.collectLog({
            kind: "stability",
            type: "error",
            errorType: "resourceError",
            filename: event.target.src || event.target.href,
            tagName: event.target.tagName.toLowerCase(),
            selector: getSelector(event.target) || lastEventSelectors,
          });
          analyzeSelector(getSelector(event.target));
        } else {
          monitor.collectLog({
            kind: "stability",
            type: "error",
            errorType: "jsError",
            message: event.message,
            filename: event.filename,
            position: `${event.lineno}:${event.colno}`,
            stack: getErrorLines(event.error?.stack || ""),
            selector: lastEvent
              ? getSelector(lastEvent.composedPath())
              : getSelector(event.composedPath()),
          });
        }
      },
      // 由于资源加载没有冒泡事件，所以需要捕获阶段
      true
    );

    // 监听异步错误
    window.addEventListener(
      "unhandledrejection",
      function (event) {
        console.log("compose", lastEvent, lastEvent?.composedPath());
        console.log(event);
        const log: Partial<ErrorLog> = {};
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
          selector: lastEventSelectors || "",
        });
        analyzeSelector(lastEvent ? getSelector(lastEvent.composedPath()) : "");
      },
      true
    );
  }

  unload() {
    //
  }
}
export default InjectJsErrorPlugin;
