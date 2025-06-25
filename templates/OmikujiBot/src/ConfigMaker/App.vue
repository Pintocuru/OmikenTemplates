<!-- src/apps/configMaker/App.vue -->
<template>
 <div class="p-4 max-w-6xl mx-auto">
  <h1 class="text-2xl font-bold mb-6 text-center text-primary">おみくじBot コンフィグエディター</h1>

  <!-- アクションボタンとプリセット -->
  <div class="mb-4">
   <ConfigPresets />
  </div>

  <!-- ナビゲーションタブ -->
  <div class="tabs tabs-boxed mb-6 bg-base-300">
   <button
    v-for="(tab, key) in navigationTabs"
    :key="key"
    :class="['tab', selectedCategory === key ? 'tab-active' : '', 'flex items-center gap-2']"
    @click="selectCategory(key as CategoryType)"
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
</template>

<script setup lang="ts">
import { CategoryType } from '@/types/OmikujiTypesSchema';
import { useOmikujiStore } from '@ConfigScript/useOmikujiStore';
import ConfigPresets from '@ConfigComponents/ConfigPresets.vue';
import CommentRuleEditor from '@ConfigComponents/comments/CommentRuleEditor.vue';
import TimerRuleEditor from '@ConfigComponents/timers/TimerRuleEditor.vue';
import PlaceholderEditor from '@ConfigComponents/placeholders/PlaceholderEditor.vue';
import ScriptSettingsEditor from '@ConfigComponents/ScriptSettingsEditor.vue';
import CharacterEditor from '@ConfigComponents/characters/CharacterEditor.vue';
import { storeToRefs } from 'pinia';
import { Toaster } from 'vue-sonner';
import { MessageCircle, Timer, Hash, Settings, Users } from 'lucide-vue-next';

const omikujiStore = useOmikujiStore();

// storeToRefsを使って反応性を保持
const { selectedCategory, data } = storeToRefs(omikujiStore);
const { selectCategory } = omikujiStore;

// ナビゲーションタブの設定
const navigationTabs = {
 comments: { label: 'コメントルール', icon: MessageCircle },
 timers: { label: 'タイマールール', icon: Timer },
 placeholders: { label: 'プレースホルダー', icon: Hash },
 scriptSettings: { label: 'スクリプト設定', icon: Settings },
 characters: { label: 'キャラクター', icon: Users }
} as const;

// カテゴリごとのアイテム数を取得
const getCategoryItemCount = (category: string): number => {
 switch (category) {
  case 'comments':
   return Object.keys(data.value.comments).length;
  case 'timers':
   return Object.keys(data.value.timers).length;
  case 'placeholders':
   return Object.keys(data.value.placeholders).length;
  case 'scriptSettings':
   return Object.keys(data.value.scriptSettings).length;
  case 'characters':
   return Object.keys(data.value.characters).length;
  default:
   return 0;
 }
};
</script>
