// src/MainGenerator/utils/CommentProcessor.ts
import { BotMessage } from '@/types/types';
import { OmikujiDataType } from '@type/';
import { UserCommentProcessor } from '@/MainGenerator/utils/UserCommentProcessor';
import { isWithinTimeThreshold } from '@/MainGenerator/utils/CommentProcessorCooldown';
import { BotMessageGenerator } from '@/MainGenerator/utils/CommentProcessorToast';
import { ScriptManager } from '@/MainGenerator/utils/ScriptManager';
import { SETTINGS } from '@public/common/settings';
import { GetMetas } from '@public/common/subscribe/GetMetas';
import { Comment, ServiceMeta } from '@onecomme.com/onesdk';

export class CommentProcessor {
 private serviceMeta: ServiceMeta | null = null; // Metaデータ管理
 private readonly BotMessageGenerator: BotMessageGenerator;
 private readonly userCommentProcessor: UserCommentProcessor;

 constructor(omikujiData: OmikujiDataType, scriptManager: ScriptManager) {
  this.BotMessageGenerator = new BotMessageGenerator(omikujiData.characters);
  this.userCommentProcessor = new UserCommentProcessor(omikujiData, scriptManager);
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
  * メタデータフェッチャーの初期化とポーリング開始
  */
 private initializeMetaFetcher(): void {
  const metaFetcher = GetMetas();
  metaFetcher.fetchMeta((meta) => {
   this.serviceMeta = meta;
  });
 }
}
