// [root] webpack.config.mjs
import path from 'path';
import { fileURLToPath } from 'url';
import { VueLoaderPlugin } from 'vue-loader';
import TerserPlugin from 'terser-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

// 現在のファイルのディレクトリパスを取得
const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * 環境ごとの設定
 * @type {{ development: { vuePath: string; onesdkPath: string }, production: { vuePath: string; onesdkPath: string }, none: null }}
 */
export const ENV = {
 development: {
  vuePath: 'https://unpkg.com/vue@3/dist/vue.global.js', // 開発環境用のVueパス
  onesdkPath: path.resolve(dirname, './public/onesdk.js') // OneSDKのローカルパス
 },
 production: {
  vuePath: '../__origin/js/vue3.min.js', // 本番環境用のVueパス
  onesdkPath: '../__origin/js/onesdk.js' // 本番環境用のOneSDKパス
 },
 none: null
};

/**
 * Webpack設定を作成
 * @param {string} childDir - プロジェクトのルートディレクトリ
 * @param {'development' | 'production'} [mode='development'] - モード（デフォルトは開発）
 * @param {boolean} [isOneSDK=true] - OneSDKを使用するか
 * @returns {import('webpack').Configuration}
 */
export function createConfig(childDir, isOneSDK = true) {
 return {
  mode: 'production', // Webpackは production のみ
  entry: path.resolve(childDir, './src/main.ts'), // エントリーポイント
  context: path.resolve(childDir), // Webpackのルートディレクトリ
  output: {
   filename: 'script.js', // 出力ファイル名
   path: path.resolve(childDir, 'dist'), // 出力ディレクトリ
   clean: true // ビルド時に出力ディレクトリをクリーンアップ
  },
  resolve: createCommonResolve(),
  module: {
   rules: [
    {
     test: /\.vue$/, // Vueファイルの処理
     loader: 'vue-loader',
     options: { reactivityTransform: true }
    },
    {
     test: /\.ts$/, // TypeScriptの処理
     loader: 'ts-loader',
     exclude: /node_modules/,
     options: { transpileOnly: true, appendTsSuffixTo: [/\.vue$/] }
    },
    {
     test: /\.css$/, // CSSの処理
     use: [
      MiniCssExtractPlugin.loader,
      'css-loader',
      {
       loader: 'postcss-loader',
       options: { postcssOptions: { plugins: ['tailwindcss', 'autoprefixer'] } }
      }
     ]
    }
   ]
  },
  externals: {
   vue: 'Vue', // Vueを外部モジュールとして扱う
   '@onecomme.com/onesdk': isOneSDK ? 'OneSDK' : false
  },
  optimization: {
   minimize: true, // コードの最小化
   minimizer: [
    new TerserPlugin({
     exclude: [/config_.*\.js$/], // config_で始まるJSファイルを除外
     terserOptions: { compress: { drop_console: false } } // コンソールを削除
    }),
    new CssMinimizerPlugin({ test: /\.css$/ }) // CSSの最適化
   ],
   usedExports: true, // 未使用のエクスポートを削除
   sideEffects: true, // サイドエフェクトのないコードを削除
   splitChunks: {
    chunks: 'all', // すべてのチャンクを分割対象とする
    minSize: 20000, // 最小サイズ
    maxSize: 500000, // 最大サイズ
    minChunks: 2, // 2つ以上のエントリーポイントで共有されている場合に分割
    automaticNameDelimiter: '-',
    cacheGroups: {
     vendors: { test: /[\\/]node_modules[\\/]/, name: 'vendors', chunks: 'all', priority: -10 },
     common: { minChunks: 2, name: 'common', chunks: 'all', priority: -20 }
    }
   }
  },
  plugins: createCommonPlugins()
 };
}

/**
 * Webpackの共通プラグイン
 * @returns {import('webpack').Plugin[]}
 */
export function createCommonPlugins() {
 return [
  new VueLoaderPlugin(), // Vueの処理
  new MiniCssExtractPlugin({ filename: 'script/[name].css' }) // CSSを分離
 ];
}

/**
 * Webpackの共通エイリアス設定
 * @returns {import('webpack').ResolveOptions}
 */
export function createCommonResolve() {
 return {
  alias: {
   '@type': path.resolve(dirname, 'public/types'),
   '@public': path.resolve(dirname, 'public'),
   '@common': path.resolve(dirname, 'public/common')
  },
  extensions: ['.js', '.ts', '.vue'] // 省略可能な拡張子
 };
}
