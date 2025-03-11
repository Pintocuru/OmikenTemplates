// common/subscribe/GetMetas.ts
import { readonly, ref } from 'vue';
import { PingOneSDK } from '../api/PingOneSDK';
import { ServiceMeta } from '@onecomme.com/onesdk/types/Service';
import OneSDK from '@onecomme.com/onesdk';

export function GetMetas(num: number = 0) {
 // metaデータ(配信名、開始時間、フォロワー、視聴数、高評価数、ギフト金額)
 const metaRef = ref<ServiceMeta | null>(null);
 let pollingInterval: ReturnType<typeof setInterval> | null = null;

 // 3秒ごとに枠情報を更新
 const startPolling = () => {
  stopPolling(); // 既存のポーリングを停止
  pollingInterval = setInterval(async () => {
   const services = await OneSDK.getServices();
   if (services && services.length > 0) {
    const liveServices = services.filter((service) => service.meta?.isLive);
    metaRef.value = liveServices[num]?.meta ?? null;
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
 const fetchMeta = async (callback?: (meta: ServiceMeta | null) => void): Promise<boolean> => {
  // わんコメの枠情報を取得(ping)
  if (!(await PingOneSDK())) return false;

  // 外部から処理を追加するcallback
  if (callback) callback(metaRef.value);

  startPolling();
  return true;
 };

 return {
  metaRef: readonly(metaRef),
  fetchMeta,
  stopPolling
 };
}
