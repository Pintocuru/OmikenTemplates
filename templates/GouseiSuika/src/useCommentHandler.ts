// src/components/suika/composables/useCommentHandler.ts
import { GameType } from '@common/types';
import type { SuikaGameType } from './type';
import type { CommentChara } from '@common/commonTypes';
import { SETTINGS } from '@common/settings';
import { PostMessage } from '@common/api/PostMessage';
import { postSystemMessage } from '@common/api/PostOneComme';
import GouseiSuika from './Scripts/GouseiSuika';
import NewGamesIncrements from './Scripts/NewGamesIncrements';

export function useCommentHandler(gameState: SuikaGameType) {
 // スイカゲームのコメント処理
 function playSuikaGame(comment: CommentChara) {
  const { userWordMatchId } = comment;
  const { userId, hasGift, name } = comment.data;
  if (userId === SETTINGS.BOT_USER_ID) return null;

  try {
   // gameState を更新し、ユーザーの draws を取得
   const newGame = NewGamesIncrements.func(gameState as GameType, comment).game;
   const userDraws = newGame.userStats[userId].draws;

   // `mode` の設定をオブジェクトマップで整理
   const modeMap: Record<string, number> = { kabo: 1, kujira: 2 };
   const mode = modeMap[userWordMatchId ?? ''] ?? 0;

   // ランキングインの判定
   const isEligibleForRank = userDraws <= 5 || hasGift;

   // スイカゲームを実行
   const result = GouseiSuika.func(newGame, comment, {
    mode,
    isRank: isEligibleForRank,
    isFruit: true
   });

   // WordParty メッセージを投稿
   if (result.postArray && result.postArray.length > 0) {
    new PostMessage(result.postArray).post;
   }

   // 結果を投稿
   postResults(name, result.placeholder);

   return result.game;
  } catch (e) {
   console.error('Comment handling error:', e);
   return null;
  }
 }

 function postResults(userName: string, placeholder: { [id: string]: string | number }) {
  if (!placeholder || Object.keys(placeholder).length === 0) return;

  postSystemMessage(placeholder.message as string, ' ', 3.5);
  postSystemMessage(
   `${userName} の ${placeholder.points} は、${placeholder.winsRank} 位だよ。`,
   ' ',
   8
  );
 }

 return { playSuikaGame };
}
