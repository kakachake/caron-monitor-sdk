export default function getSelectors(path: EventTarget[]): string {
  const selectors: string[] = [];
  path = path.slice(0, path.length - 2).reverse();
  console.log(path);

  for (let i = 0; i < path.length; i++) {
    const el = path[i] as HTMLElement;
    if (!el) {
      continue;
    }
    let selector = el.nodeName.toLowerCase();
    if (el.id) {
      selector += `#${el.id}`;
      selectors.push(selector);
    } else {
      const sib = el.parentNode?.querySelectorAll(selector);
      if (el.className) {
        selector += `.${el.className}`;
      }
      if (sib && sib.length > 1) {
        selector += `:nth-child(${[...sib].indexOf(el) + 1})`;
      }
      selectors.push(selector);
    }
  }
  return selectors.join(" > ");
}

//
export const analyzeSelector = (selector: string) => {
  const selectors = selector.split(" > ");
  const reg = /(\w+)(?:#(\w+))?(?::nth-child\((\d+)\))?/g;
  let parent: Element = document.body;
  const res = selectors.map((s) => {
    const result = reg.exec(s);
    reg.lastIndex = 0;
    const [all, tag, id, nth] = result || [""];
    if (!tag) return;
    if (nth) {
      parent = parent.querySelectorAll(tag)[Number(nth) - 1];
    }
    parent = parent.querySelector(all)!;
    return parent;
  });
  console.log(res);
  return res;
};
