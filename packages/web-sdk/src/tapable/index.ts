export class SyncHook {
  fns: ((...args: any) => void)[] = [];

  tap(name: string, fn: (...args: any) => void) {
    this.fns.push(fn);
  }

  call(...args: any[]) {
    this.fns.forEach((fn) => fn(...args));
  }
}
