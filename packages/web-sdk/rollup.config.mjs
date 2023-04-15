import typescript from "rollup-plugin-typescript2";
import terser from "@rollup/plugin-terser";
import babel from "@rollup/plugin-babel";
import npm from "@rollup/plugin-node-resolve";
import path from "path";
import { fileURLToPath } from "url";
import commonjs from "@rollup/plugin-commonjs";

const __filenameNew = fileURLToPath(import.meta.url);

const __dirnameNew = path.dirname(__filenameNew);
console.log(path.resolve(__dirnameNew));
export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.js",
      format: "umd",
      name: "CaronMonitor",
    },
  ],
  plugins: [
    npm(),
    commonjs(),
    typescript({
      tsconfig: "tsconfig.json",
    }),
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
    }),
    terser(),
  ],
};
