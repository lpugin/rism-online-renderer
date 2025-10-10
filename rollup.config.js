import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default [
  {
    input: 'dist/renderers.js', // 'dist/custom-renderers.js'],
    output: {
      file: './rism-online-renderer.js',
      format: 'iife', // Immediately Invoked Function Expression for browser compatibility
      name: 'RISMOnline', // Accessible globally in the browser,
    },
    plugins: [
      resolve(),
      commonjs()
    ],
  },
  {
    input: 'dist/custom-renderers.js',
    output: {
      file: './rism-online-custom-renderer.js',
      format: 'iife', // Immediately Invoked Function Expression for browser compatibility
      name: 'RISMOnlineCustom', // Accessible globally in the browser,
    },
    plugins: [
      resolve(),
      commonjs()
    ],
  }];