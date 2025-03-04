// [root] webpackAll.config.mjs
import path from 'path';
import { fileURLToPath } from 'url';
import { VueLoaderPlugin } from 'vue-loader';
import TerserPlugin from 'terser-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

// 親ディレクトリ
const dirname = path.dirname(fileURLToPath(import.meta.url));

export const ENV = {
 // development:開発環境設定
 development: {
  vuePath: 'https://unpkg.com/vue@3/dist/vue.global.js', // Vueのパス
  onesdkPath: path.resolve(dirname, './public/onesdk.js') // OneSDKのパス
 },
 // production:本番環境設定
 production: {
  vuePath: '../__origin/js/vue3.min.js',
  onesdkPath: '../__origin/js/onesdk.js'
 }
};

// 基本設定を作成する関数
export function createConfig(childDir, mode = 'development', isOneSDK = true) {
 return {
  mode, // モード
  entry: path.resolve(childDir, './src/main.ts'), // エントリーポイント
  context: path.resolve(childDir), // 対象フォルダ
  output: {
   filename: 'script.js', // 出力ファイル名
   path: path.resolve(childDir, 'dist'), // 出力ディレクトリ
   clean: true // 出力ディレクトリをクリーンアップ
  },
  resolve: { ...createCommonResolve(childDir) },
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
     exclude: [/node_modules/],
     options: {
      transpileOnly: false,
      appendTsSuffixTo: [/\.vue$/]
     }
    },
    // CSSファイルを処理
    {
     test: /\.css$/,
     use: [
      MiniCssExtractPlugin.loader,
      'css-loader',
      {
       loader: 'postcss-loader',
       options: {
        postcssOptions: {
         plugins: ['tailwindcss', 'autoprefixer']
        }
       }
      }
     ]
    },
    // SCSSファイルを処理
    {
     test: /\.scss$/,
     use: ['style-loader', 'css-loader', 'sass-loader']
    }
   ]
  },
  // 外部で使用するもの
  externals: {
   vue: 'Vue',
   '@onecomme.com/onesdk': isOneSDK ? 'OneSDK' : false
  },
  optimization: {
   minimize: false, // コードの最小化
   minimizer: [
    new TerserPlugin({
     terserOptions: {
      compress: {
       drop_console: true // console.log を削除
      }
     }
    })
   ],
   usedExports: true, // 使用されていないエクスポートを削除
   sideEffects: true, // サイドエフェクトがない場合、不要なコードを削除
   // コード分割
   splitChunks: false
  },
  plugins: createCommonPlugins(dirname, mode)
 };
}

// 共通のプラグインを作成する関数
export function createCommonPlugins(childDir, mode = 'development') {
 return [
  // Vueの処理
  new VueLoaderPlugin(),
  // CSSをjsから分離
  new MiniCssExtractPlugin({
   filename: 'script/[name].css'
  })
 ];
}

// 共通のエイリアスを作成
export function createCommonResolve() {
 return {
  // tsconfig.json の paths に対応
  alias: {
   '@type': path.resolve(dirname, 'public/types'),
   '@public': path.resolve(dirname, 'public'),
   '@common': path.resolve(dirname, 'public/common')
  },
  extensions: ['.js', '.ts', '.vue'] // 省略可能な拡張子
 };
}
