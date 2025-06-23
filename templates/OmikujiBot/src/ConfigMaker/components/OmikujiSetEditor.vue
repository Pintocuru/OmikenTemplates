<!-- src/configMaker/components/OmikujiSetEditor.vue -->
<template>
 <div class="card bg-base-300 mt-4">
  <div class="card-title bg-secondary text-lg p-2 pl-4 rounded-t">おみくじ設定</div>
  <div class="card-body space-y-3">
   <!-- おみくじセットコンポーネント -->
   <div v-for="(omikuji, index) in modelValue" :key="index" class="card bg-base-100 p-3">
    <div class="flex justify-between items-start mb-2">
     <h4 class="font-medium">おみくじセット {{ index + 1 }}</h4>
     <div class="flex gap-1">
      <button @click="duplicateOmikuji(index)" class="btn btn-xs btn-outline" title="複製">
       📋
      </button>
      <button
       @click="removeOmikuji(index)"
       class="btn btn-xs btn-outline btn-error"
       title="削除"
       :disabled="modelValue.length <= 1"
      >
       🗑️
      </button>
     </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
     <div class="form-control">
      <label class="label py-1">
       <span class="label-text text-sm">名前</span>
      </label>
      <input
       type="text"
       :value="omikuji.name"
       @input="updateOmikujiName(index, ($event.target as HTMLInputElement).value)"
       placeholder="おみくじ名"
       class="input input-bordered input-sm"
      />
     </div>

     <div class="form-control">
      <label class="label py-1">
       <span class="label-text text-sm">重み</span>
      </label>
      <input
       type="number"
       :value="omikuji.weight"
       @input="updateOmikujiWeight(index, parseFloat(($event.target as HTMLInputElement).value))"
       min="0"
       step="0.1"
       class="input input-bordered input-sm"
      />
     </div>
    </div>

    <!-- Post Actions Editor コンポーネント -->
    <div class="mt-3">
     <PostActionsEditor
      :model-value="omikuji.postActions"
      @update:model-value="updatePostActions(index, $event)"
     />
    </div>
   </div>

   <button @click="addOmikuji" class="btn btn-primary btn-sm w-full">+ おみくじセットを追加</button>
  </div>
 </div>
</template>

<script setup lang="ts">
import type { OmikujiSetType, PostActionType } from '@/types/OmikujiTypesSchema';
import { createDefaultOmikujiSet } from '@/types/OmikujiTypesSchema';
import PostActionsEditor from './PostActionsEditor.vue';

// Props
const props = defineProps<{
 modelValue: OmikujiSetType[];
}>();
const emit = defineEmits<{
 'update:modelValue': [value: OmikujiSetType[]];
}>();

// ヘルパー関数
const updateModelValue = (newValue: OmikujiSetType[]) => {
 emit('update:modelValue', newValue);
};

// メソッド
const updateOmikujiName = (index: number, name: string) => {
 const newValue = [...props.modelValue];
 newValue[index] = { ...newValue[index], name };
 updateModelValue(newValue);
};

const updateOmikujiWeight = (index: number, weight: number) => {
 const newValue = [...props.modelValue];
 newValue[index] = { ...newValue[index], weight };
 updateModelValue(newValue);
};

const updatePostActions = (index: number, postActions: PostActionType[]) => {
 const newValue = [...props.modelValue];
 newValue[index] = { ...newValue[index], postActions };
 updateModelValue(newValue);
};

const addOmikuji = () => {
 const newValue = [...props.modelValue, createDefaultOmikujiSet()];
 updateModelValue(newValue);
};

const removeOmikuji = (index: number) => {
 if (props.modelValue.length <= 1) return;

 const newValue = [...props.modelValue];
 newValue.splice(index, 1);
 updateModelValue(newValue);
};

const duplicateOmikuji = (index: number) => {
 const original = props.modelValue[index];
 const duplicated = JSON.parse(JSON.stringify(original));
 duplicated.name = `${original.name} (コピー)`;

 const newValue = [...props.modelValue];
 newValue.splice(index + 1, 0, duplicated);
 updateModelValue(newValue);
};
</script>
