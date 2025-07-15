<!-- src/configMaker/components/settings/WordPartyListMaker.vue -->
<template>
 <div class="p-4 max-w-2xl mx-auto">
  <input type="file" accept=".js" @change="handleFile" class="mb-4 block text-sm text-gray-700" />

  <ul v-if="setupList.length" class="space-y-3">
   <li
    v-for="(item, index) in setupList"
    :key="index"
    class="p-4 bg-white rounded shadow hover:bg-gray-50 transition"
   >
    <div class="font-semibold text-blue-600">{{ item.name }}</div>
    <div class="text-sm text-gray-700 mt-1">
     <span v-for="(p, i) in item.pattern" :key="i">
      <!-- コピーボタン -->
      <CopyButton :value="p" title="コピー" />
     </span>
    </div>
   </li>
  </ul>

  <div v-else class="text-gray-500">config.js を選択してください。</div>

  <div
   v-if="copiedText"
   class="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow"
  >
   ✅ コピー: {{ copiedText }}
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CopyButton from '@/ConfigMaker/components/parts/CopyButton.vue';

const setupList = ref<{ name: string; pattern: string[] }[]>([]);
const copiedText = ref('');

function handleFile(event: Event) {
 const input = event.target as HTMLInputElement;
 const file = input.files?.[0];
 if (!file) return;

 const reader = new FileReader();
 reader.onload = () => {
  const content = reader.result as string;

  // WordParty の setup をハイジャック
  (window as any).WordParty = {
   init(config: any) {
    return {
     setup(setups: any[]) {
      setupList.value = setups.map((s) => ({
       name: s.name ?? '',
       pattern: s.pattern ?? []
      }));
      return { start() {} };
     }
    };
   }
  };

  try {
   new Function(content)(); // eval 相当
  } catch (e) {
   alert('読み込み失敗: ' + e);
  }
 };

 reader.readAsText(file);
}

function copyToClipboard(text: string) {
 navigator.clipboard.writeText(text);
 copiedText.value = text;
 setTimeout(() => {
  copiedText.value = '';
 }, 1500);
}
</script>
