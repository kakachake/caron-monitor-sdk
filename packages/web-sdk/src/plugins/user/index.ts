import WebMonitor from "src/core";
import MonitorPlugin from "../plugin";

class UserPlugin extends MonitorPlugin {
  apply(monitor: WebMonitor) {
    //
    console.log("user");

    monitor.hooks.beforeLog.tap("User", (log) => {
      console.log("log：", log);
      log.userId = "111";
    });
  }
  unload() {
    //
  }
}

export default UserPlugin;
