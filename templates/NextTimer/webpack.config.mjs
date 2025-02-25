// webpack.config.mjs
import {
 ENV,
 createConfig,
 createCommonPlugins,
 createCommonResolve
} from '../../webpackAll.config.mjs';
import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default (env, argv) => {
 const { mode } = argv;
 const baseConfig = createConfig(dirname, mode);

 // モノレポ構造用設定
 const childConfig = {
  entry: {
   basic: path.resolve(dirname, './src/apps/basic/main.ts'),
   NightRider: path.resolve(dirname, './src/apps/NightRider/main.ts'),
   controller: path.resolve(dirname, './src/apps/controller/main.ts')
  },
  output: {
   filename: '[name]/script.js',
   path: path.resolve(dirname, 'dist'),
   clean: true
  },
  resolve: {
   ...createCommonResolve(),
   alias: {
    ...createCommonResolve().alias,
    // 子プロジェクトのエイリアス
    '@': path.resolve(dirname, 'src'),
    '@scripts': path.resolve(dirname, 'src/scripts')
   }
  },
  plugins: [
   ...createCommonPlugins(dirname, mode),
   // basic
   new HtmlWebpackPlugin({
    template: path.resolve(dirname, './src/apps/basic/index.ejs'),
    filename: 'basic/index.html',
    chunks: ['basic'], // このHTMLファイルで使用するチャンク
    inject: 'body', // スクリプトを body 内に挿入
    templateParameters: ENV[mode]
   }),
   // NightRider
   new HtmlWebpackPlugin({
    template: path.resolve(dirname, './src/apps/NightRider/index.ejs'),
    filename: 'NightRider/index.html',
    chunks: ['NightRider'], // このHTMLファイルで使用するチャンク
    inject: 'body', // スクリプトを body 内に挿入
    templateParameters: ENV[mode]
   }),
   // controller
   new HtmlWebpackPlugin({
    template: path.resolve(dirname, './src/apps/controller/index.ejs'),
    filename: 'controller/index.html',
    chunks: ['controller'], // このHTMLファイルで使用するチャンク
    inject: 'body', // スクリプトを body 内に挿入
    templateParameters: ENV[mode]
   })
  ]
 };

 return { ...baseConfig, ...childConfig };
};
