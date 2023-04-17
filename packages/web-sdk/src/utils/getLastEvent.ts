let lastEvent: Event | null = null;

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
    },
    {
      capture: true,
      passive: true, // 默认不阻止默认事件
    }
  );
});

export { lastEvent };
