<!-- src/MainGenerator/App.vue -->
<template>
 <div v-if="isInitialized">
  <!-- BOTメッセージ表示 -->
  <ViewBotMessage
   v-if="currentDisplayMode === 'messages'"
   :botMessages="botMessages"
   :displaySize="displaySize"
  />

  <!-- ユーザー訪問履歴表示 -->
  <ViewUserVisits
   v-else-if="currentDisplayMode === 'userVisits'"
   :userVisitsData="userVisitsData"
   ref="userVisitsRef"
  />

  <!-- Scriptsゲーム表示 -->
  <component
   v-else-if="currentDisplayMode === 'scriptGame' && currentScriptGameComponent"
   :is="currentScriptGameComponent"
   v-bind="currentScriptGameProps"
   ref="scriptGameRef"
  />

  <!-- トースト表示 -->
  <ViewBotToast :botMessages="botMessages" :displaySize="displaySize" />

  <!-- キャラクターコントロールパネル -->
  <CharacterControlPanel
   :characters="characterCollector.getUsedCharacterPresets()"
   :displaySize="displaySize"
   :switchToNextMode="switchToNextMode"
   :switchToPrevMode="switchToPrevMode"
   :increaseDisplaySize="increaseDisplaySize"
   :decreaseDisplaySize="decreaseDisplaySize"
   :generateTestMessage="characterCollector.generateTestMessage.bind(characterCollector)"
   @testMessage="(message: BotMessage) => (botMessages = [...botMessages, message])"
  />
 </div>
 <!-- わんコメが起動されていない場合のエラー表示 -->
 <ErrorInitComponent v-else :pluginUid="null" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { validateOmikujiData } from '@/types/OmikujiTypesSchema';
import ViewBotMessage from '@/MainGenerator/components/ViewBotMessage.vue';
import ViewBotToast from '@/MainGenerator/components/ViewBotToast.vue';
import ViewUserVisits from '@/MainGenerator/components/ViewUserVisits.vue';
import CharacterControlPanel from '@/MainGenerator/components/CharacterControlPanel.vue';
import { useDisplayMode } from '@/MainGenerator/utils/useDisplayMode';
import { useMessageHandler } from '@/MainGenerator/utils/useMessageHandler';
import { ConfigUserType } from '@public/common/types/ConfigTypes';
import { GetUserVisits, ServiceVisitType } from '@public/common/subscribe/GetUserVisits';
import ErrorInitComponent from '@public/common/ErrorInitComponent.vue';
import { BotMessage } from '@/types/types';

// omikujiData
const omikujiData = validateOmikujiData(window.omikujiData);

// リアクティブ変数
const isInitialized = ref(true);
const userVisitsData = ref<Record<string, ServiceVisitType>>({});

// コンポーザブルの使用
const {
 botMessages,
 scriptManager,
 characterCollector,
 processComments,
 clearMessages,
 startTimers
} = useMessageHandler(omikujiData);

const {
 currentDisplayMode,
 currentScriptGameComponent,
 currentScriptGameProps,
 displaySize,
 switchToNextMode,
 switchToPrevMode,
 increaseDisplaySize,
 decreaseDisplaySize,
 forceUpdate
} = useDisplayMode(omikujiData, scriptManager, clearMessages);

// コンポーネントのref
const userVisitsRef = ref<InstanceType<typeof ViewUserVisits>>();
const scriptGameRef = ref();

// 設定の読み込み
const config: ConfigUserType = window.CONFIG ?? {
 IS_DIFF_MODE: true,
 ENABLED_SERVICES: 'all',
 THRESHOLD: {
  conditions: [],
  user: [],
  access: [],
  gift: [],
  comment: []
 }
};

// GetUserVisitsコンポーザブルから取得
const { fetchComments } = GetUserVisits(config);

// 初期化処理
onMounted(async () => {
 try {
  const isInit = await fetchComments((userVisitsDataParam, comments) => {
   userVisitsData.value = userVisitsDataParam;
   processComments(comments);
   forceUpdate(); // Scripts更新トリガー
  });

  isInitialized.value = isInit;
  // タイマー開始
  if (isInit) startTimers();
 } catch (error) {
  console.error('初期化エラー:', error);
  isInitialized.value = false;
 }
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@700;900&display=swap');
html,
body {
 height: 100%;
 width: 100%;
 margin: 0;
 padding: 0;
 overflow: hidden;
 font-family: 'Zen Maru Gothic', sans-serif;
}
#App {
 height: 100%;
 width: 100%;
}
</style>
