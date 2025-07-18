// src/ConfigMaker/script/useTestPost.ts - テスト投稿用
import { computed } from 'vue';
import {
 OmikujiSetSchema,
 PostActionType,
 BotMessage,
 OmikujiSetType,
 CommentRuleType
} from '@type/';
import { ScriptManager } from '@/MainGenerator/utils/ScriptManager';
import { UserCommentProcessor } from '@/MainGenerator/utils/UserCommentProcessor';
import { mockComment } from '@public/common/mockOneCommeData';
import { useOmikujiStore } from '@ConfigScript/useOmikujiStore';
import { useTimerRulesStore } from '@ConfigScript/useTimerRulesStore';
import { useCommentRulesStore } from '@ConfigScript/useCommentRulesStore';
import { toast } from 'vue-sonner';
import { drawOmikuji } from '@/MainGenerator/utils/PlayOmikuji';

export function useTestPost() {
 const omikujiStore = useOmikujiStore();
 const commentRulesStore = useCommentRulesStore();
 const timerRulesStore = useTimerRulesStore();

 // 選択されているルールをコメントルールまたはタイマールールから取得するように変更
 const selectedRuleForProcessing = computed(() => {
  return commentRulesStore.selectedRule || timerRulesStore.selectedRule;
 });

 const toastTestPost = async (posts: BotMessage[]): Promise<void> => {
  try {
   await Promise.all(
    posts.map(
     (post) =>
      new Promise<void>((resolve) => {
       setTimeout(() => {
        if (post.comment !== '') toast.success(post.comment);
        resolve();
       }, post.delaySeconds * 1000);
      })
    )
   );
  } catch (error) {
   console.error('メッセージ投稿処理のトースト表示中にエラーが発生しました:', error);
   toast.error('テスト投稿の表示中にエラーが発生しました。');
  }
 };

 const postTestOmikujiItem = (actions: PostActionType[]) => {
  // selectedRuleForProcessing を使用して、どちらかのルールが存在するかチェック
  if (!selectedRuleForProcessing.value) {
   toast.error('テスト投稿の対象となるルールが選択されていません。'); // ユーザーにフィードバックを追加
   return;
  }

  const scriptManager = new ScriptManager(omikujiStore.data);
  const userCommentProcessor = new UserCommentProcessor(omikujiStore.data, scriptManager);

  const botMessageArray = userCommentProcessor.executeOmikujiProcess(
   mockComment,
   selectedRuleForProcessing.value as CommentRuleType, // timerでもテストデータなら問題ないのでアサーション
   OmikujiSetSchema.parse({ postActions: actions }),
   false
  );

  toastTestPost(botMessageArray);
 };

 const postTestOmikuji = (omikujis: OmikujiSetType[]) => {
  const omikujiItem = drawOmikuji(omikujis) as OmikujiSetType;
  if (!omikujiItem) {
   toast.error('該当するおみくじがありませんでした。');
   return;
  }

  postTestOmikujiItem(omikujiItem.postActions);
 };

 return {
  postTestOmikuji,
  postTestOmikujiItem,
  toastTestPost
 };
}
