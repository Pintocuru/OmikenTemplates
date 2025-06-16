<!-- src/configMaker/components/PlaceholderEditor.vue -->
<template>
 <div class="space-y-4">
  <!-- RuleTabs コンポーネントを使用 -->
  <RuleTabs
   :rules="placeholderList"
   :selectedRule="selectedSource"
   ruleNamePrefix="プレースホルダー"
   ruleTypeName="プレースホルダー"
   emptyMessage="プレースホルダーがありません"
   @selectRule="selectPlaceholder"
   @addRule="addNewPlaceholder"
   @duplicateRule="duplicatePlaceholder"
   @deleteRule="deletePlaceholder"
  />

  <!-- プレースホルダー編集エリア -->
  <div v-if="selectedSource" class="space-y-4">
   <div class="collapse-title text-lg font-semibold">プレースホルダー設定</div>

   <!-- 基本設定セクション -->
   <div class="card bg-base-200 p-4">
    <h3 class="text-md font-semibold mb-3">基本設定</h3>
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

     <!-- 説明 -->
     <div class="form-control">
      <label class="label">
       <span class="label-text font-medium">説明</span>
      </label>
      <textarea
       v-model="selectedSource.description"
       placeholder="プレースホルダーの説明を入力"
       class="textarea textarea-bordered w-full"
       rows="3"
      ></textarea>
     </div>
    </div>
   </div>

   <!-- 関連プレースホルダーID設定 -->
   <div class="form-control bg-base-200 p-3 rounded-lg">
    <label class="label py-0 pb-1">
     <span class="label-text font-medium">関連プレースホルダーID</span>
     <span class="label-text-alt text-sm text-gray-500">
      このプレースホルダーで使用する他のプレースホルダーのID
     </span>
    </label>

    <div class="flex flex-wrap gap-1 mb-2">
     <div
      v-for="(placeholderId, index) in selectedSource.placeholderIds"
      :key="index"
      class="badge badge-info badge-sm gap-1"
     >
      {{ placeholderId }}
      <button
       @click="removePlaceholderId(index)"
       class="btn btn-xs btn-ghost btn-circle h-4 w-4 min-h-0 p-0"
      >
       ✕
      </button>
     </div>
    </div>

    <div class="join w-full">
     <input
      type="text"
      v-model="newPlaceholderId"
      placeholder="プレースホルダーIDを入力"
      class="input input-bordered join-item w-full"
      @keyup.enter="addPlaceholderId"
     />
     <button @click="addPlaceholderId" class="btn btn-primary join-item ml-4 px-4">追加</button>
    </div>
   </div>

   <!-- 値設定セクション -->
   <div class="card bg-base-200 p-4">
    <h3 class="text-md font-semibold mb-3">値設定</h3>
    <div class="space-y-3">
     <div v-for="(value, index) in selectedSource.values" :key="index" class="card bg-base-100 p-3">
      <div class="flex justify-between items-start mb-2">
       <h4 class="font-medium">値 {{ index + 1 }}</h4>
       <div class="flex gap-1">
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

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
       <!-- 重み -->
       <div class="form-control">
        <label class="label py-1">
         <span class="label-text text-sm">重み</span>
        </label>
        <input
         type="number"
         v-model.number="value.weight"
         min="0"
         step="0.1"
         class="input input-bordered input-sm"
         placeholder="重み"
        />
       </div>

       <!-- 内容 -->
       <div class="form-control sm:col-span-2">
        <label class="label py-1">
         <span class="label-text text-sm">内容</span>
        </label>
        <textarea
         v-model="value.content"
         placeholder="プレースホルダーの内容を入力"
         class="textarea textarea-bordered textarea-sm"
         rows="2"
        ></textarea>
       </div>
      </div>
     </div>

     <button @click="addValue" class="btn btn-primary btn-sm w-full">+ 値を追加</button>
    </div>
   </div>

   <!-- プレビューセクション -->
   <div class="card bg-base-200 p-4" v-if="selectedSource.values.length > 0">
    <h3 class="text-md font-semibold mb-3">プレビュー</h3>
    <div class="bg-base-100 p-3 rounded">
     <div class="text-sm text-gray-600 mb-2"><strong>ID:</strong> {{ selectedSource.id }}</div>
     <div class="text-sm text-gray-600 mb-2"><strong>総重み:</strong> {{ totalWeight }}</div>
     <div class="text-sm text-gray-600 mb-3">
      <strong>値の数:</strong> {{ selectedSource.values.length }}
     </div>

     <div class="space-y-2">
      <div class="text-sm font-medium">値一覧:</div>
      <div class="space-y-1">
       <div
        v-for="(value, index) in selectedSource.values"
        :key="index"
        class="flex justify-between items-start bg-base-200 p-2 rounded text-sm"
       >
        <div class="flex-1 min-w-0">
         <div class="truncate">{{ value.content || '(内容なし)' }}</div>
        </div>
        <div class="flex-shrink-0 ml-2">
         <span class="badge badge-outline badge-xs">{{ value.weight }}</span>
         <span class="text-xs text-gray-500 ml-1">
          ({{ Math.round((value.weight / totalWeight) * 100) }}%)
         </span>
        </div>
       </div>
      </div>
     </div>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { usePlaceholderStore } from '../script/usePlaceholderStore';
import {
 createDefaultPlaceholderSourceValue,
 createDefaultPlaceholderSource
} from '@/types/OmikujiTypesSchema';
import RuleTabs from './RuleTabs.vue';

// ストアを使用
const placeholderStore = usePlaceholderStore();

// リアクティブデータ
const newPlaceholderId = ref('');

// computed
const selectedSource = computed(() => placeholderStore.selectedSource);

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

// 総重みを計算
const totalWeight = computed(() => {
 if (!selectedSource.value) return 0;
 return selectedSource.value.values.reduce((sum, value) => sum + (value.weight || 0), 0);
});

// ID生成ユーティリティ
const generateId = () => {
 return 'placeholder_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// 新しいプレースホルダーを追加
const addNewPlaceholder = () => {
 const newId = generateId();
 const newPlaceholder = createDefaultPlaceholderSource();
 newPlaceholder.id = newId;
 newPlaceholder.name = `プレースホルダー${placeholderList.value.length + 1}`;

 placeholderStore.addPlaceholder(newPlaceholder);
 placeholderStore.selectPlaceholder(newId);
};

// プレースホルダーを選択
const selectPlaceholder = (placeholderId: string) => {
 placeholderStore.selectPlaceholder(placeholderId);
};

// プレースホルダーの複製
const duplicatePlaceholder = (placeholderId: string) => {
 const original = placeholderStore.placeholders[placeholderId];
 if (original) {
  const newId = generateId();
  const duplicated = JSON.parse(JSON.stringify(original));
  duplicated.id = newId;
  duplicated.name = `${original.name} (コピー)`;

  placeholderStore.addPlaceholder(duplicated);
  placeholderStore.selectPlaceholder(newId);
 }
};

// プレースホルダーの削除
const deletePlaceholder = (placeholderId: string) => {
 placeholderStore.deletePlaceholder(placeholderId);

 // 最後のプレースホルダーを削除した場合、新しいものを自動作成
 if (placeholderList.value.length === 0) {
  addNewPlaceholder();
 }
};

// 関連プレースホルダーIDの追加
const addPlaceholderId = () => {
 if (!selectedSource.value || !newPlaceholderId.value.trim()) return;

 const id = newPlaceholderId.value.trim();
 if (!selectedSource.value.placeholderIds.includes(id)) {
  selectedSource.value.placeholderIds.push(id);
 }
 newPlaceholderId.value = '';
};

// 関連プレースホルダーIDの削除
const removePlaceholderId = (index: number) => {
 if (!selectedSource.value) return;
 selectedSource.value.placeholderIds.splice(index, 1);
};

// 値の追加
const addValue = () => {
 if (!selectedSource.value) return;
 selectedSource.value.values.push(createDefaultPlaceholderSourceValue());
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

onMounted(() => {
 // プレースホルダーが存在しない場合、デフォルトのプレースホルダーを作成
 if (placeholderList.value.length === 0) {
  addNewPlaceholder();
 }
});
</script>
