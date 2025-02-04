// common/GetServiceMeta.ts
import { ConfigType } from './commonTypes';
import OneSDK from '@onecomme.com/onesdk';
import { Service, ServiceMeta } from '@onecomme.com/onesdk/types/Service';

export function GetServiceMeta(config: ConfigType) {
 const newMeta = ref<ServiceMeta>({});

 // 初期化・コメントの購読
 const initOneSDKMeta = async () => {
  try {
   await OneSDK.setup({ permissions: OneSDK.usePermission([OneSDK.PERM.META]) });
   await OneSDK.connect();
   OneSDK.subscribe({
    action: 'meta',
    callback: (data: { service: Service; data: ServiceMeta }) => (newMeta.value = data.data)
   });
  } catch (error) {
   console.error('OneSDK初期化エラー:', error);
   throw new Error('OneSDK initialization failed');
  }
 };

 return {
  initOneSDKMeta, // わんコメの購読に必須
  newMeta // 配信枠の情報
 };
}
