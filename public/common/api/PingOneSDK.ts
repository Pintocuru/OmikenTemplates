// src/Modules/api/PingOneSDK.ts

export async function PingOneSDK(): Promise<boolean> {
 const controller = new AbortController();

 // 1秒後に `AbortController` を発火する Promise
 const timeoutPromise = new Promise<never>((_, reject) => {
  setTimeout(() => {
   controller.abort();
   reject(new Error('Request timeout'));
  }, 1000);
 });

 try {
  const response = await Promise.race([
   fetch('http://localhost:11180/api/info', { signal: controller.signal }),
   timeoutPromise
  ]);

  if ((response as Response).ok) {
   console.info('わんコメ起動OK');
   return true;
  } else {
   console.warn(`サーバーエラー: ステータスコード ${(response as Response).status}`);
   return false;
  }
 } catch (err) {
  console.info('わんコメ起動なし');
  return false;
 }
}
