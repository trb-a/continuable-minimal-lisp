//@ts-check
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import {terser} from 'rollup-plugin-terser';

import pkg from './package.json';

const name = pkg.name
  .split("/").slice(-1)[0]
  .replace(/-(\w)/g, (m, p1) => p1.toUpperCase())
  .replace(/^(\w)/, m => m.toUpperCase());

const banner = `/*!
  ${name}.js v${pkg.version}
  ${pkg.homepage}
  Released under the ${pkg.license} License.
*/`;

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        banner,
        exports: "named",
      },
      {
        file: pkg.main.replace('.mjs', '.min.mjs'),
        format: 'cjs',
        banner,
        plugins: [terser()],
        exports: "named",
      },
      {
        file: pkg.module,
        format: 'es',
        banner,
        exports: "named",
      },
      {
        file: pkg.module.replace('.mjs', '.min.mjs'),
        format: 'es',
        banner,
        plugins: [terser()],
        exports: "named",
      },
    ],
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.devDependencies || {}),
    ],
    plugins: [
      typescript(),
      resolve(),
      commonjs({extensions: ['.ts', '.js']}),
      json(),
    ],
  },
];
