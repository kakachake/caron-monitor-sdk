import WebMonitor from "src/core";
import MonitorPlugin from "src/plugins/plugin";

export default class BlankScreenPlugin extends MonitorPlugin {
  apply(monitor: WebMonitor) {
    //
  }

  onload(monitor: WebMonitor) {
    this.trackerScreenBlank();
  }

  trackerScreenBlank() {
    const self = this;
    let emptyCount = 0;
    const wrapperElements = [
      "html",
      "body",
      ...(self.options.wrapperElements || []),
    ];
    function getSelector(element: Element) {
      if (!element) return "";
      if (element.id) {
        return `#${element.id}`;
      } else if (element.className) {
        return `.${element.className.split(" ").filter(Boolean).join(".")}`;
      } else {
        return element.tagName.toLowerCase();
      }
    }

    function isWrapper(element: Element) {
      const selector = getSelector(element);

      if (wrapperElements.includes(selector)) {
        emptyCount++;
      }
    }
    const xCenter = window.innerWidth / 2;
    const yCenter = window.innerHeight / 2;
    for (let i = 1; i <= 9; i++) {
      const x = (window.innerWidth / 10) * i;
      const y = (window.innerHeight / 10) * i;
      const xElement = document.elementsFromPoint(x, yCenter);
      const yElement = document.elementsFromPoint(xCenter, y);

      isWrapper(xElement[0]);
      isWrapper(yElement[0]);
    }

    if (emptyCount >= (this.options.maxEmptyCount || 0)) {
      const centerElement = document.elementFromPoint(xCenter, yCenter);
      this.monitor.collectLog({
        kind: "stability",
        type: "blankScreen",
        screen: `${window.screen.width}x${window.screen.height}`,
        viewPoint: `${window.innerWidth}x${window.innerHeight}`,
        selector: (centerElement && getSelector(centerElement)) || "",
        emptyCount,
      });
    }
  }

  unload() {
    //
  }
}
