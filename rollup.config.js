import typescript from "rollup-plugin-typescript";
import buble from "rollup-plugin-buble";


export default {
  entry: 'src/index.ts',
  external: ["lodash", "rxjs/Rx"],
  plugins: [
    typescript({tsconfig: false}),
    buble()
  ],
  targets: [
    {dest: 'lib/mighty-js.cjs.js', format: 'cjs', sourceMap: true},
    {dest: 'lib/mighty-js.umd.js', format: 'umd', sourceMap: true, moduleName: "mighty-js"},
    {dest: 'lib/mighty-js.es6.js', format: 'es', sourceMap: true}
  ]
}
