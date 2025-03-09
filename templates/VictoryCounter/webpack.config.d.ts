// webpack.config.d.ts
import { WebpackOptionsNormalized } from 'webpack';

export interface WebpackEnv {
 [key: string]: any;
}

export type WebpackArgv = WebpackOptionsNormalized;
