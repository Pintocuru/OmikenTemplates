<!-- src/configMaker/components/dev/components/DevFileSave.vue -->
<template>
 <div class="bg-black bg-opacity-20 rounded-lg p-4">
  <h3 class="font-medium mb-3 flex items-center gap-2">
   <Save class="w-4 h-4" />
   設定保存
  </h3>
  <div class="space-y-2">
   <input
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    type="text"
    placeholder="ファイル名 (例: my-preset)"
    class="input input-sm w-full text-black"
    @keypress.enter="$emit('save')"
   />
   <button
    @click="$emit('save')"
    :disabled="!modelValue.trim() || isSaving"
    class="btn btn-success btn-sm w-full"
   >
    <span v-if="isSaving" class="loading loading-spinner loading-xs mr-2"></span>
    <Save class="w-4 h-4 mr-2" />
    サーバーに保存
   </button>
  </div>
 </div>
</template>

<script setup lang="ts">
import { Save } from 'lucide-vue-next';

interface Props {
 modelValue: string;
 isSaving: boolean;
}

interface Emits {
 (e: 'update:modelValue', value: string): void;
 (e: 'save'): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>
