export const getErrorLines = (str: string) => {
  return str
    .split("\n")
    .slice(1)
    .map((s: string) => {
      const reg = /at\s+(.+)\s+\((.+):(\d+):(\d+)\)/g;
      const result = reg.exec(s);
      reg.lastIndex = 0;
      return {
        func: result?.[1],
        file: result?.[2],
        line: result?.[3],
        column: result?.[4],
      };
    })
    .filter((s: any) => s.file);
};
