import MonitorPlugin from "src/plugins/plugin";
import { Hooks, Log, Options } from "src/type";
import { defalutPlugins } from "src/plugins/";
import { SyncHook } from "src/tapable";
import DefalutSender from "src/sender/defaultSender";
import Sender from "src/sender/sender";
import ImgSender from "src/sender/imgSender";

const defalutOptions: Partial<Options> = {
  senderType: "xhr",
};

class WebMonitor {
  options: Options;
  plugins: MonitorPlugin[] = [];
  hooks: Hooks;
  sendInstance?: Sender;

  constructor(options: Options) {
    this.options = { ...defalutOptions, ...options };
    this.hooks = {
      beforeLog: new SyncHook(),
    };
    this.initSender();
    this.initPlugins();
  }

  initSender() {
    if (this.options.senderType === "xhr") {
      this.sendInstance = new DefalutSender(this.options);
      return;
    } else if (this.options.senderType === "img") {
      this.sendInstance = new ImgSender(this.options);
    }
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
    this.parseLog(log);
    this.sendInstance?.send(log);
  }

  parseLog(log: Log) {
    Object.keys(log).forEach((key) => {
      if (typeof log[key as keyof Log] === "object") {
        (log as any)[key] = JSON.stringify(log[key as keyof Log]);
      }
    });
  }
}

export default WebMonitor;
