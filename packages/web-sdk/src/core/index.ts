import MonitorPlugin from "src/plugins/plugin";
import { Hooks, Log, Options } from "src/type";
import { defalutPlugins } from "src/plugins/";
import { SyncHook } from "src/tapable";
import DefalutSender from "src/sender/defaultSender";
import Sender from "src/sender/sender";

class WebMonitor {
  options: Options;
  plugins: MonitorPlugin[] = [];
  hooks: Hooks;
  sendInstance?: Sender;

  constructor(options: Options) {
    this.options = options;
    this.hooks = {
      beforeLog: new SyncHook(),
    };
    this.initSender();
    this.initPlugins();
  }

  initSender() {
    this.sendInstance = new DefalutSender(this.options);
  }

  initPlugins() {
    const options = this.options;
    console.log(defalutPlugins);

    this.use(
      ...defalutPlugins.map((Plugin) => {
        return new Plugin(options);
      })
    );
  }

  use(...plugins: MonitorPlugin[]) {
    this.plugins.push(...plugins);
  }

  start() {
    this.plugins.forEach((plugin) => plugin.apply(this));
  }

  collectLog(log: Log) {
    this.hooks.beforeLog.call(log);
    this.sendInstance?.send(log);
  }
}

export default WebMonitor;
