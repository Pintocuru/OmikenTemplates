<!-- src/configMaker/components/HogeEditor.vue -->
<!-- これは構造テンプレートです -->
<template>
 <div class="collapse-title text-lg font-semibold">設定タイトル</div>
 <div class="space-y-3">
  <!-- 主要設定セクション -->
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
   <!-- 左カラム -->
   <div class="space-y-3">
    <!-- チェックボックス設定 -->
    <div class="card bg-base-200 p-2 compact">
     <label class="cursor-pointer label justify-start gap-2">
      <input type="checkbox" v-model="config.CHECKBOX_ITEM" class="toggle toggle-primary" />
      <span class="label-text">チェックボックス項目</span>
     </label>
    </div>

    <!-- セレクトボックス設定 -->
    <div class="form-control">
     <label class="block mb-1 font-medium">セレクトボックス</label>
     <select v-model="config.SELECT_ITEM" class="select select-bordered w-full">
      <option value="option1">オプション1</option>
      <option value="option2">オプション2</option>
      <optgroup label="グループ">
       <option value="group1">グループ項目1</option>
       <option value="group2">グループ項目2</option>
      </optgroup>
     </select>
    </div>
   </div>

   <!-- 右カラム：ラジオボタン -->
   <div class="grid grid-cols-1 gap-1">
    <label
     v-for="option in radioOptions"
     :key="option.value"
     class="flex items-center gap-2 hover:bg-base-300 p-1 rounded"
    >
     <input
      type="radio"
      name="radio-group"
      class="radio"
      :checked="config.RADIO_ITEM === option.value"
      @change="config.RADIO_ITEM = option.value"
     />{{ option.label }}
    </label>
   </div>
  </div>

  <!-- テキスト入力設定 -->
  <div class="form-control bg-base-200 p-3 rounded-lg">
   <label class="label py-0 pb-1">
    <span class="label-text font-medium">テキスト入力</span>
    <span class="label-text-alt text-sm text-gray-500">説明テキスト</span>
   </label>

   <div class="flex flex-wrap gap-1 mb-2">
    <div
     v-for="(item, index) in config.TEXT_ARRAY"
     :key="index"
     class="badge badge-secondary badge-sm gap-1"
    >
     {{ item }}
     <button
      @click="removeTextItem(index)"
      class="btn btn-xs btn-ghost btn-circle h-4 w-4 min-h-0 p-0"
     >
      ✕
     </button>
    </div>
   </div>

   <div class="join w-full">
    <input
     type="text"
     v-model="newTextItem"
     placeholder="テキストを入力"
     class="input input-bordered join-item w-full"
     @keyup.enter="addTextItem"
    />
    <button @click="addTextItem" class="btn btn-primary join-item ml-4 px-4">追加</button>
   </div>
  </div>

  <!-- 数値入力設定 -->
  <div class="form-control bg-base-200 p-3 rounded-lg">
   <label class="label py-0 pb-1">
    <span class="label-text font-medium">数値入力</span>
    <span class="label-text-alt text-sm text-gray-500">数値の説明</span>
   </label>
   <input
    type="number"
    v-model.number="config.NUMBER_ITEM"
    min="0"
    placeholder="数値を入力"
    class="input input-bordered w-full"
   />
  </div>

  <!-- テキストエリア設定 -->
  <div class="form-control bg-base-200 p-3 rounded-lg">
   <label class="label py-0 pb-1">
    <span class="label-text font-medium">テキストエリア</span>
    <span class="label-text-alt text-sm text-gray-500">複数行テキストの説明</span>
   </label>
   <textarea
    v-model="config.TEXTAREA_ITEM"
    placeholder="複数行テキストを入力"
    class="textarea textarea-bordered w-full"
    rows="3"
   ></textarea>
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// プロパティやストアの定義
interface ConfigType {
 CHECKBOX_ITEM: boolean;
 SELECT_ITEM: string;
 RADIO_ITEM: string;
 TEXT_ARRAY: string[];
 NUMBER_ITEM: number;
 TEXTAREA_ITEM: string;
}

// リアクティブデータ
const newTextItem = ref('');

// 設定データ（実際の実装では Pinia ストアなどを使用）
const config = computed<ConfigType>({
 get: () => ({
  CHECKBOX_ITEM: false,
  SELECT_ITEM: 'option1',
  RADIO_ITEM: 'radio1',
  TEXT_ARRAY: [],
  NUMBER_ITEM: 0,
  TEXTAREA_ITEM: ''
 }),
 set: (value) => {
  // 実際の実装では store.config = value などを使用
 }
});

// ラジオボタンの選択肢
const radioOptions = [
 { value: 'radio1', label: 'ラジオ1' },
 { value: 'radio2', label: 'ラジオ2' },
 { value: 'radio3', label: 'ラジオ3' }
];

// メソッド
const addTextItem = () => {
 if (newTextItem.value.trim()) {
  config.value.TEXT_ARRAY.push(newTextItem.value.trim());
  newTextItem.value = '';
 }
};

const removeTextItem = (index: number) => {
 config.value.TEXT_ARRAY.splice(index, 1);
};
</script>
