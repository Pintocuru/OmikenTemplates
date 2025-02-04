// webpack.config.mjs
import path from 'path';
import { VueLoaderPlugin } from 'vue-loader';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import sharedConfig from '../../webpackAll.config.mjs';
import { ENV } from '../../webpackENV.js';
import { fileURLToPath } from 'url';

// 現在のファイルのURLを基に、ディレクトリパスを取得
const __filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(__filename);

// 個別用
export default (env, argv) => {
 const mode = argv.mode || 'development';
 const envConfig = ENV[mode];

 return {
  ...sharedConfig,
  mode: mode, // モード
  entry: './main.ts', // エントリーポイント
  context: path.resolve(dirname, 'src'), // 対象フォルダ
  output: {
   filename: 'script.js', // 出力ファイル名
   path: path.resolve(dirname, 'dist'), // 出力ディレクトリ
   clean: true // 出力ディレクトリをクリーンアップ
  },

  plugins: [
   // Vue用のWebpackプラグイン
   new VueLoaderPlugin(),
   // HTML
   new HtmlWebpackPlugin({
    template: './index.ejs',
    filename: 'index.html',
    inject: 'body',
    templateParameters: envConfig,
    minify: false // コード量を軽減する
   })
  ]
 };
};
