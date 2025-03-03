// src/Modules/api/GetHttpApi.ts
import OneSDK from '@onecomme.com/onesdk';

// わんコメからAPI経由でデータを取得
export async function GetHttpApi(url: string): Promise<any> {
 try {
  const response = await OneSDK.get(`http://localhost:11180/api/${url}`, {});

  if (response.status !== 200) {
   console.warn('枠情報取得: 無効なステータスコード', response.status);
   return null;
  }

  return response.data;
 } catch (err) {
  console.error('APIリクエストエラー', err);
  return null;
 }
}
