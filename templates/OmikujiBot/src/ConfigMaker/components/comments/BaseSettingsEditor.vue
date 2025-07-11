<!-- src/configMaker/components/BaseSettingsEditor.vue -->
<template>
 <div class="card bg-base-300 mt-4">
  <!-- ヘッダー（タイトル＋右上スイッチ） -->
  <div class="card-title bg-secondary text-lg p-2 pl-4 rounded-t flex items-center justify-between">
   <div class="flex items-center gap-2">
    <!-- エディターカラー（アイコン化） -->
    <div class="relative">
     <button
      class="btn btn-sm btn-square border-2 border-white/20"
      :style="{ backgroundColor: modelValue.editorColor }"
      title="エディターカラー"
      @click="toggleColorPicker"
     >
      🎨
     </button>

     <!-- カラーピッカー -->
     <div
      v-if="showColorPicker"
      class="absolute top-full left-0 mt-2 z-50 bg-base-100 p-4 rounded-lg shadow-lg border w-64"
     >
      <div class="grid grid-cols-6 gap-2 mb-3">
       <div v-for="color in presetColors" :key="color" class="p-1">
        <button
         class="w-6 h-6 rounded-full border-2 block"
         :class="modelValue.editorColor === color ? 'border-white' : 'border-gray-400'"
         :style="{ backgroundColor: color }"
         @click="editorColor = color"
        ></button>
       </div>
      </div>
      <input type="color" v-model="editorColor" class="w-full h-8 cursor-pointer" />
     </div>
    </div>
    <span>基本設定</span>
   </div>
   <!-- ルール有効スイッチ -->
   <label class="cursor-pointer flex items-center gap-2">
    <input type="checkbox" v-model="isEnabled" class="toggle toggle-primary" />
    <span class="text-sm">ルールを有効にする</span>
   </label>
  </div>

  <!-- ボディ -->
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
   <!-- ルール名 -->
   <div class="form-control">
    <label class="label">
     <span class="label-text font-medium">ルール名</span>
    </label>
    <input
     type="text"
     v-model="name"
     placeholder="ルール名を入力"
     class="input input-bordered w-full"
    />
   </div>

   <!-- 説明 -->
   <div class="form-control">
    <label class="label">
     <span class="label-text font-medium">説明</span>
    </label>
    <input
     type="text"
     v-model="description"
     placeholder="ルールの説明を入力"
     class="input input-bordered w-full"
    />
   </div>
  </div>
 </div>

 <!-- カラーピッカー外側クリック検知用 -->
 <div v-if="showColorPicker" class="fixed inset-0 z-40" @click="closeColorPicker"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { RuleType } from '@/types/OmikujiTypesSchema';

const props = defineProps<{
 modelValue: RuleType;
}>();

const emit = defineEmits<{
 'update:modelValue': [value: RuleType];
}>();

// カラーピッカー関連
const showColorPicker = ref(false);

// プリセットカラー
const presetColors = [
 '#3B82F6', // Blue
 '#EF4444', // Red
 '#10B981', // Green
 '#F59E0B', // Yellow
 '#8B5CF6', // Purple
 '#EC4899', // Pink
 '#06B6D4', // Cyan
 '#84CC16', // Lime
 '#F97316', // Orange
 '#6B7280', // Gray
 '#1F2937', // Dark Gray
 '#000000' // Black
];

// 各プロパティに対する書き込み可能な computed プロパティを作成
// これらの computed プロパティが、v-model のインターフェースとして機能します。

const name = computed({
 get: () => props.modelValue.name,
 set: (value) => {
  emit('update:modelValue', { ...props.modelValue, name: value });
 }
});

const description = computed({
 get: () => props.modelValue.description,
 set: (value) => {
  emit('update:modelValue', { ...props.modelValue, description: value });
 }
});

const isEnabled = computed({
 get: () => props.modelValue.isEnabled,
 set: (value) => {
  emit('update:modelValue', { ...props.modelValue, isEnabled: value });
 }
});

const editorColor = computed({
 get: () => props.modelValue.editorColor,
 set: (value) => {
  emit('update:modelValue', { ...props.modelValue, editorColor: value });
 }
});

const toggleColorPicker = () => {
 showColorPicker.value = !showColorPicker.value;
};

const closeColorPicker = () => {
 showColorPicker.value = false;
};

// ESCキーでカラーピッカーを閉じる
const handleKeyDown = (event: KeyboardEvent) => {
 if (event.key === 'Escape') {
  closeColorPicker();
 }
};

onMounted(() => {
 document.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
 document.removeEventListener('keydown', handleKeyDown);
});
</script>
