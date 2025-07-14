// common/subscribe/GetUserComments.ts
import { ref } from 'vue';
import { ConfigUserType } from '../types/ConfigTypes';
import { AccessCondition, GiftCondition } from '../types/ThresholdTypes';
import { GetComments } from './GetComments';
import { Comment } from '@onecomme.com/onesdk';
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

class UserCommentsProcess {
 // 正規表現パターンキャッシュ
 private readonly regexCache = new Map<string, RegExp>();
 private readonly emojiPatternCache = new Map<string, boolean>();

 constructor(private readonly config: ConfigUserType) {}

 // ユーザーのコメントをconfig に沿ってフィルタリング
 process(comments: Comment[], existingComments: Comment[] = []): Comment[] | null {
  const validComments = comments.filter((comment) => this.isValidComment(comment));

  if (validComments.length === 0) return null;

  // DIFF_MODEに基づいて結果を返す
  return this.config.IS_DIFF_MODE
   ? validComments // 上書きモードでは新しいコメントのみ返す
   : this.mergeComments(existingComments, validComments); // 追加モードでは既存のものと結合
 }

 // 複数のフィルタリング条件を一括で処理
 private isValidComment(comment: Comment): boolean {
  return (
   this.isServiceAllowed(comment) &&
   this.isUserIdAllowed(comment) &&
   this.hasRequiredAccessLevel(comment) &&
   this.matchesThresholdCriteria(comment)
  );
 }

 // 新しいコメントを既存のコメントに追加（重複排除）
 private mergeComments(existingComments: Comment[], newComments: Comment[]): Comment[] {
  const existingIds = new Set(existingComments.map((c) => c.data.id));
  return [...existingComments, ...newComments.filter((c) => !existingIds.has(c.data.id))];
 }

 // プラットフォームのフィルタリング
 private isServiceAllowed(comment: Comment): boolean {
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
 private isUserIdAllowed(comment: Comment): boolean {
  const { conditions, user } = this.config.THRESHOLD;

  // 条件にuserが入ってないなら常にtrue
  if (!conditions.includes('user')) return true;

  const userId = comment.data.userId;

  // 許可リストと禁止リストに分離
  const allowedIds = user.filter((id) => !id.startsWith('!'));
  const disallowedIds = user.filter((id) => id.startsWith('!')).map((id) => id.substring(1));

  // 禁止リストにあるならfalse
  if (disallowedIds.includes(userId)) return false;

  // 許可リストが空なら、または許可リストにあるならtrue
  return allowedIds.length === 0 || allowedIds.includes(userId);
 }

 // 個別のコメントに対するアクセスレベルフィルタリング
 private hasRequiredAccessLevel(comment: Comment): boolean {
  const { conditions, access: levels } = this.config.THRESHOLD;

  // 条件にaccessが入ってないなら常にtrue
  if (!conditions.includes('access')) return true;

  // コメントテスターは常にtrue
  if (comment.id === 'COMMENT_TESTER') return true;

  const { data } = comment;

  // ユーザーのアクセスレベルを効率的に判定
  const userLevel = this.getUserAccessLevel(data);

  // 配列の中に一致するレベルがあれば true
  return levels.includes(userLevel);
 }

 // ユーザーのアクセスレベルを取得
 private getUserAccessLevel(data: Comment['data']): AccessCondition {
  if (data.isOwner) return AccessCondition.OWNER;
  if ('isModerator' in data && data.isModerator) return AccessCondition.MODERATOR;
  if ('isMember' in data && data.isMember) return AccessCondition.MEMBER;
  return AccessCondition.GUEST;
 }

 // 全体的な閾値条件をチェック
 private matchesThresholdCriteria(comment: Comment): boolean {
  const { conditions } = this.config.THRESHOLD;

  // 各条件を順番にチェック
  for (const condition of conditions) {
   switch (condition) {
    case 'gift':
     if (!this.matchesGiftCriteria(comment)) return false;
     break;
    case 'comment':
     if (!this.matchesCommentCriteria(comment)) return false;
     break;
    // 他の条件はすでに他のメソッドで処理済み
   }
  }

  return true;
 }

 // ギフト条件のチェック
 private matchesGiftCriteria(comment: Comment): boolean {
  const { gift } = this.config.THRESHOLD;

  const price = 'price' in comment.data ? comment.data.price : null;
  const giftTier = this.getGiftTier(price);

  // gift配列のいずれかの条件に一致すればtrue
  return gift.some((requiredTier) => giftTier >= requiredTier);
 }

 // コメント内容条件のチェック
 private matchesCommentCriteria(comment: Comment): boolean {
  const { comment: commentPatterns } = this.config.THRESHOLD;

  // パターンが空なら常にtrue
  if (commentPatterns.length === 0) return true;

  const commentText = comment.data.comment;

  // いずれかのパターンに一致すればtrue
  return commentPatterns.some((pattern) => this.matchesPattern(commentText, pattern));
 }

 // ギフトティアを効率的に計算
 private getGiftTier(price?: number | null): GiftCondition {
  if (!price || price <= 0) return GiftCondition.All;

  // 閾値を昇順で定義
  const thresholds = [200, 500, 1000, 2000, 5000, 10000, 20000];
  const tiers = [
   GiftCondition.Blue,
   GiftCondition.LightBlue,
   GiftCondition.Green,
   GiftCondition.Yellow,
   GiftCondition.Orange,
   GiftCondition.Pink,
   GiftCondition.Red,
   GiftCondition.Purple
  ];

  for (let i = 0; i < thresholds.length; i++) {
   if (price < thresholds[i]) return tiers[i];
  }

  return GiftCondition.Purple;
 }

 // 正規表現マッチング（キャッシュ付き）
 private matchesPattern(text: string, pattern: string): boolean {
  if (pattern === '') return false;

  // 絵文字パターンのキャッシュチェック
  if (this.emojiPatternCache.has(pattern)) {
   return this.emojiPatternCache.get(pattern)! ? emojiRegex().test(text) : false;
  }

  // 絵文字だけのパターンかチェック
  const isEmojiPattern = /^\p{Emoji}+$/u.test(pattern);
  this.emojiPatternCache.set(pattern, isEmojiPattern);

  if (isEmojiPattern) {
   return emojiRegex().test(text);
  }

  // 正規表現のキャッシュチェック
  if (!this.regexCache.has(pattern)) {
   try {
    this.regexCache.set(pattern, new RegExp(pattern));
   } catch (err) {
    console.error(`Invalid regex pattern: ${pattern}`, err);
    return false;
   }
  }

  const regex = this.regexCache.get(pattern)!;
  return regex.test(text);
 }
}
