// webpackAll.config.mjs
import path from 'path';
import { fileURLToPath } from 'url';
import { VueLoaderPlugin } from 'vue-loader';
import AutoImport from 'unplugin-auto-import/webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

// 親ディレクトリ
const dirname = path.dirname(fileURLToPath(import.meta.url));

const ENV = {
 // development:開発環境設定
 development: {
  cssDir: '../src/css',
  cssPath: '../src/css/app.css',
  vuePath: 'https://unpkg.com/vue@3/dist/vue.global.js',
  onesdkPath: '../../../public/onesdk.js',
  scriptPath: './script.js',
  configPath: '../src/config.js'
 },
 // production:本番環境設定
 production: {
  cssDir: './css',
  cssPath: './css/app.css',
  vuePath: '../__origin/js/vue3.min.js',
  onesdkPath: '../__origin/js/onesdk.js',
  scriptPath: './script.js',
  configPath: './config.js'
 }
};

export function createConfig(childDir, mode = 'development') {
 return {
  mode, // モード
  entry: path.resolve(childDir, './src/main.ts'), // エントリーポイント
  context: path.resolve(childDir), // 対象フォルダ
  output: {
   filename: 'script.js', // 出力ファイル名
   path: path.resolve(childDir, 'dist'), // 出力ディレクトリ
   clean: true // 出力ディレクトリをクリーンアップ
  },
  resolve: {
   // tsconfig.json の paths に対応
   alias: {
    '@type': path.resolve(dirname, 'public/types'),
    '@common': path.resolve(dirname, 'templates/common')
   },
   extensions: ['.js', '.ts', '.vue'] // 省略可能な拡張子
  },
  module: {
   rules: [
    // Vueファイルを処理
    {
     test: /\.vue$/,
     loader: 'vue-loader',
     options: {
      reactivityTransform: true
     }
    },
    // TypeScriptファイルを処理
    {
     test: /\.ts$/,
     loader: 'ts-loader',
     exclude: /node_modules/,
     options: {
      transpileOnly: false, // チェックをゆるくするか
      appendTsSuffixTo: [/\.vue$/]
     }
    },
    // CSSファイルを処理
    {
     test: /\.css$/,
     use: ['style-loader', 'css-loader']
    },
    // SCSSファイルを処理
    {
     test: /\.scss$/,
     use: ['style-loader', 'css-loader', 'sass-loader']
    },
    // pugファイルを処理
    {
     test: /\.pug$/,
     loader: 'pug-loader',
     options: {
      pretty: true
     }
    }
   ]
  },
  // 外部で使用するもの
  externals: {
   vue: 'Vue',
   '@onecomme.com/onesdk': 'OneSDK'
  },
  optimization: {
   minimize: false, // コードの最小化
   usedExports: true, // 使用されていないエクスポートを削除
   sideEffects: true // サイドエフェクトがない場合、不要なコードを削除
  },
  plugins: [
   // Vue用のWebpackプラグイン
   new VueLoaderPlugin(),
   // ejsからHTML出力
   new HtmlWebpackPlugin({
    template: path.resolve(childDir, './src/index.ejs'),
    filename: 'index.html',
    inject: 'body',
    templateParameters: ENV[mode],
    minify: false
   }),
   // AutoImport
   AutoImport({
    imports: ['vue'],
    dts: path.resolve(childDir, './src/auto-imports.d.ts')
   })
  ]
 };
}
