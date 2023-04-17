export const getErrorLines = (str: string) => {
  return str
    .split("\n")
    .slice(1)
    .map((s: string) => s.trim())
    .join("^");
};
