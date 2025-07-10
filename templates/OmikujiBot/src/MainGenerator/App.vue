<!-- src/MainGenerator/App.vue -->
<template>
 <div v-if="isInitialized">
  <!-- 表示モード切り替えに応じたコンポーネント表示 -->
  <ViewBotMessage
   v-if="currentDisplayMode === 'messages'"
   :botMessages="normalMessages"
   :displaySize="displaySize"
  />

  <ViewUserVisits
   v-else-if="currentDisplayMode === 'userVisits'"
   :userVisitsData="userVisitsData"
   ref="userVisitsRef"
  />

  <!-- 動的コンポーネント表示（propsを動的に渡す） -->
  <component
   v-else-if="currentDisplayMode === 'scriptGame' && currentScriptGameComponent"
   :is="currentScriptGameComponent"
   v-bind="currentScriptGameProps"
   ref="scriptGameRef"
  />

  <!-- トースト表示（常時表示） -->
  <ViewBotToast :botMessages="toastMessages" :displaySize="displaySize" />

  <!-- 表示サイズ変更ボタン -->
  <div
   class="fixed bottom-2 right-18 w-12 h-12 bg-green-600/70 hover:bg-green-600/90 rounded-full flex items-center justify-center cursor-pointer z-50 transition-all duration-300 hover:scale-110"
   @click="increaseDisplaySize"
   @contextmenu.prevent="decreaseDisplaySize"
   title="左クリック：サイズ拡大 / 右クリック：サイズ縮小"
  >
   <ZoomIn class="w-6 h-6 text-white" />
  </div>

  <!-- 表示モード切り替えアイコン -->
  <div
   class="fixed bottom-2 right-2 w-12 h-12 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center cursor-pointer z-50 transition-all duration-300 hover:scale-110"
   @click="handleDisplayModeClick"
   @contextmenu.prevent="handleDisplayModeRightClick"
   title="左クリック：次のモード / 右クリック：前のモード"
  >
   <Monitor class="w-7 h-7 text-white" />
  </div>
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
import { useDisplayMode } from '@/MainGenerator/utils/useDisplayMode';
import { useMessageHandler } from '@/MainGenerator/utils/useMessageHandler';
import { ConfigUserType } from '@public/common/types/ConfigTypes';
import { GetUserVisits, ServiceVisitType } from '@public/common/subscribe/GetUserVisits';
import ErrorInitComponent from '@public/common/ErrorInitComponent.vue';
import { ZoomIn, Monitor } from 'lucide-vue-next';

// omikujiData
const omikujiData = validateOmikujiData(window.omikujiData);

// リアクティブ変数
const isInitialized = ref(true);
const userVisitsData = ref<Record<string, ServiceVisitType>>({});

// コンポーザブルの使用
const { normalMessages, toastMessages, processComments, processor, clearMessages, startTimers } =
 useMessageHandler(omikujiData);

const {
 currentDisplayMode,
 currentScriptGameComponent,
 currentScriptGameProps,
 displaySize,
 availableScriptIds,
 nextDisplayMode,
 prevDisplayMode,
 nextScriptGame,
 prevScriptGame,
 increaseDisplaySize,
 decreaseDisplaySize,
 updateRankingData
} = useDisplayMode(omikujiData, processor);

// コンポーネントのref
const userVisitsRef = ref<InstanceType<typeof ViewUserVisits>>();
const scriptGameRef = ref();

// 表示モード切り替えのクリックハンドラー
const handleDisplayModeClick = () => {
 // 切替時はメッセージをクリア
 clearMessages();
 if (currentDisplayMode.value === 'scriptGame' && availableScriptIds.value.length > 1) {
  // scriptGameモードで複数のスクリプトがある場合は、スクリプトを切り替え
  nextScriptGame();
 } else {
  // 通常の表示モード切り替え
  nextDisplayMode();
 }
};

// 表示モード切り替えの右クリックハンドラー
const handleDisplayModeRightClick = () => {
 // 切替時はメッセージをクリア
 clearMessages();
 if (currentDisplayMode.value === 'scriptGame' && availableScriptIds.value.length > 1) {
  // scriptGameモードで複数のスクリプトがある場合は、スクリプトを切り替え
  prevScriptGame();
 } else {
  // 通常の表示モード切り替え
  prevDisplayMode();
 }
};

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
   // ランキングデータ更新フラグ
   updateRankingData();
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
