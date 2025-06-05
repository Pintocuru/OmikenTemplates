// [packages] webpack.config.mjs
import { createConfig, createCommonPlugins, createCommonResolve } from '../../webpack.config.mjs';
import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

// ---

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default () => {
 const baseConfig = createConfig(dirname, false);
 const commonResolve = createCommonResolve();

 const entries = {
  MainGenerator: path.resolve(dirname, `./src/MainGenerator/main.ts`),
  ConfigMaker: path.resolve(dirname, `./src/ConfigMaker/main.ts`)
 };

 const htmlPlugins = [
  // 本体:MainGenerator
  new HtmlWebpackPlugin({
   template: path.resolve(dirname, `./src/MainGenerator/index.ejs`),
   filename: `index.html`,
   chunks: ['MainGenerator'],
   inject: 'body'
  }),
  // ConfigMaker
  new HtmlWebpackPlugin({
   template: path.resolve(dirname, `./src/ConfigMaker/index.ejs`),
   filename: `ConfigMaker.html`,
   chunks: ['ConfigMaker'],
   inject: 'body'
  })
 ];

 const copyPatterns = [
  {
   from: path.resolve(dirname, `./assets/app.css`),
   to: path.resolve(dirname, `dist/scripts/app.css`)
  },
  {
   from: path.resolve(dirname, `./assets/config.js`),
   to: path.resolve(dirname, `dist/config.js`)
  },
  {
   from: path.resolve(dirname, `./assets/readme.txt`),
   to: path.resolve(dirname, `dist/readme.txt`)
  },
  {
   from: path.resolve(dirname, `./assets/template.json`),
   to: path.resolve(dirname, `dist/template.json`)
  },
  {
   from: path.resolve(dirname, `./assets/thumb.png`),
   to: path.resolve(dirname, `dist/thumb.png`)
  }
 ];

 // CSS ローダーの設定をカスタマイズ
 const cssLoaderRule = {
  test: /\.css$/,
  use: ['style-loader', 'css-loader', 'postcss-loader']
 };

 // baseConfig から rules を取得し、CSS ルールを置き換える
 const rules = baseConfig.module.rules.map((rule) =>
  rule.test.toString() === /\.css$/.toString() ? cssLoaderRule : rule
 );

 return {
  ...baseConfig,
  entry: entries,
  output: {
   filename: `scripts/[name].js`,
   path: path.resolve(dirname, `dist`),
   clean: true
  },
  resolve: {
   ...commonResolve,
   alias: {
    ...commonResolve.alias,
    '@': path.resolve(dirname, 'src'),
    '@assets': path.resolve(dirname, 'assets')
   }
  },
  module: {
   ...baseConfig.module,
   rules: rules
  },
  externals: {
   vue: 'Vue'
  },
  plugins: [
   ...createCommonPlugins(),
   ...htmlPlugins,
   new CopyWebpackPlugin({ patterns: copyPatterns })
  ]
 };
};
