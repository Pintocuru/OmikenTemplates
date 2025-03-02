// src/Modules/api/serviceAPI.ts
import { SETTINGS } from '../settings';
import { systemMessage } from './ErrorHandler';
import { Service } from '@onecomme.com/onesdk/types/Service';
import { RGBColor } from '@onecomme.com/onesdk/types/Color';
import OneSDK from '@onecomme.com/onesdk';

// TODO:250302 更新
export class ServiceAPI {
 private readonly servicesURL: string = `${SETTINGS.BASE_URL}/services`;
 private intervalId: ReturnType<typeof setInterval> | null = null;
 private intervalMs: number = 10000; // デフォルト間隔
 private onFetchCallback?: (services: Service[] | null) => void;

 // 枠情報を取得
 async getServices(): Promise<Service[] | null> {
  try {
   const response = await OneSDK.get(this.servicesURL, {});

   if (response.status !== 200) {
    console.warn('枠情報取得: 無効なステータスコード', response.status);
    return null;
   }

   const services = JSON.parse(response.data.response) as Service[];

   // TODO:データが期待通りなら下記の検証コードを削除
   if (!Array.isArray(services)) {
    console.warn('枠情報取得: 無効なデータ形式', services);
    return null;
   }

   // コールバックがあれば実行
   if (this.onFetchCallback) {
    this.onFetchCallback(services);
   }

   return services;
  } catch (err) {
   console.info('枠情報取得に失敗。再試行予定…', err);
   return null;
  }
 }

 // わんコメの枠を作成
 async createService(name: string, frameId: string, color: string): Promise<Service | null> {
  try {
   // frameIdの検証
   this.validateFrameId(frameId);

   // POSTリクエストを送信
   const response = await OneSDK.post(this.servicesURL, {
    data: {
     id: frameId,
     name: `おみくじBOT:${name}`,
     speech: true,
     color: this.color2RGB(color)
    },
    headers: { 'Content-Type': 'application/json' }
   });

   if (!response.data) {
    throw new Error('サービス作成: レスポンスにデータがありません');
   }

   return response.data as Service;
  } catch (error) {
   // エラーハンドリング
   systemMessage('warn', `わんコメの枠を作成できませんでした`, error);
   return null;
  }
 }

 // frameIdの検証
 private validateFrameId(frameId: string): void {
  if (
   !frameId || // null, undefined, 空文字を除外
   !/^[a-zA-Z0-9]+$/.test(frameId) || // 英数字以外を除外
   frameId.length < 4 // 長さが3文字以下を除外
  )
   throw new Error('無効なframeIdです。Charasのデータを修正してください。');
 }

 // カラーコードからRGBColor型のコードを生成
 private color2RGB(colorCode: string): RGBColor {
  const hex = colorCode.replace(/^#/, '');
  if (hex.length !== 6) throw new Error(`Invalid color code: ${colorCode}`);
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return { r, g, b };
 }

 // フレームデータを定期取得(Default:10秒)
 startPolling(callback?: (services: Service[] | null) => void, intervalMs: number = 10000): this {
  // 既存のインターバルがあれば停止
  this.stopPolling();

  this.intervalMs = intervalMs;

  if (callback) {
   this.onFetchCallback = callback;
  }

  // 初回実行
  this.getServices();

  // 定期実行のセットアップ
  this.intervalId = setInterval(() => {
   this.getServices();
  }, this.intervalMs);

  return this;
 }

 // フレームデータの取得を停止
 stopPolling(): this {
  if (this.intervalId !== null) {
   clearInterval(this.intervalId);
   this.intervalId = null;
  }
  return this;
 }
}
