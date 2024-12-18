<!-- App.vue -->
<template>
 <div class="app-container">
  <ToastMessage :botComments="botComments" />
 </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { FunkCommentGetting } from './FunkCommentGetting';
import ToastMessage from './ToastMessage.vue';

// 定数
const PLUGIN_UID = 'OmikenPlugin01'; // 使用しているプラグイン名
const BOT_USER_ID = 'FirstCounter'; // プラグインのcomment.data.userId

const { botComments, initOneSDK, commentListener } = FunkCommentGetting(BOT_USER_ID, PLUGIN_UID);
onMounted(async () => {
 document.body.removeAttribute('hidden'); // hiddenの削除
 await initOneSDK(); // 初期化
 commentListener(); // コメントの購読
});
</script>

<style scoped>
.app-container {
 width: 100%;
 height: 100%;
}
</style>
