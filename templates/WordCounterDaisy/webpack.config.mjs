// [packages] webpack.config.mjs
import { createConfig, createCommonPlugins, createCommonResolve } from '../../webpack.config.mjs';
import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

// コンポーネント名を配列として定義
const packages = [
 { appDir: 'basic', appName: 'basicCounter' },
 { appDir: 'basic2', appName: 'miniCounter' }
];

// ---

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default packages.map(({ appDir, appName }) => {
 const distDir = appName;
 const baseConfig = createConfig(dirname, false);
 const commonResolve = createCommonResolve();

 const entries = {
  main: path.resolve(dirname, `./src/apps/AnyGenerator/main.ts`),
  configMaker: path.resolve(dirname, `./src/apps/configMaker/main.ts`),
  [appName]: path.resolve(dirname, `./src/packages/${appDir}/${appName}.ts`)
 };

 const htmlPlugins = [
  new HtmlWebpackPlugin({
   template: path.resolve(dirname, `./src/apps/configMaker/index.ejs`),
   filename: `configMaker.html`,
   chunks: ['configMaker'],
   inject: 'body'
  }),
  new HtmlWebpackPlugin({
   template: path.resolve(dirname, `./src/apps/AnyGenerator/index.ejs`),
   filename: `index.html`,
   chunks: ['main', appName],
   inject: 'body',
   templateParameters: { appName }
  })
 ];

 const copyPatterns = [
  {
   from: path.resolve(dirname, `./assets/config.js`),
   to: path.resolve(dirname, `dist/${distDir}/config.js`)
  },
  {
   from: path.resolve(dirname, `./src/packages/${appDir}/${appName}.txt`),
   to: path.resolve(dirname, `dist/${distDir}/readme.txt`)
  },
  {
   from: path.resolve(dirname, `./src/packages/${appDir}/${appName}.json`),
   to: path.resolve(dirname, `dist/${distDir}/template.json`)
  },
  {
   from: path.resolve(dirname, `./src/packages/${appDir}/${appName}.png`),
   to: path.resolve(dirname, `dist/${distDir}/thumb.png`)
  }
 ];

 return {
  ...baseConfig,
  entry: entries,
  output: {
   filename: `script/[name].js`,
   path: path.resolve(dirname, `dist/${distDir}`),
   clean: true
  },
  resolve: {
   ...commonResolve,
   alias: {
    ...commonResolve.alias,
    '@': path.resolve(dirname, 'src'),
    '@packages': path.resolve(dirname, 'src/packages'),
    '@scripts': path.resolve(dirname, 'src/scripts'),
    '@assets': path.resolve(dirname, 'assets')
   }
  },
  externals: {
   vue: 'Vue'
  },
  plugins: [
   ...createCommonPlugins(),
   ...htmlPlugins,
   new CopyWebpackPlugin({ patterns: copyPatterns })
  ]
 };
});
