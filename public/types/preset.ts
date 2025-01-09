// src/types/preset.ts
import { BaseType, OmikenType, OneCommePostType } from './Omiken';
import { GameType } from './plugin';
import { Comment } from '@onecomme.com/onesdk/types/Comment';

// presetデータ
export interface PresetType extends BaseType {
 version: string; // バージョン番号
 author?: string; // 開発者名
 url?: string; // サポートページのURL
 banner?: string; // 紹介用画像
 path?: string; // データのパス(Presetsをルートとする)
}

// ---

// おみくじデータ付きpresetデータ
export interface PresetOmikenType extends PresetType {
 item: OmikenType;
 isOverwrite?: boolean; // 追加方法(true:上書き/false:追加)
}

// Chara:キャラクターJSONの型定義
export interface CharaType extends PresetType {
 nickname?: string; // 読み上げ時の名前の読ませ方
 frameId: string | null; // わんコメの枠
 color: {
  '--lcv-name-color': string; // 名前の色
  '--lcv-text-color': string; // コメントの色
  '--lcv-background-color': string; // 背景色
  '--lcv-background-brightness'?: string; // 背景色の明度(ジェネレーター用)
  '--lcv-background-opacity'?: string; // 背景色の不透明度(ジェネレーター用)
 };
 image: {
  Default: string; // defaultは必須
  [key: string]: string; // 追加のキーに対応
 };
 party: string[]; // キャラクター表示時、WordPartyを発動させるキー群
}

// ---

export interface ScriptsType extends PresetType {
 func: ScriptsParamType;
 scriptParams: ScriptParam[];
 placeholders: ScriptParam[];
}

// Script全体の型定義
export type ScriptsParamType = (
 game: GameType,
 comment?: Comment,
 params?: { [id: string]: string | number | boolean }
) => ScriptsReturnType;

// Scriptの返り値
export interface ScriptsReturnType {
 postArray?: OneCommePostType[];
 placeholder: { [id: string]: string | number };
 game: GameType;
}

// gameのパラメータ設定用
export interface ScriptParam extends BaseType {
 type?: 'string' | 'number' | 'boolean'; // valueのタイプ(デフォルトはstring)
 value: string | number | boolean; // 入る値
}
