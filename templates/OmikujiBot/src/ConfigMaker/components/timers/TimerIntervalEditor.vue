<!-- src/configMaker/components/TimerIntervalEditor.vue -->
<template>
 <div class="card bg-base-300 mt-4">
  <div class="card-title bg-secondary text-lg p-2 pl-4 rounded-t">
   タイマー設定
   <span
    class="ml-2 cursor-help"
    title="タイマーについて: 設定した間隔で自動的におみくじが実行されます。最小間隔は30秒です。"
   >
    ℹ️
   </span>
  </div>

  <div class="card-body space-y-3">
   <!-- プリセット選択 -->
   <div class="form-control">
    <label class="label">
     <span class="label-text font-medium">実行間隔</span>
     <span class="label-text-alt text-sm text-gray-500">
      {{ formatInterval(modelValue) }}
     </span>
    </label>
    <select
     :value="modelValue"
     @change="applyPreset(($event.target as HTMLSelectElement).value)"
     class="select select-bordered w-full"
    >
     <option v-for="preset in intervalPresets" :key="preset.value" :value="preset.value">
      {{ preset.label }}
     </option>
    </select>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
// Props
const props = defineProps<{
 modelValue: number;
}>();

// Emits
const emit = defineEmits<{
 'update:modelValue': [value: number];
}>();

// プリセット定義
const intervalPresets = [
 { label: '30秒', value: 30 },
 { label: '1分', value: 60 },
 { label: '2分', value: 120 },
 { label: '3分', value: 180 },
 { label: '5分', value: 300 },
 { label: '10分', value: 600 },
 { label: '15分', value: 900 },
 { label: '30分', value: 1800 },
 { label: '1時間', value: 3600 }
];

// メソッド
const applyPreset = (value: string) => {
 const presetValue = parseInt(value);
 if (!isNaN(presetValue)) {
  emit('update:modelValue', presetValue);
 }
};

const formatInterval = (seconds: number) => {
 if (seconds < 60) {
  return `${seconds}秒`;
 } else if (seconds < 3600) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return remainingSeconds > 0 ? `${minutes}分${remainingSeconds}秒` : `${minutes}分`;
 } else {
  const hours = Math.floor(seconds / 3600);
  const remainingMinutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  let result = `${hours}時間`;
  if (remainingMinutes > 0) result += `${remainingMinutes}分`;
  if (remainingSeconds > 0) result += `${remainingSeconds}秒`;

  return result;
 }
};
</script>
