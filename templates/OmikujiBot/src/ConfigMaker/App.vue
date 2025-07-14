<!-- src/configMaker/App.vue -->
<template>
 <div class="p-4 max-w-6xl mx-auto">
  <h1 class="text-2xl font-bold mb-6 text-center text-primary">おみくじBot コンフィグエディター</h1>

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
    v-for="(tab, key) in navigationTabs"
    :key="key"
    :class="['tab', selectedCategory === key ? 'tab-active' : '', 'flex items-center gap-2']"
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
    <component :is="navigationTabs[selectedCategory].icon" class="w-5 h-5" />
    {{ navigationTabs[selectedCategory].label }}
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
import { CategoryType } from '@type/';
import { useOmikujiStore } from '@/ConfigMaker/script/useOmikujiStore';
import ConfigImport from '@/ConfigMaker/components/presets/ConfigImport.vue';
import ConfigExport from '@/ConfigMaker/components/presets/ConfigExport.vue';
import CommentRuleEditor from '@/ConfigMaker/components/comments/CommentRuleEditor.vue';
import TimerRuleEditor from '@/ConfigMaker/components/timers/TimerRuleEditor.vue';
import PlaceholderEditor from '@/ConfigMaker/components/placeholders/PlaceholderEditor.vue';
import ScriptSettingsEditor from '@/ConfigMaker/components/scripts/ScriptSettingsEditor.vue';
import CharacterEditor from '@/ConfigMaker/components/characters/CharacterEditor.vue';
import { storeToRefs } from 'pinia';
import { Toaster } from 'vue-sonner';
import { MessageCircle, Timer, Hash, Settings, Users, ArrowUp } from 'lucide-vue-next';

const omikujiStore = useOmikujiStore();

const showScrollTopButton = ref(false);

// スクロールイベントでボタンの表示制御
const handleScroll = () => {
 showScrollTopButton.value = window.scrollY > 300; // 300px以上スクロールで表示
};

// スクロールトップ処理
const scrollToTop = () => {
 window.scrollTo({ top: 0, behavior: 'smooth' });
};

// storeToRefsを使って反応性を保持
const { selectedCategory, data } = storeToRefs(omikujiStore);

// ナビゲーションタブの設定
const navigationTabs = {
 comments: { label: 'コメントルール', icon: MessageCircle },
 timers: { label: 'タイマールール', icon: Timer },
 placeholders: { label: 'プレースホルダー', icon: Hash },
 scriptSettings: { label: 'スクリプト設定', icon: Settings },
 characters: { label: 'キャラクター', icon: Users }
} as const;

// カテゴリごとのアイテム数を取得
const getCategoryItemCount = (category: CategoryType): number => {
 const items = data.value[category];
 return items ? Object.keys(items).length : 0;
};

// マウント時にリスナー登録
onMounted(() => {
 window.addEventListener('scroll', handleScroll);
});
</script>
