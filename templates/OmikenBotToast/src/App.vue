<!-- App.vue -->
<template>
 <ToastMessage :botComments="botComments" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { CommentGet, configType } from '@composables/CommentGet';
import ToastMessage from './ToastMessage.vue';

// 定数
const config: configType = {
 PLUGIN_UID: window.CONFIG?.PLUGIN_UID || 'OmikenPlugin01', // 使用しているプラグイン名
 BOT_USER_ID: window.CONFIG?.BOT_USER_ID || 'FirstCounter', // プラグインのcomment.data.userId
 POST_PARAM: window.CONFIG?.POST_PARAM || [], // postが特定のparamのときに表示
 NON_POST_PARAM: window.CONFIG?.NON_POST_PARAM || ['toast'], // POST_PARAMが空の時、postが特定のparamではないときに表示
 IS_DIFF_MODE: window.CONFIG?.IS_DIFF_MODE || true // 差分モードにするか(true:'diff',false:'all')
};

// コンポーザブル
const { initOneSDK, newComments, getBotComments, botComments } = CommentGet(config);

// 初期化
onMounted(async () => {
 document.body.removeAttribute('hidden'); // hiddenの削除
 await initOneSDK(); // コメント初期化
 await getBotComments(); // Botコメントを抽出
});
</script>
