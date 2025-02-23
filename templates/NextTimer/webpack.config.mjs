// webpack.config.mjs
import {
 ENV,
 createConfig,
 createCommonPlugins,
 createCommonResolve
} from '../../webpackAll.config.mjs';
import path from 'path';
import { fileURLToPath } from 'url';
import { VueLoaderPlugin } from 'vue-loader';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default (env, argv) => {
 const baseConfig = createConfig(dirname, argv.mode);

 // エントリーポイントとoutputのカスタマイズ例
 const childConfig = {
  entry: {
   app1: path.resolve(dirname, './src/app1/main.ts'),
   app2: path.resolve(dirname, './src/app2/main.ts')
  },
  output: {
   filename: 'js/[name]/[name].js',
   path: path.resolve(dirname, 'dist'),
   clean: true
  },
  resolve: {
   ...createCommonResolve(dirname),
   alias: {
    '@type': path.resolve(dirname, 'public/types'),
    '@common': path.resolve(dirname, 'public/common'),
    '@': path.resolve(childDir, 'src'),
    // 子プロジェクト固有のエイリアス
    '@components': path.resolve(dirname, 'src/components')
   }
  },
  plugins: [
   ...createCommonPlugins(dirname, argv.mode),
   // HTMLプラグインを各エントリーポイントに対して作成
   new HtmlWebpackPlugin({
    template: path.resolve(dirname, './src/app1/index.ejs'),
    filename: 'app1/index.html',
    chunks: ['app1'], // このHTMLファイルで使用するチャンク
    inject: 'body',
    templateParameters: ENV[argv.mode]
   }),
   new HtmlWebpackPlugin({
    template: path.resolve(dirname, './src/app2/index.ejs'),
    filename: 'app2/index.html',
    chunks: ['app2'],
    inject: 'body',
    templateParameters: ENV[argv.mode]
   }),
   new VueLoaderPlugin()
  ]
 };

 return { ...baseConfig, ...childConfig };
};
