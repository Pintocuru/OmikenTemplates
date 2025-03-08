// common/subscribe/GetComments.ts
import { ServiceAPI } from '../api/ServiceAPI';
import { GetHttpApi } from '../api/GetHttpApi';
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
  const service = await new ServiceAPI().getServices();
  if (!service) {
   console.info('わんコメの起動を確認できませんでした。通常モードで起動します。');
   return false;
  }
  console.info('わんコメの購読を開始します。');

  await OneSDK.setup({
   permissions: OneSDK.usePermission([OneSDK.PERM.COMMENT]),
   mode: isDiff ? 'diff' : 'all'
  });
  await OneSDK.connect();

  // 通常モードなら初期読み込み
  if (isFirstComment) callback(await GetHttpApi('comments'));

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
