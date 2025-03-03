// common/subscribe/GetComments.ts
import { ref } from 'vue';
import { GetHttpApi } from '../api/GetHttpApi';
import OneSDK from '@onecomme.com/onesdk';
import { Comment } from '@onecomme.com/onesdk/types/Comment';

export function GetComments(isFirstComment: boolean = false) {
 // ref/computed
 const newComments = ref<Comment[]>([]);
 const isInitFlag = ref<boolean>(true); // 初期化フラグ

 // 初期化・コメントの購読
 const initOneSDK = async (IS_DIFF_MODE: boolean) => {
  try {
   await OneSDK.setup({
    permissions: OneSDK.usePermission([OneSDK.PERM.COMMENT]),
    mode: 'diff'
   });
   await OneSDK.connect();

   // 通常モードなら初期読み込み
   if (isFirstComment) newComments.value = await GetHttpApi('comments');

   OneSDK.subscribe({
    action: 'comments',
    callback: (comments: Comment[]) => {
     newComments.value = comments;
     // DIFF_MODEに基づいて結果を返す
     newComments.value = IS_DIFF_MODE
      ? comments // 上書きモードでは新しいコメントのみ返す
      : mergeComments(newComments.value, comments); // 追加モードでは既存のものと結合
    }
   });
  } catch (error) {
   console.error('OneSDK初期化エラー:', error);
   isInitFlag.value = false; // 初期化NGフラグ
   throw new Error('OneSDK initialization failed');
  }
 };

 return {
  isInitFlag, // 初期化フラグ
  initOneSDK, // わんコメの購読に必須
  newComments // すべてのコメント
 };
}

// 新しいコメントを既存のコメントに追加（重複排除）
function mergeComments(existingComments: Comment[], newComments: Comment[]): Comment[] {
 const existingIds = new Set(existingComments.map((c) => c.data.id));
 return [...existingComments, ...newComments.filter((c) => !existingIds.has(c.data.id))];
}
