// [packages] webpack.config.mjs
import {
 ENV,
 createConfig,
 createCommonPlugins,
 createCommonResolve
} from '../../webpackAll.config.mjs';
import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

// コンポーネント名を挿入 (AnyGenerator/generator.vueの変更も行うこと)
export const appName = 'BasicCounter';

// ---
const dirname = path.dirname(fileURLToPath(import.meta.url));

export default (env, argv) => {
 const { mode } = argv;
 const baseConfig = createConfig(dirname, mode, false);
 const commonResolve = createCommonResolve();

 const childConfig = {
  entry: {
   main: path.resolve(dirname, './src/apps/AnyGenerator/main.ts'),
   [appName]: path.resolve(dirname, './src/apps/AnyGenerator/generator.ts'),
   controller: path.resolve(dirname, './src/apps/controller/main.ts')
  },
  output: {
   filename: 'script/[name].js',
   path: path.resolve(dirname, 'dist'),
   clean: true
  },
  resolve: {
   ...commonResolve,
   alias: {
    ...commonResolve.alias,
    '@': path.resolve(dirname, 'src'),
    '@components': path.resolve(dirname, 'src/components'),
    '@scripts': path.resolve(dirname, 'src/scripts'),
    '@styles': path.resolve(dirname, 'src/styles')
   }
  },
  plugins: [
   ...createCommonPlugins(dirname, mode),
   // AnyGenerator
   new HtmlWebpackPlugin({
    template: path.resolve(dirname, `./src/apps/AnyGenerator/index.ejs`),
    filename: `${appName}.html`,
    chunks: ['main', appName], // このHTMLファイルで使用するチャンク
    inject: 'body', // スクリプトを body 内に挿入
    templateParameters: ENV[mode]
   }),
   // controller
   new HtmlWebpackPlugin({
    template: path.resolve(dirname, `./src/apps/controller/index.ejs`),
    filename: `controller.html`,
    chunks: ['controller'], // このHTMLファイルで使用するチャンク
    inject: 'body', // スクリプトを body 内に挿入
    templateParameters: ENV[mode]
   }),
   // Copy config.js & template.json
   new CopyWebpackPlugin({
    patterns: [
     {
      from: path.resolve(dirname, './assets/config.js'),
      to: path.resolve(dirname, 'dist/config.js')
     },
     {
      from: path.resolve(dirname, './assets/template.json'),
      to: path.resolve(dirname, 'dist/template.json')
     }
    ]
   })
  ]
 };

 return { ...baseConfig, ...childConfig };
};
