import { Configuration, Plugin, ResolveOptions } from 'webpack';

/** 環境ごとの設定 */
export interface EnvConfig {
 vuePath: string;
 onesdkPath: string;
}

/** Webpackの環境設定 */
export declare const ENV: {
 development: EnvConfig;
 production: EnvConfig;
 none: null;
};

/**
 * Webpack設定を作成
 * @param childDir - プロジェクトのルートディレクトリ
 * @param mode - モード（開発・本番）
 * @param isOneSDK - OneSDKを使用するか
 * @returns Webpack設定オブジェクト
 */
export declare function createConfig(
 childDir: string,
 mode?: 'development' | 'production',
 isOneSDK?: boolean
): Configuration;

/** Webpackの共通プラグイン */
export declare function createCommonPlugins(): Plugin[];

/** Webpackの共通エイリアス設定 */
export declare function createCommonResolve(): ResolveOptions;
