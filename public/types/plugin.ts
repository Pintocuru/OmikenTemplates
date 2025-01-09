// src/types/plugin.ts

import { OmikenType, OmikujiType, RulesType, TypesType } from './Omiken';
import { CharaType, ScriptsParamType, ScriptsType } from './preset';
import { Service } from '@onecomme.com/onesdk/types/Service';
import { BaseResponse } from '@onecomme.com/onesdk/types/BaseResponse';
import { Comment } from '@onecomme.com/onesdk/types/Comment';
import { UserNameData } from '@onecomme.com/onesdk/types/UserData';

// ---------------------------------------------------

// ElectronStore用の型
export interface StoreType {
 store: any; // ElectronStore不具合のためany ElectronStore<StoreType>
 Omiken: OmikenType;
 Visits: Record<string, VisitType>;
 Games: Record<string, GameType>;
}

// おみくじBOT用の型
export interface StoreMainType extends StoreType {
 OmikenTypesArray?: Record<TypesType, RulesType[]>;
 Charas: Record<string, CharaType>;
 Scripts: Record<string, ScriptsType>;
 TimeConfig: TimeConfigType;
}

// API用の型
export interface StoreApiType extends StoreType {
 Presets: Readonly<Record<string, OmikenType>>;
 Charas: Record<string, CharaType>;
 Scripts: Record<string, ScriptsType>;
}

// 全体設定用の型
export interface StoreAllType extends StoreMainType {
 Presets: Record<string, OmikenType>;
 filterCommentProcess(comment: Comment, userData: UserNameData): void;
 timerSelector: any;
}

// プラグインのデータを更新するreturn用の型
export interface PluginUpdateData {
 Games?: Record<string, GameType>;
 Visits?: Record<string, VisitType>;
 TimeConfig?: TimeConfigType;
}

// ---

// ユーザーデータ(全体)
export interface VisitType {
 name: string; // ユーザー名(ニックネーム)
 userId: string; // ユーザーID
 round: number; // コメントした配信枠の数
 status: string; // 任意のステータス(共通)
 point: number; // 任意のポイント(共通)
 lastPluginTime: number; // 前回コメントした配信枠のactiveTime
}

// draws基礎
interface DrawsBase {
 draws: number; // 該当するおみくじを行った配信枠での回数
 totalDraws: number; // 該当するおみくじを行った総回数
}

// おみくじデータ
export interface GameType extends DrawsBase {
 ruleId: string; // rulesのID
 [key: string]: unknown; // scriptで自由に使えるObject
 userStats: {
  [userId: string]: UserStatsType;
 };
}

// ユーザーデータ(個別)
export interface UserStatsType extends DrawsBase {
 userId: string;
 [key: string]: number | string | boolean | undefined;
}

// ---

// 選択したおみくじ
export interface OmikujiSelectType extends OmikujiType {
 selectRuleId: string; // 選択されたルールのid
}

// TimeConfig
export interface TimeConfigType {
 pluginTime: number; // プラグインを起動した時刻
 lc: number; // プラグインを起動してからカウントしたコメント数
 lastTime: number; // 最後におみくじ機能が実行された時刻
 lastUserId: string; // 最後におみくじを行ったuserId
}

// ---

// わんコメにpostする際の型定義
export interface postOneCommeRequestType {
 service: Pick<Service, 'id' | 'translate'>;
 comment: Pick<
  BaseResponse,
  | 'id' // 一意のID
  | 'userId' //
  | 'name' // 表示名
  | 'nickname' // ユーザーネームの変更、nameを表示させたいが読み上げさせない時に使う
  | 'comment' // コメント
  | 'profileImage' // アイコン
  | 'badges' // メンバーやモデレーター等の表示用バッジ
  | 'liveId' // 【仕様とは異なる】 ジェネレーターに渡す引数(generatorParam)
  | 'isOwner' // 【仕様とは異なる】 BOTの読み上げを行わない(isSilent)
 >;
}
/*
プラグインで使えるキー/仕様変更で使えなくなる可能性あり
service.translate(string[])
comment.isOwner(boolean)
comment.isFirstTime(boolean)
comment.isRepeater(boolean)

・BaseResponse にはないキー
comment.colors(Colors)


timestamp 変更する理由がない
hasGift(boolean): ギフトで使用
commentVisible(boolean): プラグインのfilter.commentでfalseする効果と同じ

効かなかったリスト
speechText
originalProfileImage
meta

*/

// ---

// API用

// パラメータの型定義
export type ParamsType = PingModeParams | DataModeParams | AllDataModeParams | BackupModeParams;

// Ping用型定義
interface PingModeParams {
 method: 'GET';
 mode: Mode.Ping;
 type?: never;
}

// データ取得用型定義
interface DataModeParams {
 method: 'GET';
 mode: Mode.Data;
 type: DataType.Omiken | DataType.Presets | DataType.Charas | DataType.Scripts | DataType.Visits | DataType.Games;
}

// 一括でのデータ取得用型定義
interface AllDataModeParams {
 method: 'GET';
 mode: Mode.AllData;
 type?: never;
}

// バックアップ用型定義
interface BackupModeParams {
 method: 'POST';
 mode: Mode.Backup;
 type: DataType.Omiken | DataType.Presets;
}

// モードを定義
export enum Mode {
 Ping = 'ping', // データ取得
 Data = 'data', // データ取得
 Backup = 'backup', // バックアップ(エディター用)
 AllData = 'allData' // すべてのデータ取得
}

// データの種類を定義
export enum DataType {
 Omiken = 'Omiken', // おみくじデータ
 Presets = 'Presets', // preset(おみくじデータ)
 Charas = 'Charas', // キャラデータ
 Scripts = 'Scripts', // スクリプト
 Visits = 'Visits', // 個人データ
 Games = 'Games' // スクリプトデータ
}
