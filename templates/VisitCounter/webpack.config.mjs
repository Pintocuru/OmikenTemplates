// webpack.config.mjs
import { createConfig } from '../../webpackAll.config.mjs';
import { fileURLToPath } from 'url';
import path from 'path';

// ディレクトリ取得
const dirname = path.dirname(fileURLToPath(import.meta.url));

export default (env, argv) => createConfig(dirname, argv.mode);
