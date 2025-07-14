// src/MainGenerator/utils/ThresholdCommentChecker.ts
import { Comment } from '@onecomme.com/onesdk/types/Comment';
import {
 AccessCondition,
 CommentThresholdType,
 CountConditionType,
 GiftCondition,
 SyokenCondition
} from '@type/';

/**
 * コメントが指定された閾値条件を満たすかチェックする
 */
export function checkThresholdComment(comment: Comment, threshold: CommentThresholdType): boolean {
 const checkers = {
  syoken: () => checkSyoken(comment, threshold.syoken),
  access: () => checkAccess(comment, threshold.access),
  gift: () => checkGift(comment, threshold.gift),
  count: () => checkCount(comment, threshold.count),
  comment: () => checkComment(comment, threshold.comment)
 } as const;

 return threshold.conditions.every((condition) => checkers[condition]?.() ?? false);
}

/**
 * 初見・久しぶりのチェック
 */
function checkSyoken(comment: Comment, syoken: SyokenCondition[] = []): boolean {
 if (!syoken.length) return true;
 const { interval, no } = comment.meta ?? {};
 if (!comment.meta || interval === undefined || no === undefined) return false;

 const isSyoken = interval === 0;
 const day7 = 7 * 24 * 60 * 60 * 1000;
 const isAgain = interval > day7;
 const isFirstVisit = !isSyoken && !isAgain && no === 1;

 const conditions = { syoken: isSyoken, again: isAgain, firstVisit: isFirstVisit };
 return syoken.some((condition) => conditions[condition] ?? false);
}

/**
 * ユーザーの役職チェック
 */
function checkAccess(comment: Comment, access: AccessCondition[] = []): boolean {
 if (!access.length) return true;
 if (!comment.data) return false;

 const { isOwner, isModerator, isMember, isSubscriber, isPremium } = comment.data as {
  isOwner?: boolean;
  isModerator?: boolean;
  isMember?: boolean;
  isSubscriber?: boolean;
  isPremium?: boolean;
 };
 const userRoles: AccessCondition[] = [];

 if (isOwner) userRoles.push('owner');
 if (isModerator) userRoles.push('moderator');
 if (isMember) userRoles.push('member');
 if (isSubscriber) userRoles.push('subscriber');
 if (isPremium) userRoles.push('premium');

 return access.some((required) => userRoles.includes(required));
}

/**
 * ギフト条件チェック
 */
function checkGift(comment: Comment, gift: GiftCondition[] = []): boolean {
 if (!gift.length) return true;
 if (!comment.data?.hasGift) return false;

 const { tier, price } = comment.data as any;
 const calculatedTier = tier ?? getGiftTier(price);

 return gift.some((requiredTier) => calculatedTier >= requiredTier);
}

/**
 * ギフトの色を返す(Youtube基準)
 */
export const getGiftTier = (price?: number | null): GiftCondition => {
 if (!price || price <= 0) return 'all';

 const ranges: [number, GiftCondition][] = [
  [200, 'blue'],
  [500, 'lightBlue'],
  [1000, 'green'],
  [2000, 'yellow'],
  [5000, 'orange'],
  [10000, 'pink'],
  [20000, 'red'],
  [Infinity, 'purple']
 ];

 return ranges.find(([threshold]) => price < threshold)?.[1] ?? 'purple';
};

/**
 * 数値条件チェック
 */
function checkCount(
 comment: Comment,
 count: CountConditionType = { comparison: 'min', unit: 'lc', value: 1 }
): boolean {
 if (!comment.meta) return false;

 const unitValue = comment.meta[count.unit];
 if (unitValue === undefined || (unitValue === 0 && count.comparison === 'loop')) {
  return false;
 }

 return compareValue(unitValue, count);
}

/**
 * コメント文字列条件チェック
 */
function checkComment(comment: Comment, patterns: string[] = []): boolean {
 if (!patterns.length) return true;
 if (!comment.data?.comment || typeof comment.data.comment !== 'string') return false;

 return patterns.some((pattern) => {
  try {
   return new RegExp(pattern).test(comment.data.comment);
  } catch (e) {
   console.warn(`Invalid regex: ${pattern}`, e);
   return false;
  }
 });
}

/**
 * 数値比較ヘルパー関数
 */
export const compareValue = (
 value: number,
 { comparison, value: target }: CountConditionType
): boolean => {
 const strategies = {
  loop: () => target !== 0 && value % target === 0,
  min: () => value >= target,
  max: () => value <= target,
  equal: () => value === target
 } as const;

 return strategies[comparison]?.() ?? false;
};
