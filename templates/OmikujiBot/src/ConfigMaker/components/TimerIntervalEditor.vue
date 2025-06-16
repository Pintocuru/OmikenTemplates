<!-- src/configMaker/components/TimerIntervalEditor.vue -->
<template>
 <div class="card bg-base-200 p-4">
  <h3 class="text-md font-semibold mb-3">タイマー設定</h3>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
   <!-- 間隔設定（秒） -->
   <div class="form-control">
    <label class="label">
     <span class="label-text font-medium">実行間隔（秒）</span>
     <span class="label-text-alt text-sm text-gray-500">
      {{ formatInterval(modelValue) }}
     </span>
    </label>
    <input
     type="number"
     :value="modelValue"
     @input="updateInterval(parseInt($event.target))"
     min="1"
     class="input input-bordered w-full"
     placeholder="秒数を入力"
    />
   </div>

   <!-- プリセット選択 -->
   <div class="form-control">
    <label class="label">
     <span class="label-text font-medium">プリセット</span>
    </label>
    <select
     :value="getPresetValue()"
     @change="applyPreset($event.target)"
     class="select select-bordered w-full"
    >
     <option value="">カスタム</option>
     <option v-for="preset in intervalPresets" :key="preset.value" :value="preset.value">
      {{ preset.label }}
     </option>
    </select>
   </div>
  </div>

  <!-- 詳細設定 -->
  <div class="mt-4 p-3 bg-base-100 rounded-lg">
   <h4 class="text-sm font-medium mb-2">詳細情報</h4>
   <div class="grid grid-cols-2 gap-4 text-sm">
    <div>
     <span class="text-gray-600">分換算:</span>
     <span class="ml-2 font-mono">{{ Math.round((modelValue / 60) * 100) / 100 }}分</span>
    </div>
    <div>
     <span class="text-gray-600">時間換算:</span>
     <span class="ml-2 font-mono">{{ Math.round((modelValue / 3600) * 100) / 100 }}時間</span>
    </div>
    <div>
     <span class="text-gray-600">1時間あたり:</span>
     <span class="ml-2 font-mono">{{ Math.round((3600 / modelValue) * 100) / 100 }}回</span>
    </div>
    <div>
     <span class="text-gray-600">1日あたり:</span>
     <span class="ml-2 font-mono">{{ Math.round((86400 / modelValue) * 100) / 100 }}回</span>
    </div>
   </div>
  </div>

  <!-- 注意事項 -->
  <div class="alert alert-info mt-4">
   <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    class="stroke-current shrink-0 w-6 h-6"
   >
    <path
     stroke-linecap="round"
     stroke-linejoin="round"
     stroke-width="2"
     d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    ></path>
   </svg>
   <div class="text-sm">
    <p><strong>タイマーについて:</strong></p>
    <ul class="list-disc list-inside mt-1">
     <li>設定した間隔で自動的におみくじが実行されます</li>
     <li>最小間隔は30秒です</li>
    </ul>
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
const updateInterval = (value: number) => {
 if (isNaN(value) || value < 1) return;
 emit('update:modelValue', value);
};

const applyPreset = (value: string) => {
 if (value === '') return;
 const presetValue = parseInt(value);
 if (!isNaN(presetValue)) {
  emit('update:modelValue', presetValue);
 }
};

const getPresetValue = () => {
 const preset = intervalPresets.find((p) => p.value === props.modelValue);
 return preset ? preset.value.toString() : '';
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
