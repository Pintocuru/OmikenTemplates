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
   class="fixed bottom-5 right-20 w-12 h-12 bg-green-600/70 hover:bg-green-600/90 rounded-full flex items-center justify-center cursor-pointer z-50 transition-all duration-300 hover:scale-110"
   @click="increaseDisplaySize"
   @contextmenu.prevent="decreaseDisplaySize"
   title="左クリック：サイズ拡大 / 右クリック：サイズ縮小"
  >
   <!-- TODO:lucide-vue-next を使って -->
   <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
     stroke-linecap="round"
     stroke-linejoin="round"
     stroke-width="2"
     d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
    ></path>
   </svg>
  </div>

  <!-- TODO:キャラクターにフキダシをつけるような時間経過で発生するやつを新設 -->

  <!-- 表示モード切り替えアイコン -->
  <div
   class="fixed bottom-5 right-5 w-12 h-12 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center cursor-pointer z-50 transition-all duration-300 hover:scale-110"
   @click="handleDisplayModeClick"
   @contextmenu.prevent="handleDisplayModeRightClick"
   title="左クリック：次のモード / 右クリック：前のモード"
  >
   <!-- TODO:キャラクターを使って可愛く仕上げたい -->
   <img src="./icons/toggle-mode.svg" alt="表示モード切り替え" class="w-8 h-8 invert" />
  </div>

  <!-- スクリプトゲーム選択時の追加情報表示 -->
  <div
   v-if="currentDisplayMode === 'scriptGame' && availableScriptIds.length > 1"
   class="fixed bottom-5 left-5 bg-black/70 text-white px-3 py-2 rounded-lg text-sm z-50"
  >
   {{ currentScriptGameKey }} ({{ availableScriptIds.indexOf(currentScriptGameKey) + 1 }}/{{
    availableScriptIds.length
   }})
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
import { Users } from 'lucide-vue-next';

// omikujiData
const omikujiData = validateOmikujiData(window.omikujiData);

// リアクティブ変数
const isInitialized = ref(true);
const userVisitsData = ref<Record<string, ServiceVisitType>>({});

// コンポーザブルの使用
const { normalMessages, toastMessages, processComments, processor, clearMessages } =
 useMessageHandler(omikujiData);

const {
 currentDisplayMode,
 currentScriptGameKey,
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
