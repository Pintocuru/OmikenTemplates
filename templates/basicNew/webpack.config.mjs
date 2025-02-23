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
 const baseConfig = createConfig(dirname, argv.mode);

 // 子プロジェクト固有の設定
 const childConfig = {
  entry: path.resolve(dirname, './src/main.ts'),
  output: {
   filename: 'script.js',
   path: path.resolve(dirname, 'dist'),
   clean: true
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
   ...createCommonPlugins(dirname, argv.mode),
   new HtmlWebpackPlugin({
    template: path.resolve(childDir, './src/index.ejs'),
    filename: 'index.html',
    inject: 'body',
    templateParameters: ENV[mode],
    minify: false
   })
  ]
 };

 return { ...baseConfig, ...childConfig };
};
