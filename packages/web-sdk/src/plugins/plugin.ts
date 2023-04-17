import WebMonitor from "src/core";
import { Options } from "src/type";

abstract class MonitorPlugin {
  options: Options;
  constructor(options: Options) {
    this.options = options;
  }

  abstract apply(monitor: WebMonitor): any;

  unload() {
    //
  }
}

export default MonitorPlugin;
