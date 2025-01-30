// src/parts/useCommentProcessor.ts
import { computed, reactive, ref } from 'vue';
import { ConfigPlusType, UserVisit, UserVisits } from './types';
import { Comment } from '@onecomme.com/onesdk/types/Comment';

export function useCommentProcessor(config: ConfigPlusType) {
 // ref/reactive
 const commentCount = ref(0); // コメント数
 const userVisits = reactive<UserVisits>({}); // ユーザーデータ

 // 初回訪問者数
 const firstVisitCount = computed(() => Object.values(userVisits).filter((u) => u.isFirstVisit).length);
 // 総訪問者数
 const visitCount = computed(() => Object.values(userVisits).length);

 // コメント処理のメイン関数
 const handleComment = (comment: Comment): void => {
  // DISALLOWED_USER_IDS に入っているIDは通さない
  const blockedIds = config.DISALLOWED_USER_IDS.filter((id) => id);
  if (!isValidComment(comment, blockedIds)) return;

  const visitInfo = createVisitInfo(comment, commentCount.value, config.KIRIBAN);
  const newCount = comment?.meta?.lc || commentCount.value;

  // ステート更新
  commentCount.value = newCount;

  if (comment.data.userId) {
   const currentVisit = userVisits[comment.data.userId];
   if (JSON.stringify(currentVisit) !== JSON.stringify(visitInfo)) {
    userVisits[comment.data.userId] = visitInfo;
   }
  }
 };

 // コメントが有効かどうかを判定
 const isValidComment = (comment: Comment, blockedIds: string[]): boolean => {
  // comment.service === 'external' || comment.id === 'COMMENT_TESTER' ||
  // コメントテスター・外部コメントは通さない
  return !(blockedIds.length > 0 && blockedIds.includes(comment.data.userId));
 };

 // ユーザー訪問情報を生成
 const createVisitInfo = (comment: Comment, currentCount: number, kiribanNumber: number): UserVisit => {
  const isFirstVisit = comment.meta?.interval === 0;
  const newCount = comment?.meta?.lc || currentCount;
  const isKiriban = Number.isInteger(kiribanNumber) && kiribanNumber !== 0 && newCount % kiribanNumber === 0;

  return {
   name: comment.data.displayName ?? '匿名',
   isFirstVisit,
   kiriban: isKiriban,
   timeStamp: Date.now(),
   status: isFirstVisit ? '初見' : isKiriban ? `キリ番:${newCount}` : ''
  };
 };

 // テストデータ生成
 const generateTestUsers = (count: number): void => {
  const now = Date.now();
  const interval = (45 * 60 * 1000) / count;
  const names = [
   '匿名',
   'ああああ',
   '774さん',
   'あのに増田',
   '名前はまだない。',
   '以下、名無しにかわりましてVIPがお送りします'
  ];

  const testUsers = Object.fromEntries(
   Array.from({ length: count }, (_, i) => {
    const isFirstVisit = Math.random() < 0.03;
    const isKiriban = Math.random() < 0.03;
    return [
     `user${i + 1}`,
     {
      name: names[Math.floor(Math.random() * names.length)],
      isFirstVisit,
      kiriban: isKiriban,
      timeStamp: now - (count - i - 1) * interval,
      status: isFirstVisit ? '初見' : isKiriban ? 'キリ番' : ''
     }
    ];
   })
  );

  Object.assign(userVisits, testUsers);
 };

 // testModeの値に応じてユーザー訪問データを生成
 if (config.TEST_USER_COUNT > 0) generateTestUsers(config.TEST_USER_COUNT);

 return {
  commentCount,
  userVisits,
  firstVisitCount,
  visitCount,
  handleComment,
  generateTestUsers
 };
}
