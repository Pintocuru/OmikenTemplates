// webpackAll.config.mjs
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(__filename);

export default {
 resolve: {
  alias: {
   '@type': path.resolve(dirname, 'public/types'), // tsconfig.json の paths に対応
   '@common': path.resolve(dirname, 'templates/common')
  },
  extensions: ['.js', '.ts', '.vue'] // 省略可能な拡張子
 },
 module: {
  rules: [
   // Vueファイルを処理
   {
    test: /\.vue$/,
    loader: 'vue-loader'
   },
   // TypeScriptファイルを処理
   {
    test: /\.ts$/,
    loader: 'ts-loader',
    exclude: /node_modules/,
    options: {
     transpileOnly: true // 型チェックを除外
    }
   },
   {
    test: /\.css$/,
    use: ['style-loader', 'css-loader']
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
 }
};
