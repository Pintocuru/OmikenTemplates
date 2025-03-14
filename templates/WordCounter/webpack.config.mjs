// [packages] webpack.config.mjs
import { createConfig, createCommonPlugins, createCommonResolve } from '../../webpack.config.mjs';
import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

// コンポーネント名を配列として定義
const components = [
 { appDir: 'VictoryCrown', appName: 'VictoryCrown' },
 { appDir: 'VictoryCrown', appName: 'SplashNice' }
];

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default components.map(({ appDir, appName }) => {
 const distDir = appName;
 const baseConfig = createConfig(dirname, false);
 const commonResolve = createCommonResolve();

 const entries = {
  main: path.resolve(dirname, `./src/apps/AnyGenerator/main.ts`),
  controller: path.resolve(dirname, `./src/apps/controller/main.ts`),
  [appName]: path.resolve(dirname, `./src/components/${appDir}/${appName}.ts`)
 };

 const htmlPlugins = [
  new HtmlWebpackPlugin({
   template: path.resolve(dirname, `./src/apps/controller/index.ejs`),
   filename: `controller.html`,
   chunks: ['controller'],
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
   from: path.resolve(dirname, `./src/components/${appDir}/config_${appName}.js`),
   to: path.resolve(dirname, `dist/${distDir}/config.js`)
  },
  {
   from: path.resolve(dirname, `./src/components/${appDir}/${appName}.txt`),
   to: path.resolve(dirname, `dist/${distDir}/readme.txt`)
  },
  {
   from: path.resolve(dirname, `./src/components/${appDir}/${appName}.json`),
   to: path.resolve(dirname, `dist/${distDir}/template.json`)
  },
  {
   from: path.resolve(dirname, `./src/components/${appDir}/${appName}.png`),
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
    '@components': path.resolve(dirname, 'src/components'),
    '@scripts': path.resolve(dirname, 'src/scripts'),
    '@styles': path.resolve(dirname, 'src/styles')
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
