<!-- src/configMaker/components/comments/OmikujiSetEditor.vue -->
<template>
 <div class="card bg-base-300 mt-4">
  <div class="card-title bg-secondary text-lg p-2 pl-4 rounded-t flex justify-between items-center">
   <span>おみくじ設定 ({{ modelValue.length }}種/ 重さ: {{ totalWeight }})</span>
   <!-- キャラクター一括変更ボタン -->
   <CharacterBulkChanger
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
   />
  </div>
  <div class="card-body p-3">
   <!-- おみくじセットコンポーネント -->
   <div
    v-for="(omikuji, index) in modelValue"
    :key="index"
    class="card bg-base-100 p-3 border-l-4"
    :class="{
     'opacity-50': dragIndex === index,
     'border-l-primary': index % 2 === 0,
     'border-l-secondary': index % 2 === 1
    }"
    @dragover.prevent
    @drop="onDrop(index, $event)"
   >
    <div class="flex items-center gap-4">
     <!-- ドラッグハンドル -->
     <div
      class="cursor-move text-base-content/50 hover:text-base-content"
      draggable="true"
      @dragstart="onDragStart(index, $event)"
      @dragend="onDragEnd"
     >
      <GripVertical class="w-5 h-5" />
     </div>

     <!-- 名前 -->
     <div class="form-control flex-1">
      <SettingItem label="おみくじ名" description="識別しやすい名前を入力" :show-reset="false">
       <input
        type="text"
        :value="omikuji.name"
        @input="updateOmikuji(index, 'name', ($event.target as HTMLInputElement).value)"
        placeholder="おみくじ名"
        class="input input-bordered input-sm w-full"
       />
      </SettingItem>
     </div>

     <!-- 重み -->
     <div class="form-control flex-1">
      <SettingItem label="重み" description="数値が高いほど出やすくなります" :show-reset="false">
       <input
        type="number"
        :value="omikuji.weight"
        @input="
         updateOmikuji(index, 'weight', parseFloat(($event.target as HTMLInputElement).value))
        "
        min="0"
        class="input input-bordered input-sm w-full"
       />
      </SettingItem>
     </div>

     <!-- メニュー -->
     <div class="ml-auto">
      <MenuDropdown
       :disable-delete="modelValue.length <= 1"
       @duplicate="duplicateOmikuji(index)"
       @delete="removeOmikuji(index)"
      />
     </div>
    </div>

    <!-- Post Actions Editor コンポーネント JSON編集機能付き -->
    <PostActionsEditorJson v-model="omikuji.postActions" />
   </div>

   <button @click="addOmikuji" class="btn btn-primary btn-sm w-full">
    <Plus class="w-4 h-4" />
    おみくじセットを追加
   </button>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { OmikujiSetSchema, OmikujiSetType } from '@type/';
import { GripVertical, Plus } from 'lucide-vue-next';
import PostActionsEditorJson from './PostActionsEditorJson.vue';
import CharacterBulkChanger from './CharacterBulkChanger.vue';
import SettingItem from '@ConfigComponents/parts/SettingItem.vue';
import MenuDropdown from '@ConfigComponents/parts/MenuDropdown.vue';

const props = defineProps<{
 modelValue: OmikujiSetType[];
}>();
const emit = defineEmits<{
 'update:modelValue': [value: OmikujiSetType[]];
}>();

// 合計重みの計算
const totalWeight = computed(() => {
 return props.modelValue.reduce((sum, omikuji) => sum + (omikuji.weight || 0), 0);
});

// ドラッグ&ドロップ関連
const dragIndex = ref<number | null>(null);

const onDragStart = (index: number, event: DragEvent) => {
 dragIndex.value = index;
 if (event.dataTransfer) {
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', index.toString());
 }
};

const onDragEnd = () => {
 dragIndex.value = null;
};

const onDrop = (dropIndex: number, event: DragEvent) => {
 event.preventDefault();
 const draggedIndex = dragIndex.value;

 if (draggedIndex !== null && draggedIndex !== dropIndex) {
  const newValue = [...props.modelValue];
  const draggedItem = newValue[draggedIndex];

  // 配列から削除
  newValue.splice(draggedIndex, 1);

  // 新しい位置に挿入
  const insertIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
  newValue.splice(insertIndex, 0, draggedItem);

  emit('update:modelValue', newValue);
 }

 dragIndex.value = null;
};

// 統合された更新関数
const updateOmikuji = (index: number, key: keyof OmikujiSetType, value: any) => {
 const newValue = [...props.modelValue];
 newValue[index] = { ...newValue[index], [key]: value };
 emit('update:modelValue', newValue);
};

const addOmikuji = () => {
 emit('update:modelValue', [...props.modelValue, OmikujiSetSchema.parse({})]);
};

const removeOmikuji = (index: number) => {
 if (props.modelValue.length <= 1) return;
 const newValue = [...props.modelValue];
 newValue.splice(index, 1);
 emit('update:modelValue', newValue);
};

const duplicateOmikuji = (index: number) => {
 const original = props.modelValue[index];
 const duplicated = { ...JSON.parse(JSON.stringify(original)), name: `${original.name} (コピー)` };
 const newValue = [...props.modelValue];
 newValue.splice(index + 1, 0, duplicated);
 emit('update:modelValue', newValue);
};
</script>
