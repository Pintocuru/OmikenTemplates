// src/MainGenerator/utils/CommentProcessor.ts (修正版)
import { BotMessage } from '@/types/types';
import { OmikujiDataType } from '@/types/OmikujiTypesSchema';
import { UserCommentProcessor } from './UserCommentProcessor';
import { isWithinTimeThreshold } from './CommentProcessorCooldown';
import { BotMessageGenerator } from './CommentProcessorToast';
import { SETTINGS } from '@public/common/settings';
import { Comment } from '@onecomme.com/onesdk/types/Comment';
import { ServiceMeta } from '@onecomme.com/onesdk/types/Service';
import { GetMetas } from '@public/common/subscribe/GetMetas';

export class CommentProcessor {
 serviceMeta: ServiceMeta | null = null; // Metaデータ管理
 private readonly BotMessageGenerator: BotMessageGenerator;
 private readonly userCommentProcessor: UserCommentProcessor;

 constructor(omikujiData: OmikujiDataType) {
  this.BotMessageGenerator = new BotMessageGenerator(omikujiData.characters);
  this.userCommentProcessor = new UserCommentProcessor(omikujiData);
  this.initializeMetaFetcher();
 }

 /**
  * メイン処理: コメントを処理して拡張コメントを作成
  */
 processComments(comments: Comment[]): BotMessage[] {
  if (!comments.length) return [];

  const currentTime = Date.now();
  const botMessages: BotMessage[] = [];

  for (const comment of comments) {
   if (!isWithinTimeThreshold(comment.data.timestamp, currentTime)) continue;

   const processedMessages =
    comment.data.userId === SETTINGS.BOT_USER_ID
     ? this.BotMessageGenerator.processBotComment(comment)
     : // ユーザーコメント処理は UserCommentProcessor に委譲
       this.userCommentProcessor.processUserComment(comment, currentTime, this.serviceMeta);

   if (processedMessages) {
    botMessages.push(
     ...(Array.isArray(processedMessages) ? processedMessages : [processedMessages])
    );
   }
  }
  return botMessages;
 }

 /**
  * ランキングデータ取得 (UserCommentProcessor 経由で呼び出す)
  */
 getRankingData(scriptId: string) {
  return this.userCommentProcessor.getRankingData(scriptId);
 }

 /**
  * メタデータフェッチャーの初期化とポーリング開始
  */
 private initializeMetaFetcher(): void {
  const metaFetcher = GetMetas();
  metaFetcher.fetchMeta((meta) => {
   this.serviceMeta = meta;
  });
 }
}
