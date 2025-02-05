// src/components/suika/composables/useCommentHandler.ts
import type { CommentChara } from '@common/commonTypes';
import type { SuikaVisitType, SuikaGameType } from './type';
import { SETTINGS } from '@common/settings';
import GouseiSuika from './Scripts/GouseiSuika';
import NewGamesIncrements from './Scripts/NewGamesIncrements';
import { PostMessage } from '@common/api/PostMessage';
import { postSystemMessage } from '@common/api/PostOneComme';
import { GameType } from '@common/types';

export function useCommentHandler(gameState: SuikaGameType) {
 const userVisits = reactive<Record<string, SuikaVisitType>>({});

 // スイカゲームを行う
 function handleComment(comment: CommentChara) {
  if (comment.data.userId === SETTINGS.BOT_USER_ID) return null;

  const { userId } = comment.data;
  const visit = userVisits[userId] || {
   userId,
   name: comment.data.displayName,
   draws: 0,
   isRanking: true
  };

  try {
   // gameState とユーザーの各drawsをインクリメント
   const newGame = NewGamesIncrements.func(gameState as GameType, comment).game;
   Object.assign(gameState, newGame);
  } catch (e) {
   console.error('Comment handling error:', e);
   return null;
  }

  try {
   // gameState とユーザーの各drawsをインクリメント
   const newGame = NewGamesIncrements.func(gameState as GameType, comment).game;

   // スイカゲームを行う
   const result = GouseiSuika.func(newGame, comment, {
    mode: comment.userWordMatchId === 'kabo' ? 1 : comment.userWordMatchId === 'kujira' ? 2 : 0,
    isRank: visit.draws <= 5 || comment.data.hasGift, // 5回以下、またはギフトがあるならランキングイン
    isFruit: true
   });

   // WordParty
   if (result.postArray) new PostMessage(result.postArray).post;
   // 結果をコメントテスターで投稿
   postResults(comment, result.placeholder);

   return result.game;
  } catch (e) {
   console.error('Comment handling error:', e);
   return null;
  }
 }

 function postResults(comment: CommentChara, placeholder: { [id: string]: string | number }) {
  if (!placeholder) return;

  postSystemMessage(placeholder.message as string, ' ', 3.5);
  postSystemMessage(
   `${comment.data.name}の${placeholder.points}は、${placeholder.winsRank}位だよ。`,
   ' ',
   8
  );
 }

 return {
  handleComment,
  userVisits
 };
}
