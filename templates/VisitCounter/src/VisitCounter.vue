<!-- src/VisitCounter.vue -->
<template>
 <div id="container" class="container">
  <div class="main-container">
   <div class="syoken-container" v-if="svgMode >= 1">
    <div class="wrapper animate__animated animate__pulse">
     <!-- 星 -->
     <BackStar v-if="svgMode === 1" />

     <!-- 円 -->
     <BackCircle v-if="svgMode === 2" />

     <!-- 三角 -->
     <BackTriangle v-if="svgMode === 3" />
    </div>

    <div class="first-visit-count">{{ firstVisitCount }}</div>
    <div class="banner">初見さん</div>
   </div>

   <div class="info-container" v-if="svgMode > -1">
    <div class="counts-row">
     <div class="info-item info-syoken" v-if="svgMode === 0">
      <span class="info-value">{{ firstVisitCount }}</span>
      <span class="info-label">初見</span>
     </div>
     <div class="info-item">
      <span class="info-value">{{ visitCount }}</span>
      <span class="info-label">来場者</span>
     </div>
     <div class="info-item">
      <span class="info-value">{{ commentCount }}</span>
      <span class="info-label">コメント</span>
     </div>
    </div>
   </div>
   <!-- ユーザーリスト -->
   <div class="user-container" v-if="visibleUserSwitch">
    <div class="user-only" v-if="svgMode < 0"></div>
    <div class="user-list" ref="userList">
     <div v-for="user in visibleUsers" :key="user.name" class="user-list-item">
      <span :class="{ 'first-visit-name': user.isFirstVisit }">{{ user.name }}</span>
      <span v-if="user.status" class="user-status">{{ user.status }}</span>
     </div>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import BackStar from './BackStar.vue';
import BackCircle from './BackCircle.vue';
import BackTriangle from './BackTriangle.vue';
import { computed } from 'vue';
import { Comment } from '@onecomme.com/onesdk/types/Comment';

const props = defineProps<{
 newComments: Comment[];
}>();

interface UserVisit {
 name: string;
 isFirstVisit: boolean;
 kiriban: boolean;
 timeStamp: number;
 status: string;
}

interface UserVisits {
 [userId: string]: UserVisit;
}

const userVisits = reactive<UserVisits>({}); // ユーザー訪問情報
const commentCount = ref<number>(0); // コメント数
const initFlag = ref<boolean>(false); // 初期化フラグ(TODO いらない)

// 初回訪問者数
const firstVisitCount = computed<number>(() => Object.values(userVisits).filter((u) => u.isFirstVisit).length);

// 総訪問者数
const visitCount = computed<number>(() => Object.values(userVisits).length);

// 表示するユーザーリスト
const visibleUsers = computed<UserVisit[]>(() =>
 visibleUserSwitch
  ? Object.values(userVisits).sort((a, b) => {
     // 初見とキリ番ユーザーを優先的に表示
     if ((a.isFirstVisit || a.kiriban) !== (b.isFirstVisit || b.kiriban)) return b.isFirstVisit || b.kiriban ? 1 : -1;
     return b.timeStamp - a.timeStamp;
    })
  : []
);

// リストに表示させないID
const blockId = window.CONFIG?.DISALLOWED_USER_IDS || [];

// CSS変数から数値を取得する
const getCSSVar = (name: string, defaultValue: number): number | string => {
 const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
 return value === '' ? defaultValue : isNaN(Number(value)) ? value : Number(value);
};

// テストモード
const testUserCount = getCSSVar('--test-user-count', 0) as number;
// 表示モード（負の数値も許容）
const svgMode = getCSSVar('--svg-mode', 1) as number;
// カラー
const COLOR_NUMBER =
 (
  getComputedStyle(document.documentElement).getPropertyValue('--color-number').trim().replace(/['"]/g, '') || '01'
 ).padStart(2, '0') || '01';
// ユーザーリスト表示Switch
const visibleUserSwitch = getCSSVar('--visible-users-switch', 0) as number;
// キリ番
const KIRIBAN = getCSSVar('--kiriban', 100) as number;
// <style>タグを<head>に追加
document.head.insertAdjacentHTML('beforeend', `<style>@import url('./css/color_${COLOR_NUMBER}.css');</style>`);

// testModeの値に応じてユーザー訪問データを生成
if (testUserCount > 0) Object.assign(userVisits, generateTestData(testUserCount));

// コメント監視とクリーンアップ
watch(
 () => props.newComments,
 (newComments) => {
  // コメントが削除された場合、commentCountを0にリセット
  if (!newComments.length) {
   commentCount.value = 0;
  } else if (commentCount.value === 0 || initFlag.value) {
   // 新しいコメントを処理
   newComments.forEach(processComment);
   initFlag.value = true;
  }
 },
 { deep: true } // ネストされたオブジェクトの変更も監視
);

// 個別のコメント処理
const processComment = (comment: Comment): void => {
 const result = processCommentData(comment, userVisits[comment.data.userId], commentCount.value);

 if (result.userId) {
  commentCount.value = result.commentCount ?? commentCount.value;

  // 変更があった場合のみ更新
  if (JSON.stringify(userVisits[result.userId]) !== JSON.stringify(result.userVisit)) {
   userVisits[result.userId] = result.userVisit!;
  }
 }
};

// フィルタ処理：blockId/blockNameの空文字列を削除する
const filteredBlockId = blockId.filter((id) => id);

// テストデータを生成する関数
function generateTestData(count: number): UserVisits {
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

 return Object.fromEntries(
  Array.from({ length: count }, (_, i) => {
   const isSyoken = Math.random() < 0.03;
   const isKiriban = Math.random() < 0.03;
   return [
    `user${i + 1}`,
    {
     name: names[Math.floor(Math.random() * names.length)],
     isFirstVisit: isSyoken,
     kiriban: isKiriban,
     timeStamp: now - (count - i - 1) * interval,
     status: isSyoken ? '初見' : isKiriban ? 'キリ番' : ''
    }
   ];
  })
 );
}

type CommentProcessingResult = {
 userId?: string;
 userVisit?: UserVisit;
 commentCount?: number;
};

function processCommentData(
 comment: Comment,
 existingUserVisit: UserVisit | undefined,
 currentCommentCount: number
): CommentProcessingResult {
 // 早期リターン条件
 if (
  comment.service === 'external' ||
  comment.id === 'COMMENT_TESTER' ||
  (filteredBlockId.length > 0 && filteredBlockId.includes(comment.data.userId))
 ) {
  return {};
 }

 const isFirstVisit = comment.meta?.interval === 0;
 const newCommentCount = comment?.meta?.lc || currentCommentCount;
 const isKiriban = Number.isInteger(KIRIBAN) && KIRIBAN !== 0 && newCommentCount % KIRIBAN === 0;

 return {
  userId: comment.data.userId,
  userVisit: {
   name: comment.data.displayName ?? '匿名',
   isFirstVisit,
   kiriban: isKiriban,
   timeStamp: Date.now(),
   status: isFirstVisit ? '初見' : isKiriban ? `キリ番:${newCommentCount}` : ''
  },
  commentCount: newCommentCount
 };
}
</script>
