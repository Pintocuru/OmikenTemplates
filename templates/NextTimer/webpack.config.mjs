// [packages] webpack.config.mjs
import {
 ENV,
 createConfig,
 createCommonPlugins,
 createCommonResolve
} from '../../webpackAll.config.mjs';
import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

// コンポーネント名を挿入 (AnyGenerator/App.vueの変更も行うこと)
const app = 'OldPattern05';

// BasicCounter
// SimpleCounter
// NightRider
// FlipCoin
// FireComic

// ---

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default (env, argv) => {
 const { mode } = argv;
 const baseConfig = createConfig(dirname, mode);

 const childConfig = {
  entry: {
   [app]: path.resolve(dirname, './src/apps/AnyGenerator/main.ts'),
   controller: path.resolve(dirname, './src/apps/controller/main.ts')
  },
  output: {
   filename: 'script/[name].js',
   path: path.resolve(dirname, 'dist'),
   clean: true
  },
  resolve: {
   ...createCommonResolve(),
   alias: {
    ...createCommonResolve().alias,
    '@': path.resolve(dirname, 'src'),
    '@components': path.resolve(dirname, 'src/components'),
    '@scripts': path.resolve(dirname, 'src/scripts'),
    '@styles': path.resolve(dirname, 'src/styles')
   }
  },
  plugins: [
   ...createCommonPlugins(dirname, mode),
   // AnyGenerator
   new HtmlWebpackPlugin({
    template: path.resolve(dirname, `./src/apps/AnyGenerator/index.ejs`),
    filename: `${app}.html`,
    chunks: [app], // このHTMLファイルで使用するチャンク
    inject: 'body', // スクリプトを body 内に挿入
    templateParameters: ENV[mode]
   }),
   // controller
   new HtmlWebpackPlugin({
    template: path.resolve(dirname, `./src/apps/controller/index.ejs`),
    filename: `controller.html`,
    chunks: ['controller'], // このHTMLファイルで使用するチャンク
    inject: 'body', // スクリプトを body 内に挿入
    templateParameters: ENV[mode]
   }),
   // Copy config.js to dist
   new CopyWebpackPlugin({
    patterns: [
     {
      from: path.resolve(dirname, './src/assets/config.js'),
      to: path.resolve(dirname, 'dist/config.js')
     }
    ]
   })
  ]
 };

 return { ...baseConfig, ...childConfig };
};
