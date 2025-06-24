<!-- src/apps/configMaker/components/FormField.vue -->
<template>
 <div>
  <label class="label">
   <span class="label-text">{{ label }}</span>
  </label>

  <!-- テキストエリア -->
  <textarea
   v-if="type === 'textarea'"
   :value="value"
   :placeholder="placeholder"
   :class="inputClasses"
   :rows="rows"
   @input="handleInput"
  />

  <!-- カラーピッカー -->
  <input
   v-else-if="type === 'color'"
   :value="value"
   type="color"
   :class="[inputClasses, 'h-12']"
   @input="handleInput"
  />

  <!-- 数値入力 -->
  <input
   v-else-if="type === 'number'"
   :value="value"
   type="number"
   :min="min"
   :max="max"
   :step="step"
   :placeholder="placeholder"
   :class="inputClasses"
   @input="handleNumberInput"
  />

  <!-- URL入力 -->
  <input
   v-else-if="type === 'url'"
   :value="value"
   type="url"
   :placeholder="placeholder"
   :class="inputClasses"
   @input="handleInput"
  />

  <!-- 通常のテキスト入力 -->
  <input
   v-else
   :value="value"
   type="text"
   :placeholder="placeholder"
   :class="inputClasses"
   @input="handleInput"
  />

  <!-- バリデーションエラー表示 -->
  <div v-if="error" class="text-error text-sm mt-1">
   {{ error }}
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
 defineProps<{
  label: string;
  value?: string | number;
  type?: 'text' | 'number' | 'url' | 'color' | 'textarea';
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
  size?: 'sm' | 'md' | 'lg';
  error?: string;
 }>(),
 {
  type: 'text',
  placeholder: '',
  rows: 3,
  size: 'md'
 }
);

const emit = defineEmits<{
 update: [value: string | number];
}>();

const inputClasses = computed(() => [
 props.type === 'textarea' ? 'textarea textarea-bordered w-full' : 'input input-bordered w-full',
 {
  'input-sm textarea-sm': props.size === 'sm',
  'input-lg textarea-lg': props.size === 'lg'
 },
 props.error && 'input-error textarea-error'
]);

const handleInput = (event: Event) => {
 const target = event.target as HTMLInputElement | HTMLTextAreaElement;
 emit('update', target.value);
};

const handleNumberInput = (event: Event) => {
 const target = event.target as HTMLInputElement;
 const value = parseInt(target.value);
 emit('update', isNaN(value) ? 0 : value);
};
</script>
