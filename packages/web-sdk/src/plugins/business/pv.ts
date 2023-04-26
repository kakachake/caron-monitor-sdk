import WebMonitor from "src/core";
import MonitorPlugin from "../plugin";

export default class PVPlugin extends MonitorPlugin {
  apply(monitor: WebMonitor) {
    const startTime = Date.now();
    const connection = navigator.connection;
    monitor.collectLog({
      kind: "business",
      type: "pv",
      effectiveType: connection.effectiveType,
      rtt: connection.rtt,
      screen: `${window.screen.width}x${window.screen.height}`,
    });

    window.addEventListener("unload", () => {
      monitor.collectLog(
        {
          kind: "business",
          type: "stayTime",
          stayTime: Date.now() - startTime,
        }
        // {
        //   senderType: "beacon",
        // }
      );
    });
  }
}
