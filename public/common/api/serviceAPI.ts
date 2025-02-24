// src/Modules/api/serviceAPI.ts
import { SETTINGS } from '../settings';
import { systemMessage } from './ErrorHandler';
import { Service } from '@onecomme.com/onesdk/types/Service';
import { RGBColor } from '@onecomme.com/onesdk/types/Color';

export class ServiceAPI {
 // 枠情報を取得
 async getServices(): Promise<Service[] | null> {
  try {
   const response = await fetch(`${SETTINGS.BASE_URL}/services`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
   });

   if (!response.ok) {
    throw new Error(`HTTPエラー: ${response.status} ${response.statusText}`);
   }

   const data = await response.json();
   return data as Service[];
  } catch (error) {
   console.info('枠情報取得に失敗。再度枠情報を取得中…', error);
   return null;
  }
 }

 // わんコメの枠を作成
 async createService(name: string, frameId: string, color: string): Promise<Service | null> {
  try {
   // frameIdの検証
   if (
    !frameId || // null, undefined, 空文字を除外
    !/^[a-zA-Z0-9]+$/.test(frameId) || // 英数字以外を除外
    frameId.length < 4 // 長さが3文字以下を除外
   ) {
    throw new Error('無効なframeIdです。');
   }

   // POSTリクエストを送信
   const response = await fetch(`${SETTINGS.BASE_URL}/services`, {
    method: 'POST',
    headers: {
     'Content-Type': 'application/json' // JSONデータを送信する場合のヘッダー
    },
    body: JSON.stringify({
     id: frameId,
     name: `おみくじBOT:${name}`,
     speech: true,
     color: this.colorCodeToRGBColor(color) // 必要なデータを設定
    })
   });

   // レスポンスの確認
   if (!response.ok) {
    throw new Error(`HTTPエラー: ${response.status} ${response.statusText}`);
   }

   // レスポンスデータを取得
   const data = await response.json();
   return data as Service;
  } catch (error) {
   // エラーハンドリング
   systemMessage('warn', `わんコメの枠を作成できませんでした`, error);
   return null;
  }
 }

 // カラーコードからRGBColor型のコードを生成
 private colorCodeToRGBColor(colorCode: string): RGBColor {
  const hex = colorCode.replace(/^#/, '');
  if (hex.length !== 6) throw new Error(`Invalid color code: ${colorCode}`);
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return { r, g, b };
 }
}
