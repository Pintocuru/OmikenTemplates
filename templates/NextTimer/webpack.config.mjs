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
   base: path.resolve(dirname, './src/apps/base/main.ts')
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
   // HTMLプラグインを各エントリーポイントに対して作成
   new HtmlWebpackPlugin({
    template: path.resolve(dirname, './src/apps/base/index.ejs'),
    filename: 'base/index.html',
    chunks: ['base'], // このHTMLファイルで使用するチャンク
    inject: 'body', // スクリプトを body 内に挿入
    templateParameters: ENV[mode]
   })
  ]
 };

 return { ...baseConfig, ...childConfig };
};
