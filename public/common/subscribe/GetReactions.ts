// common/subscribe/GetReactions.ts
import { PingOneSDK } from '../api/PingOneSDK';
import OneSDK from '@onecomme.com/onesdk';
import { Reaction } from '@onecomme.com/onesdk/types/Comment';

export async function GetReactions(callback: (comments: Reaction[]) => void): Promise<boolean> {
 // 初期化・コメントの購読
 try {
  // わんコメの枠情報を取得(ping)
  if (!(await PingOneSDK())) return false;

  await OneSDK.setup({ permissions: OneSDK.usePermission([OneSDK.PERM.REACTION]) });
  await OneSDK.connect();
  OneSDK.subscribe({
   action: 'reactions',
   callback: (reactions: Reaction[]) => callback(reactions)
  });
  return true; // 初期化成功
 } catch (error) {
  console.error('OneSDK初期化エラー:', error);
  return false; // 初期化失敗
 }
}
