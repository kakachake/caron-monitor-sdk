import { SyncHook } from "src/tapable";

export interface Options {
  // 项目名称
  projectName: string;
  appid: string;
  url: string;
  senderType: "img" | "xhr";
}

export interface Log {
  // 日志大类
  kind: "stability" | "performance" | "behavior" | "error" | "custom";
  // 日志类型
  type: "error";
  // 详细错误类型
  errorType:
    | "jsError"
    | "resourceError"
    | "promiseError"
    | "ajaxError"
    | "vueError"
    | "reactError"
    | "consoleError"
    | "otherError";
  // 错误信息
  message: string;
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
  // 错误发生的页面
  url?: string;
  // 错误发生的页面标题
  title?: string;
  // 错误发生的用户代理
  userAgent?: string;
  // 错误发生的选择器
  selector?: string;
}

export interface Hooks {
  beforeLog: SyncHook;
}

export interface SenderOptions {
  projectName: string;
  appid: string;
}
