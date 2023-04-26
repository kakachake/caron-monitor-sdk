import WebMonitor from "src/core";
import { Options } from "src/type";

abstract class MonitorPlugin {
  options: Options;
  monitor: WebMonitor;
  constructor(options: Options, monitor: WebMonitor) {
    this.options = options;
    this.monitor = monitor;
  }

  abstract apply(monitor: WebMonitor): any;

  onload(monitor: WebMonitor): any {
    //
  }

  unload() {
    //
  }
}

export default MonitorPlugin;
