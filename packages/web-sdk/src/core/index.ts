import MonitorPlugin from "src/plugins/plugin";
import { ExcludeShareLog, Hooks, Log, Options } from "src/type";
import { defalutPlugins } from "src/plugins/";
import { SyncHook } from "src/tapable";
import Sender from "src/sender/sender";
import onload from "src/utils/onload";
import getSender from "src/sender";

const defalutOptions: Partial<Options> = {
  senderType: "xhr",
  maxEmptyCount: 14,
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
    this.sendInstance = getSender(this.options.senderType, this.options);
  }

  initPlugins() {
    const options = this.options;
    const { plugins = [] } = options;

    this.use(
      ...defalutPlugins.map((Plugin) => {
        return new Plugin(options, this);
      }),

      ...plugins.map((Plugin) => {
        return new Plugin(options, this);
      })
    );
  }

  use(...plugins: MonitorPlugin[]) {
    this.plugins.push(...plugins);
  }

  start() {
    this.plugins.forEach((plugin) => plugin.apply(this));
    this.onLoad();
  }

  onLoad() {
    onload(() => {
      this.plugins.forEach((plugin) => plugin.onload(this));
    });
  }

  collectLog(
    log: ExcludeShareLog,
    options: {
      senderType?: "xhr" | "img" | "beacon";
    } = {}
  ) {
    const { senderType } = options;
    this.hooks.beforeLog.call(log);
    this.parseLog(log);

    if (!senderType) {
      this.sendInstance?.send(log as Log);
    } else {
      const instance = getSender(senderType, this.options);
      instance?.send(log as Log);
    }
  }

  parseLog(log: any) {
    Object.keys(log).forEach((key) => {
      switch (typeof log[key]) {
        case "object":
          log[key] = JSON.stringify(log[key as keyof Log]);
          break;
        case "number":
          log[key] = log[key as keyof Log].toString();
          break;
        case "boolean":
          log[key] = log[key as keyof Log].toString();
          break;
      }
    });
  }
}

export default WebMonitor;
