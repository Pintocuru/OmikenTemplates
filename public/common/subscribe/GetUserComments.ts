// common/subscribe/GetUserComments.ts
import { ref } from 'vue';
import { ConfigUserType } from '../commonTypes';
import { GetComments } from './GetComments';
import { Comment } from '@onecomme.com/onesdk/types/Comment';
import emojiRegex from 'emoji-regex';

export function GetUserComments(config: ConfigUserType, isFirstComment: boolean = false) {
 const processor = new UserCommentsProcess(config);
 const userComments = ref<Comment[]>([]);

 const fetchComments = async (callback?: (comments: Comment[]) => void): Promise<boolean> => {
  return await GetComments(true, isFirstComment, (comments) => {
   // comments が空なら、リセット処理
   if (comments.length === 0) {
    userComments.value = [];
    if (callback) callback([]);
    return;
   }
   // コメントをフィルタリング
   const processed = processor.process(comments, userComments.value);
   if (processed !== null) {
    userComments.value = processed;
    // 外部から処理を追加するcallback
    if (callback) callback(processed);
   }
  });
 };

 return {
  userComments, // フィルタリングされたコメント
  fetchComments // 初期化
 };
}

export class UserCommentsProcess {
 constructor(private readonly config: ConfigUserType) {}

 // ユーザーのコメントをconfig に沿ってフィルタリング
 process(comments: Comment[], existingComments: Comment[] = []): Comment[] | null {
  const validComments = comments
   .filter(this.isServiceAllowed.bind(this))
   .filter(this.isUserIdAllowed.bind(this))
   .filter(this.hasRequiredAccessLevel.bind(this))
   .filter(this.matchesFilterCriteria.bind(this));

  if (validComments.length === 0) return null;

  // DIFF_MODEに基づいて結果を返す
  return this.config.IS_DIFF_MODE
   ? validComments // 上書きモードでは新しいコメントのみ返す
   : this.mergeComments(existingComments, validComments); // 追加モードでは既存のものと結合
 }

 // 新しいコメントを既存のコメントに追加（重複排除）
 private mergeComments(existingComments: Comment[], newComments: Comment[]): Comment[] {
  const existingIds = new Set(existingComments.map((c) => c.data.id));
  return [...existingComments, ...newComments.filter((c) => !existingIds.has(c.data.id))];
 }

 // プラットフォームのフィルタリングService
 isServiceAllowed(comment: Comment): boolean {
  const service = this.config.ENABLED_SERVICES;

  // 'all' の場合、すべて許可
  if (service === 'all') return true;

  // コメントテスターのコメントは 'external' 扱いにする
  if (comment.id === 'COMMENT_TESTER') return comment.service === 'external';

  // 'platforms' の場合、'external' および 'system' を除外
  if (service === 'platforms') {
   return !['external', 'system'].includes(comment.service);
  }

  // ENABLED_SERVICES が特定のサービス名の場合、そのサービスのみ許可
  return comment.service === service;
 }

 // 個別のコメントに対するユーザーIDフィルタリング
 isUserIdAllowed(comment: Comment): boolean {
  const { ALLOWED_IDS } = this.config;
  const disallowedIds = ALLOWED_IDS.filter((id) => id.startsWith('!')).map((id) => id.substring(1));
  const allowedIds = ALLOWED_IDS.filter((id) => !id.startsWith('!'));

  const { userId } = comment.data;
  return (!allowedIds.length || allowedIds.includes(userId)) && !disallowedIds.includes(userId);
 }

 // 個別のコメントに対するアクセスレベルフィルタリング
 hasRequiredAccessLevel(comment: Comment): boolean {
  const { id, data } = comment;
  const level = this.config.ACCESS_LEVEL;

  if (!level) return true;
  if (id === 'COMMENT_TESTER') return true;

  const isOwner = Boolean(data.isOwner);
  const isModerator = 'isModerator' in data && Boolean(data.isModerator);
  const isMember = 'isMember' in data && Boolean(data.isMember);

  return (
   level === 1 ||
   (level === 2 && (isOwner || isMember || isModerator)) ||
   (level === 3 && (isOwner || isModerator)) ||
   (level === 4 && isOwner)
  );
 }

 // 個別のコメントに対するフィルタリング条件のマッチング
 matchesFilterCriteria(comment: Comment): boolean {
  // ギフトチェック
  if (this.config.IS_GIFT && comment.data.hasGift) return true;

  // キーワードチェック（正規表現を適用）
  if (this.config.KEYWORDS.length === 0) return true;
  if (this.config.KEYWORDS?.some((keyword) => this.matchPattern(comment.data.comment, keyword)))
   return true;

  return false;
 }

 // 正規表現マッチング
 private matchPattern(text: string, pattern: string): boolean {
  if (pattern === '') return false;
  try {
   // 絵文字だけのパターンなら emojiRegex で判定
   if (/^\p{Emoji}+$/u.test(pattern)) {
    return emojiRegex().test(text);
   }
   // 通常の正規表現マッチ
   return new RegExp(pattern).test(text);
  } catch (err) {
   console.error(`Invalid regex pattern: ${pattern}`, err);
   return false;
  }
 }
}
