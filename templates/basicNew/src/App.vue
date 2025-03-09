<!-- src/App.vue -->
<template>
 <div v-if="isInitFlag">
  <BasicNew :newComments="userComments || []" />
 </div>
 <!-- App.vue -->
 <div v-else>
  <ErrorInitComponent :pluginUid="null" />
 </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ConfigUserType } from '@common/commonTypes';
import { GetUserComments } from '@common/subscribe/GetUserComments';
import BasicNew from './BasicNew.vue';
import ErrorInitComponent from '@common/ErrorInitComponent.vue';

// グローバル変数の型定義
declare global {
 interface Window {
  CONFIG?: ConfigUserType;
 }
}

// 定数
const config: ConfigUserType = {
 IS_DIFF_MODE: true, // 差分モードにするか(true:'diff',false:'all')
 ALLOWED_IDS: window.CONFIG?.ALLOWED_IDS || [], // 通すユーザーIDリスト(!IDでネガティブ)
 ACCESS_LEVEL: window.CONFIG?.ACCESS_LEVEL || 1, // 1:だれでも/2:メンバー/3:モデレーター/4:管理者
 IS_GIFT: window.CONFIG?.IS_GIFT || false, // ギフトで有効にするか
 KEYWORDS: window.CONFIG?.KEYWORDS || [] // isGiftがfalseなら、このコメントで判定(正規表現)
};

// 初期化フラグ
const isInitFlag = ref(true);

// コンポーザブル
const { userComments, fetchComments } = GetUserComments(config, true);

// 初期化
onMounted(async () => {
 document.body.removeAttribute('hidden'); // hiddenの削除
 isInitFlag.value = await fetchComments(); // コメント初期化
});
</script>

<style>
/* ビューポート全体を占める */
#App {
 height: 100vh;
 display: flex;
 flex-direction: column;
}
</style>
