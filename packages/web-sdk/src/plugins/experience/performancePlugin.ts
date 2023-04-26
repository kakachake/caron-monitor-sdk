import WebMonitor from "src/core";
import MonitorPlugin from "../plugin";
import { lastEvent, lastEventSelectors } from "src/utils/getLastEvent";
import getSelectors from "src/utils/getSelector";

export default class performancePlugin extends MonitorPlugin {
  FMP = 0;
  LCP = 0;
  apply(monitor: WebMonitor) {
    // 增加一个性能条目的监听器
    console.log("performancePlugin");

    // FMP
    new PerformanceObserver((entryList, observer) => {
      const perfEntries = entryList.getEntries();
      this.FMP = perfEntries[0].startTime;
      observer.disconnect();
    }).observe({ entryTypes: ["element"] });

    // LCP
    new PerformanceObserver((entryList, observer) => {
      const perfEntries = entryList.getEntries();
      const LCP = perfEntries[0].startTime;
      this.LCP = LCP;
      observer.disconnect();
    }).observe({ entryTypes: ["largest-contentful-paint"] });

    // FI 用户的第一次交互，如点击，键盘事件
    new PerformanceObserver((entryList, observer) => {
      const firstInput = entryList.getEntries()[0];
      if (firstInput) {
        const inputDelay =
          (firstInput as any).processingStart - firstInput.startTime;
        const duration = firstInput.duration; // 处理的耗时
        console.log(firstInput);
        console.log(lastEvent);

        if (inputDelay > 0 || duration > 0) {
          this.monitor.collectLog({
            kind: "performance",
            type: "firstInputDelay",
            inputDelay,
            inputType: firstInput.name,
            duration,
            selector: lastEventSelectors || "",
          });
        }
      }

      observer.disconnect();
    }).observe({ type: "first-input", buffered: true });
  }

  onload(monitor: WebMonitor) {
    setTimeout(() => {
      const { type, ...rest } = this.getPerformance().toJSON();
      const FP = performance.getEntriesByName("first-paint")[0].startTime;
      const FCP = performance.getEntriesByName("first-contentful-paint")[0]
        .startTime;

      this.monitor.collectLog({
        kind: "experience",
        type: "performance",
        // ...rest,
        // 页面加载总耗时
        loadTime: rest.loadEventStart - rest.startTime,
        // DNS查询耗时
        dnsTime: rest.domainLookupEnd - rest.domainLookupStart,
        // TCP连接耗时
        tcpTime: rest.connectEnd - rest.connectStart,
        // 首字节时间
        ttfbTime: rest.responseStart - rest.requestStart,
        // request请求耗时
        requestTime: rest.responseEnd - rest.requestStart,
        // 数据传输耗时
        transferTime: rest.responseEnd - rest.responseStart,
        // 解析dom树耗时
        parseDomTime: rest.domContentLoadedEventEnd - rest.responseEnd,
        // 资源加载耗时
        resourceTime: rest.loadEventStart - rest.domContentLoadedEventEnd,
        // 首次交互时间
        firstInteractionTime: rest.domInteractive - rest.startTime,
        // 首次渲染时间
        FP,
        // 首次内容渲染时间
        FCP,
        // 首次有效渲染时间
        FMP: this.FMP,
        // 最大内容渲染时间
        LCP: this.LCP,
      });
    }, 2000);
  }

  getPerformance() {
    return window.performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;
  }
}
