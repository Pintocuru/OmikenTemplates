<!-- src/VisitCounter.vue -->
<template>
 <AnimationCanvas
  :commentCount="commentCount"
  :config="{
   colors: ['#FF6138', '#FFBE53', '#2980B9', '#282741'],
   particleCount: 32,
   particleSizeMin: 24,
   particleSizeMax: 48,
   animationDurationMin: 1000,
   animationDurationMax: 1300,
   rippleSize: 200
  }"
 />

 <!-- ユーザーリスト -->
</template>

<!--
 <commentCounts :commentCount="commentCount" />
 <UserList
  v-if="CONFIG.IS_VISIBLE_USERS"
  :users="Object.values(userVisits)"
  :SVG_MODE="CONFIG.SVG_MODE"
  :IS_VISIBLE_USERS="CONFIG.IS_VISIBLE_USERS"
 />
  <AnimationMoji1 />

 <BackgroundComponent :SVG_MODE="CONFIG.SVG_MODE" :firstVisitCount="firstVisitCount" />
 <StatsDisplay
  :SVG_MODE="CONFIG.SVG_MODE"
  :firstVisitCount="firstVisitCount"
  :visitCount="visitCount"
  :commentCount="commentCount"
 />
-->

<script setup lang="ts">
import { ConfigPlusType } from './parts/types';
import { useCommentProcessor } from './parts/useCommentProcessor';
import commentCounts from './commentCount.vue';
import AnimationCanvas from './AnimationCanvas.vue';
import AnimationMoji1 from './AnimationMoji1.vue';
import BackgroundComponent from './BackgroundComponent.vue';
import StatsDisplay from './StatsDisplay.vue';
import UserList from './UserList.vue';
import { Comment } from '@onecomme.com/onesdk/types/Comment';

const props = defineProps<{
 newComments: Comment[];
}>();

// 設定の読み込み
const CONFIG: ConfigPlusType = {
 TEST_USER_COUNT: window.CONFIG?.TEST_USER_COUNT || 0, // テストモード
 DISALLOWED_USER_IDS: window.CONFIG?.DISALLOWED_USER_IDS || [], // リストに表示させないID
 COLOR_NUMBER: String(window.CONFIG?.COLOR_NUMBER || '01').padStart(2, '0'), // カラーモード
 SVG_MODE: window.CONFIG?.SVG_MODE ?? 1, // 表示モード
 IS_VISIBLE_USERS: window.CONFIG?.IS_VISIBLE_USERS || false, // ユーザーリストを表示するか
 KIRIBAN: window.CONFIG?.KIRIBAN || 100 // キリ番
};
// <style>タグを<head>に追加
document.head.insertAdjacentHTML('beforeend', `<style>@import url('./css/color_${CONFIG.COLOR_NUMBER}.css');</style>`);

const { commentCount, userVisits, firstVisitCount, visitCount, handleComment } = useCommentProcessor(CONFIG);

// コメント監視
watch(
 () => props.newComments,
 (newComments) => {
  if (!newComments.length) commentCount.value = 0;
  else newComments.forEach(handleComment);
 },
 { deep: true }
);
</script>
