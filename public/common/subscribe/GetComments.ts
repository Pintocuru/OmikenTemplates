// common/subscribe/GetComments.ts
import { PingOneSDK } from '../api/PingOneSDK';
import OneSDK from '@onecomme.com/onesdk';
import { Comment } from '@onecomme.com/onesdk/types/Comment';

// commentsの購読
export async function GetComments(
 isDiff: boolean = true,
 isFirstComment: boolean = false,
 callback: (comments: Comment[]) => void
): Promise<boolean> {
 try {
  // わんコメの枠情報を取得(ping)
  if (!(await PingOneSDK())) return false;

  await OneSDK.setup({
   permissions: OneSDK.usePermission([OneSDK.PERM.COMMENT]),
   mode: isDiff ? 'diff' : 'all'
  });
  await OneSDK.connect();

  // 通常モードなら初期読み込み
  if (isFirstComment) callback(await OneSDK.getComments());

  OneSDK.subscribe({
   action: 'comments',
   callback: (comments: Comment[]) => callback(comments)
  });

  return true; // 初期化成功
 } catch (error) {
  console.error('OneSDK 初期化エラー:', error);
  return false; // 初期化失敗
 }
}
