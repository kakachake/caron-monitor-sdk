import BlankScreenPlugin from "./stability/blankScreen/blankScreen";
import XhrErrorPlugin from "./stability/http";
import InjectJsErrorPlugin from "./stability/jsError/index";
import ShareLogPlugin from "./shareLog";
import performancePlugin from "./experience/performancePlugin";
import longTaskPlugin from "./experience/longTaskPlugin";
import PVPlugin from "./business/pv";

export const defalutPlugins = [
  InjectJsErrorPlugin,
  ShareLogPlugin,
  XhrErrorPlugin,
  BlankScreenPlugin,
  performancePlugin,
  longTaskPlugin,
  PVPlugin,
];
