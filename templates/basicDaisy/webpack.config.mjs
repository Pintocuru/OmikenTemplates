// [packages] webpack.config.mjs
import path from 'path';
import { fileURLToPath } from 'url';
import { createConfig, createCommonPlugins, createCommonResolve } from '../../webpack.config.mjs';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

// 現在のファイルのディレクトリパスを取得
const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Webpack 設定をエクスポート
 * @param {Record<string, any>} env - 環境変数
 * @param {import('webpack').WebpackOptionsNormalized} argv - Webpackのオプション
 * @returns {import('webpack').Configuration} - Webpack設定
 */
export default (env, argv) => {
 const { mode = 'development' } = argv;
 const baseConfig = createConfig(dirname, mode);

 // 子プロジェクト固有の設定
 const childConfig = {
  entry: path.resolve(dirname, './src/main.ts'),
  output: {
   filename: 'script/script.js', // 出力ファイル名
   path: path.resolve(dirname, 'dist'), // 出力ディレクトリ
   clean: true // 出力ディレクトリをクリーンアップ
  },
  resolve: {
   ...createCommonResolve(),
   alias: {
    ...createCommonResolve().alias,
    // 子プロジェクトのエイリアス
    '@': path.resolve(dirname, 'src')
   }
  },
  plugins: [
   ...createCommonPlugins(),
   new HtmlWebpackPlugin({
    template: path.resolve(dirname, './src/index.ejs'),
    filename: 'index.html',
    inject: 'body'
   }),
   new CopyWebpackPlugin({
    patterns: [
     {
      from: path.resolve(dirname, './assets/template.json'),
      to: path.resolve(dirname, 'dist/template.json')
     },
     {
      from: path.resolve(dirname, `./assets/config.js`),
      to: path.resolve(dirname, `dist/config.js`)
     }
    ]
   })
  ]
 };

 return { ...baseConfig, ...childConfig };
};
