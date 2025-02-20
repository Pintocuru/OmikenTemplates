// common/GetReactions.ts
import { ConfigType } from './commonTypes';
import OneSDK from '@onecomme.com/onesdk';
import { Reaction } from '@onecomme.com/onesdk/types/Comment';

export function GetServiceReactions(config: ConfigType) {
 const newReactions = ref<Reaction[]>([]);

 // 初期化・コメントの購読
 const initOneSDKMeta = async () => {
  try {
   await OneSDK.setup({ permissions: OneSDK.usePermission([OneSDK.PERM.REACTION]) });
   await OneSDK.connect();
   OneSDK.subscribe({
    action: 'reactions',
    callback: (reactions: Reaction[]) => (newReactions.value = reactions)
   });
  } catch (error) {
   console.error('OneSDK初期化エラー:', error);
   throw new Error('OneSDK initialization failed');
  }
 };

 return {
  initOneSDKMeta, // わんコメの購読に必須
  newReactions // 配信枠の情報
 };
}
