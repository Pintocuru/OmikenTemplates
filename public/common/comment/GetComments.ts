// common/comment/GetComments.ts
import { ref } from 'vue';
import OneSDK from '@onecomme.com/onesdk';
import { Comment } from '@onecomme.com/onesdk/types/Comment';

export function GetComments() {
 // ref/computed
 const newComments = ref<Comment[]>([]);
 const isInitFlag = ref<boolean>(true); // 初期化フラグ

 // 初期化・コメントの購読
 const initOneSDK = async (IS_DIFF_MODE: boolean) => {
  try {
   await OneSDK.setup({
    permissions: OneSDK.usePermission([OneSDK.PERM.COMMENT]),
    mode: IS_DIFF_MODE ? 'diff' : 'all'
   });
   await OneSDK.connect();

   OneSDK.subscribe({
    action: 'comments',
    callback: (comments: Comment[]) => {
     newComments.value = comments;
    }
   });
  } catch (error) {
   console.error('OneSDK初期化エラー:', error);
   isInitFlag.value = false; // 初期化NGフラグ
   throw new Error('OneSDK initialization failed');
  }
 };

 return {
  isInitFlag: readonly(isInitFlag), // 初期化フラグ
  initOneSDK, // わんコメの購読に必須
  newComments: readonly(newComments) // すべてのコメント
 };
}
