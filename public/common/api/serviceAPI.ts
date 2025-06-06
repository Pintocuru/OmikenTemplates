// src/Modules/api/ServiceAPI.ts
import { SETTINGS } from '../settings';
import { systemMessage } from './ErrorHandler';
import { Service } from '@onecomme.com/onesdk/types/Service';
import { RGBColor } from '@onecomme.com/onesdk/types/Color';
import OneSDK from '@onecomme.com/onesdk';

/**
 * わんコメのサービス（枠）を管理するAPIクラス
 *
 * 主な機能：
 * - サービス一覧の取得
 * - 新しいサービスの作成（おみくじBOT用）
 * - 定期的なサービス情報の取得（ポーリング）
 *
 * TODO: 2025/03/02 更新
 */
export class ServiceAPI {
 // API エンドポイント
 private readonly servicesURL: string = `${SETTINGS.BASE_URL}/services`;

 // ポーリング関連のプロパティ
 private intervalId: ReturnType<typeof setInterval> | null = null;
 private intervalMs: number = 10000; // デフォルト間隔（10秒）
 private onFetchCallback?: (services: Service[] | null) => void;

 /**
  * わんコメのサービス（枠）一覧を取得
  *
  * @returns {Promise<Service[] | null>} サービス一覧。取得失敗時はnull
  */
 async getServices(): Promise<Service[] | null> {
  try {
   const services = await OneSDK.getServices();

   // コールバックが設定されている場合は実行
   this.onFetchCallback?.(services);

   return services;
  } catch (err) {
   console.info('わんコメの枠情報取得に失敗しました。', err);
   return null;
  }
 }

 /**
  * わんコメの新しいサービス（枠）を作成
  * おみくじBOT用に特化した設定で作成される
  *
  * @param {string} name - サービス名（「おみくじBOT:」が自動で前に付く）
  * @param {string} frameId - フレームID（英数字4文字以上）
  * @param {string} color - カラーコード（#から始まる6桁のHEX）
  * @returns {Promise<Service | null>} 作成されたサービス。失敗時はnull
  */
 async createService(name: string, frameId: string, color: string): Promise<Service | null> {
  try {
   // frameIdの妥当性をチェック
   this.validateFrameId(frameId);

   // わんコメAPIにPOSTリクエストを送信
   const response = await OneSDK.post(this.servicesURL, {
    data: {
     id: frameId,
     name: `おみくじBOT:${name}`, // おみくじBOT用の命名規則
     speech: true, // 音声読み上げを有効にする
     color: this.color2RGB(color) // HEXカラーをRGB形式に変換
    },
    headers: { 'Content-Type': 'application/json' }
   });

   // レスポンスデータの存在確認
   if (!response.data) {
    throw new Error('サービス作成: レスポンスにデータがありません');
   }

   return response.data as Service;
  } catch (error) {
   // エラーログを出力してnullを返す
   systemMessage('warn', `わんコメの枠を作成できませんでした`, error);
   return null;
  }
 }

 /**
  * フレームIDの妥当性を検証
  *
  * 検証ルール：
  * - null/undefined/空文字でないこと
  * - 英数字のみであること
  * - 4文字以上であること
  *
  * @param {string} frameId - 検証対象のフレームID
  * @throws {Error} 無効なframeIdの場合
  * @private
  */
 private validateFrameId(frameId: string): void {
  if (!frameId) {
   throw new Error('frameIdが空です。Charasのデータを修正してください。');
  }

  if (!/^[a-zA-Z0-9]+$/.test(frameId)) {
   throw new Error('frameIdは英数字のみ使用可能です。Charasのデータを修正してください。');
  }

  if (frameId.length < 4) {
   throw new Error('frameIdは4文字以上である必要があります。Charasのデータを修正してください。');
  }
 }

 /**
  * HEXカラーコードをRGBColor型に変換
  *
  * @param {string} colorCode - HEXカラーコード（#付きまたは無し）
  * @returns {RGBColor} RGB値のオブジェクト
  * @throws {Error} 無効なカラーコードの場合
  * @private
  */
 private color2RGB(colorCode: string): RGBColor {
  // #記号を除去
  const hex = colorCode.replace(/^#/, '');

  // 6桁のHEXコードかチェック
  if (hex.length !== 6) {
   throw new Error(`無効なカラーコードです: ${colorCode}（6桁のHEX形式で入力してください）`);
  }

  // 16進数から10進数に変換
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return { r, g, b };
 }

 /**
  * サービス情報の定期取得を開始（ポーリング）
  *
  * @param {function} [callback] - 取得完了時に呼び出されるコールバック関数
  * @param {number} [intervalMs=10000] - 取得間隔（ミリ秒）
  * @returns {this} メソッドチェーン用
  */
 startPolling(callback?: (services: Service[] | null) => void, intervalMs: number = 10000): this {
  // 既存のポーリングがあれば停止
  this.stopPolling();

  // ポーリング設定を更新
  this.intervalMs = intervalMs;
  if (callback) {
   this.onFetchCallback = callback;
  }

  // 初回実行（即座に1回取得）
  this.getServices();

  // 定期実行のセットアップ
  this.intervalId = setInterval(() => {
   this.getServices();
  }, this.intervalMs);

  return this; // メソッドチェーン対応
 }

 /**
  * サービス情報の定期取得を停止
  *
  * @returns {this} メソッドチェーン用
  */
 stopPolling(): this {
  if (this.intervalId !== null) {
   clearInterval(this.intervalId);
   this.intervalId = null;
  }
  return this; // メソッドチェーン対応
 }
}
