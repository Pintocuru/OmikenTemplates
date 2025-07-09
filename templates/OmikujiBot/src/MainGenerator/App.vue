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
  <ViewBotToast :botMessages="toastMessages" />

  <!-- 表示モード切り替えアイコン -->
  <div
   class="fixed bottom-5 right-5 w-12 h-12 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center cursor-pointer z-[1000] transition-all duration-300 hover:scale-110"
   @click="nextDisplayMode"
   @contextmenu.prevent="prevDisplayMode"
  >
   <img src="./icons/toggle-mode.svg" alt="表示モード切り替え" class="w-8 h-8 invert" />
  </div>

  <!-- スクリプトゲーム選択UI（scriptGameモード時のみ表示） -->
  <div v-if="currentDisplayMode === 'scriptGame'" class="fixed top-5 left-5 flex gap-2 z-[1000]">
   <button
    v-for="(preset, key) in scriptGameMap"
    :key="key"
    @click="setScriptGameKey(key)"
    :class="[
     'px-3 py-1 rounded text-sm font-medium transition-colors',
     currentScriptGameKey === key
      ? 'bg-blue-500 text-white'
      : 'bg-white/20 text-white hover:bg-white/30'
    ]"
   >
    {{ key }}
   </button>
  </div>
 </div>
 <!-- わんコメが起動されていない場合のエラー表示 -->
 <ErrorInitComponent v-else :pluginUid="null" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { validateOmikujiData } from '@/types/OmikujiTypesSchema';
import ViewBotMessage from './components/ViewBotMessage.vue';
import ViewBotToast from './components/ViewBotToast.vue';
import ViewUserVisits from './components/ViewUserVisits.vue';
import { ConfigUserType } from '@common/types/ConfigTypes';
import { GetUserVisits, ServiceVisitType } from '@common/subscribe/GetUserVisits';
import ErrorInitComponent from '@common/ErrorInitComponent.vue';

// コンポーザブルのインポート
import { useDisplayMode } from '@/MainGenerator/utils/useDisplayMode';
import { useMessageHandler } from '@/MainGenerator/utils/useMessageHandler';

// omikujiData
const omikujiData = validateOmikujiData(window.omikujiData);

// リアクティブ変数
const isInitialized = ref(true);
const userVisitsData = ref<Record<string, ServiceVisitType>>({});

// コンポーザブルの使用
const { normalMessages, toastMessages, processComments, processor } =
 useMessageHandler(omikujiData);

const {
 currentDisplayMode,
 currentScriptGameKey,
 currentScriptGameComponent,
 currentScriptGameProps,
 scriptGameMap,
 displaySize,
 nextDisplayMode,
 prevDisplayMode,
 setScriptGameKey,
 updateRankingData // 新しく追加
} = useDisplayMode(omikujiData, processor);

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
   // processComments の後にランキングデータを更新
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
