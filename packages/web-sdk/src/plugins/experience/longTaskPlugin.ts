import WebMonitor from "src/core";
import MonitorPlugin from "../plugin";
import { lastEvent, lastEventSelectors } from "src/utils/getLastEvent";

export default class longTaskPlugin extends MonitorPlugin {
  apply(monitor: WebMonitor) {
    console.log("longTaskPlugin");

    new PerformanceObserver((entries) => {
      entries.getEntries().forEach((entry) => {
        if (entry.duration > 100) {
          requestIdleCallback(() => {
            monitor.collectLog({
              kind: "experience",
              type: "longTask",
              eventType: lastEvent?.type || "",
              startTime: entry.startTime,
              duration: entry.duration,
              selector: lastEventSelectors,
            });
          });
        }
      });
    }).observe({
      entryTypes: ["longtask"],
    });
  }
}
