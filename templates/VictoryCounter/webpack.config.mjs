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

// コンポーネント名を配列として定義
export const appNames = ['FallCrown', 'KillingSpree', 'SamuraiKatana', 'SplashNice'];

// ---
const dirname = path.dirname(fileURLToPath(import.meta.url));

export default (env, argv) => {
 const { mode } = argv;
 const baseConfig = createConfig(dirname, mode, false);
 const commonResolve = createCommonResolve();

 // エントリーポイントを動的に生成
 const entries = {
  main: path.resolve(dirname, './src/apps/AnyGenerator/main.ts'),
  controller: path.resolve(dirname, './src/apps/controller/main.ts')
 };

 // 各アプリ名に対応するエントリーポイントを追加
 appNames.forEach((appName) => {
  entries[appName] = path.resolve(dirname, `./src/apps/AnyGenerator/VictoryCounter/${appName}.ts`);
 });

 // HTML Webpack Pluginを動的に生成
 const htmlPlugins = [
  // controller用のHTMLプラグイン
  new HtmlWebpackPlugin({
   template: path.resolve(dirname, `./src/apps/controller/index.ejs`),
   filename: `controller.html`,
   chunks: ['controller'],
   inject: 'body',
   templateParameters: ENV[mode]
  })
 ];

 // コピーするファイルのパターンを動的に生成
 const copyPatterns = [
  {
   from: path.resolve(dirname, './assets/template.json'),
   to: path.resolve(dirname, 'dist/template.json')
  }
 ];

 // 各アプリ用のHTMLプラグインとコピーパターンを追加
 appNames.forEach((appName) => {
  // HTMLプラグインの追加
  htmlPlugins.push(
   new HtmlWebpackPlugin({
    template: path.resolve(dirname, `./src/apps/AnyGenerator/index.ejs`),
    filename: `${appName}.html`,
    chunks: ['main', appName],
    inject: 'body',
    templateParameters: {
     ENV: ENV[mode],
     appName: appName
    }
   })
  );

  // コピーパターンの追加
  copyPatterns.push({
   from: path.resolve(dirname, `./assets/VictoryCounter/config_${appName}.js`),
   to: path.resolve(dirname, `dist/config_${appName}.js`)
  });
 });

 const childConfig = {
  entry: entries,
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
  // 外部で使用するもの
  externals: {
   vue: 'Vue'
  },
  plugins: [
   ...createCommonPlugins(dirname, mode),
   ...htmlPlugins,
   // Copy config.js & template.json
   new CopyWebpackPlugin({
    patterns: copyPatterns
   })
  ]
 };

 return { ...baseConfig, ...childConfig };
};
