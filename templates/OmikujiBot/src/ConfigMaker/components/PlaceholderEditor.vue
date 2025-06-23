<!-- src/configMaker/components/PlaceholderEditor.vue -->
<template>
 <!-- タブ部分 -->
 <RuleTabs :rules="placeholderList" :selectedRule="selectedSource" ruleType="placeholders" />

 <!-- プレースホルダー編集エリア -->
 <div v-if="selectedSource">
  <div class="card bg-base-300 mt-4">
   <div class="card-title bg-secondary text-lg p-2 pl-4 rounded-t">
    基本設定
    <span class="ml-2 cursor-help" title="説明"> ℹ️ </span>
   </div>
   <div class="card-body space-y-3">
    <!-- ID表示とコピー -->
    <div class="form-control">
     <label class="label">
      <span class="label-text font-medium">プレースホルダーID</span>
     </label>
     <div class="flex gap-2 items-center">
      <div class="w-full px-4 py-2 rounded bg-base-200 text-gray-600 break-all">
       {{ selectedSource.id }}
      </div>
      <!-- コピーボタン -->
      <CopyButton :value="`<<${selectedSource.id}>>`" title="IDをコピー" />
      <!-- 編集ボタン -->
      <PlaceholderIdEditor :currentId="selectedSource.id" />
     </div>
    </div>

    <div class="grid grid-cols-1 gap-3">
     <!-- プレースホルダー名 -->
     <div class="form-control">
      <label class="label">
       <span class="label-text font-medium">プレースホルダー名</span>
      </label>
      <input
       type="text"
       v-model="selectedSource.name"
       placeholder="プレースホルダー名を入力"
       class="input input-bordered w-full"
      />
     </div>
    </div>
   </div>
  </div>
  <!-- 値設定セクション -->
  <div class="card bg-base-300 mt-4">
   <div
    class="card-title bg-secondary text-lg p-2 pl-4 rounded-t flex justify-between items-center"
   >
    <div class="flex items-center">
     値設定
     <span class="ml-2 cursor-help" title="説明"> ℹ️ </span>
    </div>
    <!-- テキストエディットボタン -->
    <PlaceholderTextEdit :placeholderId="selectedSource.id" textContent="編集" />
   </div>
   <div class="card-body">
    <div v-for="(value, index) in selectedSource.values" :key="index" class="card bg-base-100 p-2">
     <div class="flex flex-col sm:flex-row sm:items-center sm:gap-2">
      <!-- 重み -->
      <input
       type="number"
       v-model.number="value.weight"
       min="0"
       class="input input-bordered input-sm w-full sm:w-24 mb-2 sm:mb-0"
       placeholder="重み"
      />

      <!-- 内容 -->
      <input
       type="text"
       v-model="value.content"
       placeholder="プレースホルダーの内容"
       class="input input-bordered input-sm w-full"
      />

      <!-- 複製・削除ボタン -->
      <div class="flex gap-1 mt-2 sm:mt-0 sm:ml-auto">
       <button @click="duplicateValue(index)" class="btn btn-xs btn-outline" title="複製">
        📋
       </button>
       <button
        @click="removeValue(index)"
        class="btn btn-xs btn-outline btn-error"
        title="削除"
        :disabled="selectedSource.values.length <= 1"
       >
        🗑️
       </button>
      </div>
     </div>
    </div>

    <button @click="addValue" class="btn btn-primary btn-sm w-full">+ 値を追加</button>
   </div>
  </div>

  <!-- プレビューセクション -->
  <PlaceholderPreview
   v-if="selectedSource.values.length > 0"
   :id="selectedSource.id"
   :values="selectedSource.values"
  />
 </div>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue';
import { usePlaceholderStore } from '../script/usePlaceholderStore';
import { createDefaultPlaceholderValue } from '@/types/OmikujiTypesSchema';
import { useOmikujiStore } from '../script/useOmikujiStore';
import RuleTabs from './RuleTabs.vue';
import CopyButton from './CopyButton.vue';
import PlaceholderIdEditor from './PlaceholderIdEditor.vue';
import PlaceholderTextEdit from './PlaceholderTextEdit.vue';
import PlaceholderPreview from './PlaceholderPreview.vue';

// ストアを使用
const placeholderStore = usePlaceholderStore();
const omikujiStore = useOmikujiStore();

// RuleTabsコンポーネントで使用するstore機能を拡張
const extendedStore = {
 ...placeholderStore,
 selectRule: (ruleId: string) => {
  omikujiStore.selectCategory('placeholders');
  omikujiStore.selectRule(ruleId);
 }
};
provide('placeholdersRulesStore', extendedStore);

// computed
const selectedSource = computed(() => placeholderStore.selectedRule);

// プレースホルダーのリストを取得（RuleTabsで使用するためにorderプロパティを追加）
const placeholderList = computed(() => {
 const placeholders = Object.values(placeholderStore.placeholders || {});
 return placeholders.map((placeholder, index) => ({
  ...placeholder,
  order: index,
  isEnabled: true, // プレースホルダーは常に有効
  editorColor: '#3b82f6' // ブルーカラー
 }));
});

// 値の追加
const addValue = () => {
 if (!selectedSource.value) return;
 selectedSource.value.values.push(createDefaultPlaceholderValue());
};

// 値の削除
const removeValue = (index: number) => {
 if (!selectedSource.value || selectedSource.value.values.length <= 1) return;
 selectedSource.value.values.splice(index, 1);
};

// 値の複製
const duplicateValue = (index: number) => {
 if (!selectedSource.value) return;

 const original = selectedSource.value.values[index];
 const duplicated = JSON.parse(JSON.stringify(original));
 duplicated.content = `${original.content} (コピー)`;

 selectedSource.value.values.splice(index + 1, 0, duplicated);
};
</script>
