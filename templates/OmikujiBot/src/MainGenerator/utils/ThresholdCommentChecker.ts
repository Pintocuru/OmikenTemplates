// src/MainGenerator/utils/ThresholdCommentChecker.ts
import { Comment } from '@onecomme.com/onesdk/types/Comment';
import {
 AccessConditionArray,
 CommentThreshold,
 CountCondition,
 GiftConditionArray,
 SyokenConditionArray,
 SyokenCondition,
 GiftCondition
} from '@/OmikujiThresholdTypes';

export class ThresholdCommentChecker {
 private comment: Comment | null = null;

 constructor(private threshold: CommentThreshold) {}

 check(comment: Comment): boolean {
  this.comment = comment;

  // conditions配列のすべての条件が真である場合のみtrueを返す
  return this.threshold.conditions.every((conditionType) => {
   const conditionMap = {
    syoken: () => this.matchIsSyoken(this.threshold.syoken),
    access: () => this.matchIsAccess(this.threshold.access),
    gift: () => this.matchIsGift(this.threshold.gift),
    count: () => this.matchIsCount(this.threshold.count),
    comment: () => this.matchIsComment(this.threshold.comment)
   } as const;

   return conditionMap[conditionType]?.() ?? false;
  });
 }

 // 初見・久しぶりのチェック
 private matchIsSyoken(syoken: SyokenConditionArray = []): boolean {
  if (syoken.length === 0) return true; // 条件が空の場合はtrue
  if (!this.comment) return false;

  const currentComment = this.comment;
  const interval = currentComment.meta?.interval;

  // 各条件を個別に定義して循環参照を回避
  const isSyoken = interval === 0 || interval === undefined;
  const isAgain = (interval ?? 0) > 7 * 24 * 60 * 60 * 1000;
  const isHi = !isSyoken && !isAgain;

  const conditions: Record<SyokenCondition, boolean> = {
   [SyokenCondition.SYOKEN]: isSyoken,
   [SyokenCondition.AGAIN]: isAgain,
   [SyokenCondition.HI]: isHi
  };

  // syoken配列のいずれかの条件に一致すればtrue
  return syoken.some((condition) => conditions[condition] ?? false);
 }

 // ユーザーの役職
 private matchIsAccess(access: AccessConditionArray = []): boolean {
  if (access.length === 0) return true; // 条件が空の場合はtrue
  if (!this.comment) return false;

  const commentData = this.comment.data;
  if (!commentData) return false;

  const { isOwner, isModerator, isMember } = commentData as {
   isOwner?: boolean;
   isModerator?: boolean;
   isMember?: boolean;
  };

  // ユーザーの役職レベルを判定
  const userLevel = this.getUserLevel(isOwner, isModerator, isMember);

  // access配列のいずれかの条件に一致すればtrue
  return access.some((requiredLevel) => userLevel >= requiredLevel);
 }

 private getUserLevel(isOwner?: boolean, isModerator?: boolean, isMember?: boolean): number {
  if (isOwner) return 4; // ADMIN
  if (isModerator) return 3; // MODERATOR
  if (isMember) return 2; // MEMBER
  return 1; // GUEST
 }

 // ギフトを参照する
 private matchIsGift(gift: GiftConditionArray = []): boolean {
  if (gift.length === 0) return true; // 条件が空の場合はtrue
  if (!this.comment?.data) return false;

  const { hasGift } = this.comment.data;
  // ギフトがない場合、false
  if (!hasGift) return false;

  const commentData = this.comment.data;
  const price = 'price' in commentData ? commentData.price : null;
  const tier = 'tier' in commentData ? commentData.tier : null;

  // 指定したTier以上のギフトがあるならtrue
  const calTier = tier ?? matchIsGiftHelper(price);

  // gift配列のいずれかの条件に一致すればtrue
  return gift.some((requiredTier) => calTier >= requiredTier);
 }

 // 数値を参照する
 private matchIsCount(
  count: CountCondition = { comparison: 'max', unit: 'lc', value: 1 }
 ): boolean {
  if (!this.comment) return false;

  const { lc = 0, tc = 0 } = this.comment.meta ?? {};

  const unitMap: Record<CountCondition['unit'], number> = {
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

 // 文字列を参照する
 private matchIsComment(value: string[] = []): boolean {
  if (value.length === 0) return true; // 条件が空の場合はtrue
  if (!this.comment?.data) return false;

  const { comment } = this.comment.data;
  if (typeof comment !== 'string') {
   console.warn('Comment is not a string');
   return false;
  }

  // 正規表現でいずれかにマッチすれば true
  return value.some((pattern) => {
   try {
    const regex = new RegExp(pattern);
    return regex.test(comment);
   } catch (e) {
    console.warn(`Invalid regex: ${pattern}`, e);
    return false;
   }
  });
 }
}

// ギフトの色を返す(Youtube基準)
export const matchIsGiftHelper = (price?: number | null): GiftCondition => {
 if (!price || price <= 0) return GiftCondition.All;
 const giftRanges = new Map([
  [200, GiftCondition.Blue],
  [500, GiftCondition.LightBlue],
  [1000, GiftCondition.Green],
  [2000, GiftCondition.Yellow],
  [5000, GiftCondition.Orange],
  [10000, GiftCondition.Pink],
  [20000, GiftCondition.Red],
  [Infinity, GiftCondition.Purple]
 ]);
 for (const [threshold, condition] of giftRanges) {
  if (price < threshold) return condition;
 }
 return GiftCondition.Purple;
};

// 数値比較ヘルパー関数
export const matchIsCountHelper = (valueNow: number, count: CountCondition): boolean => {
 const { comparison, value } = count;

 const comparisonStrategies = {
  loop: () => value !== 0 && valueNow % value === 0,
  min: () => valueNow <= value,
  max: () => valueNow >= value,
  equal: () => valueNow === value
 } as const;

 return comparisonStrategies[comparison]?.() ?? false;
};
