// src/Modules/api/ServiceAPI.ts

export async function PingOneSDK(): Promise<boolean> {
 const controller = new AbortController();
 const timeout = setTimeout(() => controller.abort(), 1000); // 1秒でタイムアウト

 try {
  const response = await fetch('http://localhost:11180/api/info', {
   signal: controller.signal // AbortControllerを使用
  });
  clearTimeout(timeout); // タイムアウトをクリア

  if (response.ok) {
   console.info('わんコメ起動OK');
   return true;
  } else {
   console.warn(`サーバーエラー: ステータスコード ${response.status}`);
   return false;
  }
 } catch (err) {
  console.info('わんコメ起動なし');
  return false; // 接続できなければ false
 }
}
