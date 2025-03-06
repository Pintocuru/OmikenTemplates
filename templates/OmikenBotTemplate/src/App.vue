<!-- App.vue -->
<template>
 <div v-if="isInitFlag">
  <MessageMain :botComments="botComments || []" />
  <MessageToast :botComments="botToasts || []" />
 </div>
 <!-- App.vue -->
 <div v-else>
  <ErrorInitComponent :config="config" />
 </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { GetBotComments } from '@common/subscribe/GetBotComments';
import ErrorInitComponent from '@common/ErrorInitComponent.vue';
import MessageMain from './MessageMain.vue';
import MessageToast from './MessageToast.vue';
import { ConfigBotType } from '@common/commonTypes';

// グローバル変数の型定義
declare global {
 interface Window {
  CONFIG_MAIN?: ConfigBotType;
  CONFIG_TOAST?: ConfigBotType;
 }
}

// 定数
const configMain: ConfigBotType = {
 PLUGIN_UID: window.CONFIG_MAIN?.PLUGIN_UID || 'OmikenPlugin01', // 使用しているプラグイン名
 PLUGIN_RULE_ID: null, // Gamesで使う、rulesのid
 BOT_POST_PARAM: window.CONFIG_MAIN?.BOT_POST_PARAM || ['!toast'] // paramがPOST_PARAMに含まれているか(!paramなら含まれていないか)
};
const configToast: ConfigBotType = {
 PLUGIN_UID: window.CONFIG_TOAST?.PLUGIN_UID || 'OmikenPlugin01', // 使用しているプラグイン名
 PLUGIN_RULE_ID: null, // Gamesで使う、rulesのid
 BOT_POST_PARAM: window.CONFIG_TOAST?.BOT_POST_PARAM || ['toast'] // paramがPOST_PARAMに含まれているか(!paramなら含まれていないか)
};

// 初期化フラグ
const isInitFlag = ref(true);

// コンポーザブル
const { botComments, fetchComments } = GetBotComments(configMain);
const { botComments: botToasts, fetchComments: fetchToast } = GetBotComments(configToast);

// 初期化
onMounted(async () => {
 document.body.removeAttribute('hidden'); // hiddenの削除
 // Botコメントの初期化
 isInitFlag.value = await fetchComments();
 await fetchToast();
});
</script>
