// src/MainGenerator/utils/ThresholdCommentChecker.ts
import { Comment } from '@onecomme.com/onesdk/types/Comment';
import {
 CommentThresholdType,
 CountConditionType,
 SyokenConditionSchema,
 AccessConditionSchema,
 GiftConditionSchema
} from '@/types/OmikujiTypesSchema';

// Zodスキーマから推論された型のエイリアス
type SyokenCondition = ReturnType<typeof SyokenConditionSchema.parse>;
type AccessCondition = ReturnType<typeof AccessConditionSchema.parse>;
type GiftCondition = ReturnType<typeof GiftConditionSchema.parse>;

// 配列型のエイリアス
type SyokenConditionArray = SyokenCondition[];
type AccessConditionArray = AccessCondition[];
type GiftConditionArray = GiftCondition[];

/**
 * コメントが指定された閾値条件を満たすかチェックする
 */
export function checkThresholdComment(comment: Comment, threshold: CommentThresholdType): boolean {
 // conditions配列のすべての条件が真である場合のみtrueを返す
 return threshold.conditions.every((conditionType) => {
  const conditionMap = {
   syoken: () => matchIsSyoken(comment, threshold.syoken),
   access: () => matchIsAccess(comment, threshold.access),
   gift: () => matchIsGift(comment, threshold.gift),
   count: () => matchIsCount(comment, threshold.count),
   comment: () => matchIsComment(comment, threshold.comment)
  } as const;

  return conditionMap[conditionType]?.() ?? false;
 });
}

/**
 * 初見・久しぶりのチェック
 */
function matchIsSyoken(comment: Comment, syoken: SyokenConditionArray = []): boolean {
 if (syoken.length === 0) return true; // 条件が空の場合はtrue

 const interval = comment.meta?.interval ?? 0; // 前回のコメントからの経過時間
 const tc = comment.meta?.tc || 1; // コメントをしたユーザーの配信でのコメント回数

 // 各条件を個別に定義
 const isSyoken = interval === 0;
 const isAgain = interval > 7 * 24 * 60 * 60 * 1000; // 7日以上経過
 const isHi = !isSyoken && !isAgain && tc === 1;

 const conditions: Record<SyokenCondition, boolean> = {
  1: isSyoken, // SYOKEN
  2: isAgain, // AGAIN
  3: isHi // HI
 };

 // syoken配列のいずれかの条件に一致すればtrue
 return syoken.some((condition) => conditions[condition] ?? false);
}

/**
 * ユーザーの役職チェック
 */
function matchIsAccess(comment: Comment, access: AccessConditionArray = []): boolean {
 if (access.length === 0) return true; // 条件が空の場合はtrue

 const commentData = comment.data;
 if (!commentData) return false;

 const { isOwner, isModerator, isMember } = commentData as {
  isOwner?: boolean;
  isModerator?: boolean;
  isMember?: boolean;
 };

 // ユーザーの役職レベルを判定
 const userLevel = getUserLevel(isOwner, isModerator, isMember);

 // access配列のいずれかの条件に一致すればtrue
 return access.some((requiredLevel) => userLevel >= requiredLevel);
}

/**
 * ユーザーレベルを取得
 */
function getUserLevel(isOwner?: boolean, isModerator?: boolean, isMember?: boolean): number {
 if (isOwner) return 4; // ADMIN
 if (isModerator) return 3; // MODERATOR
 if (isMember) return 2; // MEMBER
 return 1; // GUEST
}

/**
 * ギフト条件チェック
 */
function matchIsGift(comment: Comment, gift: GiftConditionArray = []): boolean {
 if (gift.length === 0) return true; // 条件が空の場合はtrue
 if (!comment.data) return false;

 const { hasGift } = comment.data;
 // ギフトがない場合、false
 if (!hasGift) return false;

 const commentData = comment.data;
 const price = 'price' in commentData ? commentData.price : null;
 const tier = 'tier' in commentData ? commentData.tier : null;

 // 指定したTier以上のギフトがあるならtrue
 const calTier = tier ?? matchIsGiftHelper(price);

 // gift配列のいずれかの条件に一致すればtrue
 return gift.some((requiredTier) => calTier >= requiredTier);
}

/**
 * 数値条件チェック
 */
function matchIsCount(
 comment: Comment,
 count: CountConditionType = { comparison: 'min', unit: 'lc', value: 1 }
): boolean {
 const { lc = 0, tc = 0 } = comment.meta ?? {};

 const unitMap: Record<CountConditionType['unit'], number> = {
  lc,
  tc
 };

 const unitValue = unitMap[count.unit];
 if (unitValue === undefined) {
  console.warn(`Unknown count unit: ${count.unit}`);
  return false;
 }

 return matchIsCountHelper(unitValue, count);
}

/**
 * コメント文字列条件チェック
 */
function matchIsComment(comment: Comment, value: string[] = []): boolean {
 if (value.length === 0) return true; // 条件が空の場合はtrue
 if (!comment.data) return false;

 const { comment: commentText } = comment.data;
 if (typeof commentText !== 'string') {
  console.warn('Comment is not a string');
  return false;
 }

 // 正規表現でいずれかにマッチすれば true
 return value.some((pattern) => {
  try {
   const regex = new RegExp(pattern);
   return regex.test(commentText);
  } catch (e) {
   console.warn(`Invalid regex: ${pattern}`, e);
   return false;
  }
 });
}

// ギフトの色を返す(Youtube基準)
export const matchIsGiftHelper = (price?: number | null): GiftCondition => {
 if (!price || price <= 0) return 0; // All

 const giftRanges: [number, GiftCondition][] = [
  [200, 1], // Blue
  [500, 2], // LightBlue
  [1000, 3], // Green
  [2000, 4], // Yellow
  [5000, 5], // Orange
  [10000, 6], // Pink
  [20000, 7], // Red
  [Infinity, 8] // Purple
 ];

 for (const [threshold, condition] of giftRanges) {
  if (price < threshold) return condition;
 }
 return 8; // Purple
};

// 数値比較ヘルパー関数
export const matchIsCountHelper = (valueNow: number, count: CountConditionType): boolean => {
 const { comparison, value } = count;

 const comparisonStrategies = {
  loop: () => value !== 0 && valueNow % value === 0,
  min: () => valueNow >= value, // 修正: min条件は「以上」であるべき
  max: () => valueNow <= value, // 修正: max条件は「以下」であるべき
  equal: () => valueNow === value
 } as const;

 return comparisonStrategies[comparison]?.() ?? false;
};
