<!-- src/configMaker/components/OmikujiSetEditor.vue -->
<template>
 <div class="card bg-base-300 mt-4">
  <div class="card-title bg-secondary text-lg p-2 pl-4 rounded-t">おみくじ設定</div>
  <div class="card-body space-y-3">
   <!-- おみくじセットコンポーネント -->
   <div v-for="(omikuji, index) in modelValue" :key="index" class="card bg-base-100 p-3">
    <div class="flex items-center gap-4">
     <!-- 名前 -->
     <div class="form-control flex-1">
      <div class="flex items-center gap-2">
       <span class="text-xs w-12">名前</span>
       <input
        type="text"
        :value="omikuji.name"
        @input="updateOmikuji(index, 'name', ($event.target as HTMLInputElement).value)"
        placeholder="おみくじ名"
        class="input input-bordered input-sm w-full"
       />
      </div>
     </div>

     <!-- 重み -->
     <div class="form-control flex-1">
      <div class="flex items-center gap-2">
       <span class="text-xs w-12">重み</span>
       <input
        type="number"
        :value="omikuji.weight"
        @input="
         updateOmikuji(index, 'weight', parseFloat(($event.target as HTMLInputElement).value))
        "
        min="0"
        class="input input-bordered input-sm w-full"
       />
      </div>
     </div>

     <!-- メニュー -->
     <div class="ml-auto">
      <div class="dropdown dropdown-end">
       <label tabindex="0" class="btn btn-ghost">☰</label>
       <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-32">
        <li><button @click="duplicateOmikuji(index)" class="text-sm">📋 複製</button></li>
        <li>
         <button
          @click="removeOmikuji(index)"
          class="text-sm text-error"
          :disabled="modelValue.length <= 1"
         >
          🗑️ 削除
         </button>
        </li>
       </ul>
      </div>
     </div>
    </div>

    <!-- Post Actions Editor コンポーネント -->
    <div class="mt-3">
     <PostActionsEditor
      :model-value="omikuji.postActions"
      @update:model-value="updateOmikuji(index, 'postActions', $event)"
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

const props = defineProps<{ modelValue: OmikujiSetType[] }>();
const emit = defineEmits<{ 'update:modelValue': [value: OmikujiSetType[]] }>();

// 統合された更新関数
const updateOmikuji = (index: number, key: keyof OmikujiSetType, value: any) => {
 const newValue = [...props.modelValue];
 newValue[index] = { ...newValue[index], [key]: value };
 emit('update:modelValue', newValue);
};

const addOmikuji = () => {
 emit('update:modelValue', [...props.modelValue, createDefaultOmikujiSet()]);
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
