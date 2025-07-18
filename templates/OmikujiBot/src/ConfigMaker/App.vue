<!-- src/configMaker/App.vue -->
<template>
 <div class="p-4 max-w-6xl mx-auto">
  <h1 class="text-2xl font-bold mb-6 text-center text-primary">おみくじBot コンフィグエディター</h1>

  <!-- 開発者用プリセット読み書きコンポーネント -->
  <component :is="devToolsComponent" v-if="devToolsComponent" />

  <!-- アクションボタンとプリセット -->
  <div class="flex flex-wrap justify-between items-center mb-2 gap-4 min-w-0">
   <!-- インポート機能 -->
   <ConfigImport />
   <!-- エクスポート機能 -->
   <ConfigExport />
  </div>

  <!-- ナビゲーションタブ -->
  <div class="tabs tabs-boxed mb-6 bg-base-300">
   <button
    v-for="(tab, key) in categoryLabels"
    :key="key"
    :class="[
     'tab',
     selectedCategory === key ? 'tab-active' : '',
     'flex items-center gap-2 tooltip tooltip-top'
    ]"
    :data-tip="tab.description"
    @click="omikujiStore.selectCategory(key)"
   >
    <component :is="tab.icon" class="w-4 h-4" />
    {{ tab.label }}
    <span v-if="getCategoryItemCount(key) > 0" class="badge badge-sm badge-primary">
     {{ getCategoryItemCount(key) }}
    </span>
   </button>
  </div>

  <!-- 動的コンテンツエリア -->
  <div class="card bg-base-200">
   <div class="card-title bg-primary text-lg p-2 pl-4 rounded-t flex items-center gap-2">
    <component :is="categoryLabels[selectedCategory].icon" class="w-5 h-5" />
    {{ categoryLabels[selectedCategory].label }}
   </div>
   <div class="card-body">
    <!-- コメントルール -->
    <CommentRuleEditor v-if="selectedCategory === 'comments'" />

    <!-- タイマールール -->
    <TimerRuleEditor v-else-if="selectedCategory === 'timers'" />

    <!-- プレースホルダー -->
    <PlaceholderEditor v-else-if="selectedCategory === 'placeholders'" />

    <!-- スクリプト設定 -->
    <ScriptSettingsEditor v-else-if="selectedCategory === 'scriptSettings'" />

    <!-- キャラクター設定 -->
    <CharacterEditor v-else-if="selectedCategory === 'characters'" />

    <!-- 表示設定 -->
    <DisplaySettingsEditor v-else-if="selectedCategory === 'displaySettings'" />

    <!-- WordParty設定 -->
    <WordPartySettingsEditor v-else-if="selectedCategory === 'wordPartySettings'" />

    <!-- フォールバック -->
    <div v-else>
     <p class="text-gray-600">不明なカテゴリ: {{ selectedCategory }}</p>
    </div>
   </div>
  </div>
 </div>

 <!-- トースト通知コンポーネント -->
 <Toaster :expand="true" :richColors="true" :visibleToasts="5" />

 <!-- スクロールで表示されるTOPへ戻るボタン -->
 <button
  v-show="showScrollTopButton"
  @click="scrollToTop"
  class="fixed bottom-6 right-6 z-999 btn btn-circle btn-primary p-1 shadow-lg transition-opacity duration-300"
 >
  <ArrowUp class="w-12 h-12" />
 </button>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { CategoryType, categoryLabels, isDev } from '@type/';
import { useOmikujiStore } from '@ConfigScript/useOmikujiStore';
import ConfigImport from '@ConfigComponents/presets/ConfigImport.vue';
import ConfigExport from '@ConfigComponents/presets/ConfigExport.vue';
import CommentRuleEditor from '@ConfigComponents/comments/CommentRuleEditor.vue';
import TimerRuleEditor from '@ConfigComponents/timers/TimerRuleEditor.vue';
import PlaceholderEditor from '@ConfigComponents/placeholders/PlaceholderEditor.vue';
import ScriptSettingsEditor from '@ConfigComponents/scriptSettings/ScriptSettingsEditor.vue';
import WordPartySettingsEditor from '@ConfigComponents/wordPartySettings/WordPartySettingsEditor.vue';
import CharacterEditor from '@ConfigComponents/characters/CharacterEditor.vue';
import DisplaySettingsEditor from '@ConfigComponents/displaySettings/DisplaySettingsEditor.vue';
import { scriptGameKeys } from '@/ScriptGame/ScriptGameMap';
import { storeToRefs } from 'pinia';
import { Toaster } from 'vue-sonner';
import { ArrowUp } from 'lucide-vue-next';

// store
const omikujiStore = useOmikujiStore();
const { selectedCategory, data } = storeToRefs(omikujiStore);

// ref
const showScrollTopButton = ref(false);

// 開発者モード
const devToolsComponent = ref(null);
if (isDev) {
 import('@/ConfigMaker/dev/DevConfigs.vue').then((mod) => {
  devToolsComponent.value = mod.default;
 });
}

// スクロールイベントでボタンの表示制御
const handleScroll = () => {
 showScrollTopButton.value = window.scrollY > 300; // 300px以上スクロールで表示
};

// スクロールトップ処理
const scrollToTop = () => {
 window.scrollTo({ top: 0, behavior: 'smooth' });
};

// カテゴリごとのアイテム数を取得
const getCategoryItemCount = (category: CategoryType): number => {
 if (category === 'scriptSettings') return scriptGameKeys.length;
 if (category === 'displaySettings') return 0;

 const items = data.value[category];
 return items ? Object.keys(items).length : 0;
};

// マウント時にリスナー登録
onMounted(() => {
 window.addEventListener('scroll', handleScroll);
});
</script>
