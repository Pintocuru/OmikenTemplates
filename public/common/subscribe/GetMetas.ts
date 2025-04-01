// common/subscribe/GetMetas.ts
import { PingOneSDK } from '../api/PingOneSDK';
import { ServiceMeta } from '@onecomme.com/onesdk/types/Service';
import OneSDK from '@onecomme.com/onesdk';

export function GetMetas(num: number = 0) {
 // metaデータのキャッシュ
 let metaCache: ServiceMeta | null = null;
 let pollingInterval: ReturnType<typeof setInterval> | null = null;

 // 更新を通知するコールバック（登録されていれば）
 let updateCallback: ((meta: ServiceMeta | null) => void) | null = null;

 // 3秒ごとに枠情報を更新
 const startPolling = (callback: (meta: ServiceMeta | null) => void) => {
  // コールバックを保存
  updateCallback = callback;

  // 既存のポーリングを停止
  stopPolling();

  // ポーリング開始
  pollingInterval = setInterval(async () => {
   const services = await OneSDK.getServices();
   if (services && services.length > 0) {
    const liveServices = services.filter((service) => service.meta?.isLive);
    metaCache = liveServices[num]?.meta ?? null;

    // 更新時にコールバックを実行
    if (updateCallback) updateCallback(metaCache);
   }
  }, 3000);
 };

 const stopPolling = () => {
  if (pollingInterval) {
   clearInterval(pollingInterval);
   pollingInterval = null;
  }
 };

 // メタ情報を取得し、更新する関数
 const fetchMeta = async (callback: (meta: ServiceMeta | null) => void): Promise<boolean> => {
  // わんコメの枠情報を取得(ping)
  if (!(await PingOneSDK())) return false;

  // 初回のデータ取得
  try {
   const services = await OneSDK.getServices();
   if (services && services.length > 0) {
    const liveServices = services.filter((service) => service.meta?.isLive);
    metaCache = liveServices[num]?.meta ?? null;
   }
  } catch (error) {
   console.error('Error fetching initial meta data:', error);
  }

  // コールバックで初期データを通知
  callback(metaCache);

  // ポーリングを開始
  startPolling(callback);
  return true;
 };

 // 現在のキャッシュされたメタ情報を取得
 const getCurrentMeta = (): ServiceMeta | null => {
  return metaCache;
 };

 return {
  fetchMeta,
  stopPolling,
  getCurrentMeta
 };
}
