import { nodeResolve } from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import { terser } from '@rollup/plugin-terser';

const isProduction = process.env.NODE_ENV === 'production';

export default {
  input: 'js/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    name: 'CalculatorApp',
    sourcemap: !isProduction
  },
  plugins: [
    nodeResolve({
      browser: true,
      preferBuiltins: false
    }),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: [
        ['@babel/preset-env', {
          targets: {
            browsers: ['> 1%', 'last 2 versions', 'not dead']
          }
        }]
      ]
    }),
    isProduction && terser({
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    })
  ].filter(Boolean),
  external: ['mathjs']
};
