<!-- src/configMaker/components/placeholders/PlaceholderEditor.vue -->
<template>
 <!-- タブ部分 -->
 <RuleTabs :rules="placeholdersArray" :selectedRule="selectedPlaceholder" ruleType="placeholders" />

 <!-- プレースホルダー編集エリア -->
 <div v-if="selectedPlaceholder">
  <div class="card bg-base-300 mt-4">
   <div class="card-title bg-secondary text-lg p-2 pl-4 rounded-t">
    <!-- カラーピッカー -->
    <ColorPicker v-model="selectedPlaceholder.editorColor" />
    基本設定
   </div>
   <div class="card-body space-y-3">
    <!-- ID表示とコピー -->
    <SettingItem
     label="ID"
     description="プレースホルダーの一意識別子"
     :showReset="false"
     containerClass="form-control"
    >
     <div class="flex gap-2 items-center">
      <div class="w-full px-4 py-2 rounded bg-base-200 text-gray-600 break-all">
       {{ selectedPlaceholder.id }}
      </div>
      <!-- コピーボタン -->
      <CopyButton :value="`<<${selectedPlaceholder.id}>>`" title="IDをコピー" />
      <!-- 編集ボタン -->
      <PlaceholderIdEditor :currentId="selectedPlaceholder.id" mode="placeholder" />
     </div>
    </SettingItem>

    <!-- プレースホルダー名 -->
    <SettingItem
     label="設定名"
     description="識別しやすい名前"
     :showReset="false"
     containerClass="form-control"
    >
     <input
      type="text"
      v-model="selectedPlaceholder.name"
      placeholder="設定名を入力"
      class="input input-bordered w-full"
     />
    </SettingItem>
   </div>
  </div>
  <!-- プレースホルダー設定セクション -->
  <PlaceholderValues :placeholderId="selectedPlaceholder.id" :key="selectedPlaceholder.id" />

  <!-- プレビューセクション -->
  <PlaceholderPreview
   v-if="selectedPlaceholder.values.length > 0"
   :id="selectedPlaceholder.id"
   :values="selectedPlaceholder.values"
  />
 </div>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue';
import { PlaceholderValueSchema } from '@type/';
import PlaceholderIdEditor from './PlaceholderIdEditor.vue';
import PlaceholderPreview from './PlaceholderPreview.vue';
import PlaceholderValues from './PlaceholderValues.vue';
import { usePlaceholderStore } from '@ConfigScript/usePlaceholderStore';
import { useOmikujiStore } from '@ConfigScript/useOmikujiStore';
import RuleTabs from '@ConfigComponents/parts/RuleTabs.vue';
import CopyButton from '@ConfigComponents/parts/CopyButton.vue';
import ColorPicker from '@ConfigComponents/parts/ColorPicker.vue';
import SettingItem from '@ConfigComponents/parts/SettingItem.vue';

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
const placeholdersArray = computed(() => placeholderStore.rulesArray);
const selectedPlaceholder = computed(() => placeholderStore.selectedRule);

// 値の追加
const addValue = () => {
 if (!selectedPlaceholder.value) return;
 selectedPlaceholder.value.values.push(PlaceholderValueSchema.parse({}));
};

// 値の削除
const removeValue = (index: number) => {
 if (!selectedPlaceholder.value || selectedPlaceholder.value.values.length <= 1) return;
 selectedPlaceholder.value.values.splice(index, 1);
};

// 値の複製
const duplicateValue = (index: number) => {
 if (!selectedPlaceholder.value) return;

 const original = selectedPlaceholder.value.values[index];
 const duplicated = JSON.parse(JSON.stringify(original));
 duplicated.content = `${original.content} (コピー)`;

 selectedPlaceholder.value.values.splice(index + 1, 0, duplicated);
};
</script>
