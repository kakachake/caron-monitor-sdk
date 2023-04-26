import { SyncHook } from "src/tapable";
import MonitorPlugin from "./plugins/plugin";

export interface Options<T extends typeof MonitorPlugin = any> {
  // 项目名称
  projectName: string;
  appid: string;
  url: string;
  senderType: "img" | "xhr";
  host: string;
  logstoreName: string;
  wrapperElements?: string[];
  maxEmptyCount?: number;
  plugins?: T[];
}

export interface BaseLog {
  // 日志大类
  kind:
    | "stability"
    | "performance"
    | "behavior"
    | "error"
    | "custom"
    | "experience"
    | "business";

  // 日志类型
  type:
    | "error"
    | "xhrError"
    | "blankScreen"
    | "performance"
    | "firstInputDelay"
    | "longTask"
    | "pv"
    | "stayTime";
}

export interface ShareLog {
  // 错误发生的时间
  timestamp: string;
  // url
  url: string;
  // 页面标题
  title: string;
  // 用户代理
  userAgent: string;
}

export interface ErrorLog extends BaseLog {
  errorType: "jsError" | "promiseError" | "resourceError";
  // 错误信息
  message?: string;
  // 错误发生的文件
  filename: string;
  // 错误发生的行列
  position: string;
  // 错误堆栈
  stack: {
    // 错误发生的函数
    func?: string;
    // 错误发生的文件
    filename?: string;
    // 错误发生的行列
    line?: string;
    column?: string;
  }[];
  // 错误发生的时间
  timestamp: string;

  // 错误发生的选择器
  selector?: string;
}

export interface ResourceLog extends BaseLog {
  errorType: "resourceError";
  tagName: string;
}

export interface XHRLog extends BaseLog {
  type: "xhrError";
  errorType: "load" | "timeout" | "error" | "abort";
  tagName?: string;
  method: string;
  url: string;
  async: boolean;
  status: number;
  statusText: string;
  duration: number;
  startTime: number;
}

export interface BlankLog extends BaseLog {
  type: "blankScreen";
  emptyCount: number;
  screen: string;
  viewPoint: string;
}

export interface LongTaskLog extends BaseLog {
  kind: "experience";
  type: "longTask";
  eventType: string;
  startTime: number;
  duration: number;
  selector: string;
}

export interface PVLog extends BaseLog {
  kind: "business";
  type: "pv";
  effectiveType?: EffectiveConnectionType;
  rtt?: Millisecond;
  screen: string;
}

export interface StayTimeLog extends BaseLog {
  kind: "business";
  type: "stayTime";
  stayTime: number;
}

export interface PerformanceLog extends BaseLog {
  kind: "experience";
  type: "performance";
  loadTime: number;
  dnsTime: number;
  tcpTime: number;
  requestTime: number;
  transferTime: number;
  parseDomTime: number;
  resourceTime: number;
  firstInteractionTime: number;
  ttfbTime: number;
  FP: number;
  FCP: number;
  FMP: number;
  LCP: number;
}

export interface FIPLog extends BaseLog {
  type: "firstInputDelay";
  inputDelay: number;
  inputType: string;
  duration: number;
}

export type Log = (ErrorLog | BaseLog | ResourceLog | XHRLog | BlankLog) &
  ShareLog;

export type ExcludeShareLog =
  | Omit<ErrorLog, keyof ShareLog>
  | Omit<ResourceLog, keyof ShareLog>
  | Omit<XHRLog, keyof ShareLog>
  | Omit<BlankLog, keyof ShareLog>
  | Omit<PerformanceLog, keyof ShareLog>
  | Omit<FIPLog, keyof ShareLog>
  | Omit<LongTaskLog, keyof ShareLog>
  | Omit<PVLog, keyof ShareLog>
  | Omit<StayTimeLog, keyof ShareLog>;

export interface Hooks {
  beforeLog: SyncHook;
}

export interface SenderOptions {
  projectName: string;
  appid: string;
  host: string;
  logstoreName: string;
}

type Megabit = number;
type Millisecond = number;
type EffectiveConnectionType = "2g" | "3g" | "4g" | "slow-2g" | "unknown";
type ConnectionType =
  | "bluetooth"
  | "cellular"
  | "ethernet"
  | "mixed"
  | "none"
  | "other"
  | "unknown"
  | "wifi"
  | "wimax";
export interface NetworkInformation extends EventTarget {
  readonly type?: ConnectionType;
  readonly effectiveType?: EffectiveConnectionType;
  readonly downlinkMax?: Megabit;
  readonly downlink?: Megabit;
  readonly rtt?: Millisecond;
  readonly saveData?: boolean;
  onchange?: EventListener;
}
