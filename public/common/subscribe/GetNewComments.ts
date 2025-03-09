// common/subscribe/GetNewComments.ts
import { ref } from 'vue';
import { GetComments } from './GetComments';
import { Comment } from '@onecomme.com/onesdk/types/Comment';

export function GetNewComments(isDiff: boolean = false) {
 // ref
 const newComments = ref<Comment[]>([]);

 const fetchComments = async (callback?: (comments: Comment[]) => void): Promise<boolean> => {
  return await GetComments(isDiff, false, (comments) => {
   // DIFF_MODEに基づいて結果を返す
   newComments.value = isDiff
    ? comments // 上書きモード
    : mergeComments(newComments.value, comments); // 追加モード

   // 外部から処理を追加するcallback
   if (callback) callback(comments);
  });
 };

 return {
  newComments, // すべてのコメント
  fetchComments // 初期化
 };
}

// 新しいコメントを既存のコメントに追加（重複排除）
function mergeComments(existingComments: Comment[], newComments: Comment[]): Comment[] {
 const existingIds = new Set(existingComments.map((c) => c.data.id));
 return [...existingComments, ...newComments.filter((c) => !existingIds.has(c.data.id))];
}
