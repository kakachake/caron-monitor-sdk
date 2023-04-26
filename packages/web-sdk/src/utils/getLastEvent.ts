import getSelectors from "./getSelector";

let lastEvent: Event | null = null;
let lastEventSelectors = "";
[
  "click",
  "dblclick",
  "mousedown",
  "touchstart",
  "keydown",
  "mousemove",
  "mouseover",
].forEach((eventName) => {
  document.addEventListener(
    eventName,
    (event) => {
      lastEvent = event;
      lastEventSelectors = getSelectors(event.composedPath());
    },
    {
      capture: true,
      passive: true, // 默认不阻止默认事件
    }
  );
});

export { lastEvent, lastEventSelectors };
