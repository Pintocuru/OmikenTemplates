<!-- src/App.vue -->
<template>
 <AnyGenerator :wordCounter="userVisits || []" :config="wordCounterConfig" />
</template>

<script setup lang="ts">
// その他
import { defineAsyncComponent, onMounted } from 'vue';
import { GetComments } from '@common/subscribe/GetComments';
import { GetUserComments } from '@common/subscribe/GetUserComments';
import { GetUserVisits } from '@common/subscribe/GetUserVisits';
import { ServiceAPI } from '@common/api/ServiceAPI';
import { ConfigUserType } from '@common/commonTypes';
import { WordCounterConfig } from '@/scripts/types';

// 読み込ませるコンポーネント
const AnyGenerator = defineAsyncComponent(() => Promise.resolve(window.AppComponent.component));

// 定数
const config: ConfigUserType = {
 IS_DIFF_MODE: true, // 差分モードにするか(true:'diff',false:'all')
 ALLOWED_IDS: window.CONFIG?.ALLOWED_IDS || [], // 通すユーザーIDリスト(!IDでネガティブ)
 ACCESS_LEVEL: window.CONFIG?.ACCESS_LEVEL || 1, // アクセスレベル
 IS_GIFT: false, // ギフト無効
 KEYWORDS: window.CONFIG?.KEYWORDS || [] // この文字列で始まるコメントを有効にする
};

const wordCounterConfig: WordCounterConfig = {
 IS_USER_COUNT: true // ユーザー数をカウントか、コメント数をカウントか
};

// コンポーザブル
const { isInitFlag, initOneSDK, newComments } = GetComments(true);
const { userComments } = GetUserComments(newComments, config);
const { userVisits } = GetUserVisits(userComments);

// わんコメから枠情報を取得し、1枠以上あるならわんコメ対応
(async () => {
 const response = await new ServiceAPI().getServices();
 if (response) await initOneSDK(config.IS_DIFF_MODE);
 else isInitFlag.value = false; // わんコメ対応なし
})();

onMounted(() => {
 document.body.removeAttribute('hidden'); // hiddenの削除
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
