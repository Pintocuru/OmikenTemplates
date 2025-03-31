<!-- src/apps/configMaker/components/ConfigPreview.vue -->
<template>
 <div class="space-y-4">
  <div class="flex justify-between mb-4">
   <h3 class="text-lg font-semibold">設定プレビュー</h3>
   <div class="flex gap-2">
    <button class="btn btn-sm" @click="toggleFormat">
     {{ isFormatted ? 'コンパクト表示' : '整形表示' }}
    </button>
    <button class="btn btn-sm btn-primary" @click="copyToClipboard">クリップボードにコピー</button>
   </div>
  </div>

  <div class="tabs tabs-boxed mb-2">
   <a class="tab" :class="{ 'tab-active': viewMode === 'all' }" @click="viewMode = 'all'">
    すべて
   </a>
   <a
    v-for="(set, index) in configStore.counterSets"
    :key="set.id"
    class="tab"
    :class="{ 'tab-active': viewMode === index }"
    @click="viewMode = index"
   >
    {{ set.generator.title || `Set ${index + 1}` }}
   </a>
  </div>

  <div class="mockup-code bg-neutral text-neutral-content">
   <pre class="whitespace-pre-wrap px-4"><code>{{ currentConfig }}</code></pre>
  </div>

  <div v-if="copySuccess" class="alert alert-success">
   <svg
    xmlns="http://www.w3.org/2000/svg"
    class="stroke-current shrink-0 h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
   >
    <path
     stroke-linecap="round"
     stroke-linejoin="round"
     stroke-width="2"
     d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
   </svg>
   <span>設定をクリップボードにコピーしました</span>
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useConfigMaker } from './useConfigMaker';

const configStore = useConfigMaker();
const isFormatted = ref(true);
const viewMode = ref<'all' | number>('all');
const copySuccess = ref(false);

// 表示形式の切り替え
const toggleFormat = () => {
 isFormatted.value = !isFormatted.value;
};

// 表示する設定
const currentConfig = computed(() => {
 let config;

 if (viewMode.value === 'all') {
  config = {
   counterSets: configStore.counterSets
  };
 } else {
  config = configStore.counterSets[viewMode.value as number];
 }

 return isFormatted.value ? JSON.stringify(config, null, 2) : JSON.stringify(config);
});

// クリップボードにコピー
const copyToClipboard = () => {
 navigator.clipboard
  .writeText(currentConfig.value)
  .then(() => {
   copySuccess.value = true;
   setTimeout(() => {
    copySuccess.value = false;
   }, 3000);
  })
  .catch((err) => {
   console.error('クリップボードへのコピーに失敗しました:', err);
  });
};
</script>
