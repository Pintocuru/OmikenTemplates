<!-- src/configMaker/RandomItems.vue -->
<template>
 <!-- 追加ボタン(上部) -->
 <div class="mb-4">
  <button @click="addSeed(true)" class="btn btn-success px-3 py-1 rounded hover:opacity-80">
   + 追加
  </button>
 </div>

 <div class="space-y-3">
  <div
   v-for="(seed, index) in configStore.bingoRandomSeeds"
   :key="`random-${index}`"
   class="flex items-center gap-2"
  >
   <!-- フォーム -->
   <BingoItemForm
    v-model:seed="configStore.bingoRandomSeeds[index]"
    :data="configStore.bingoRandomSeeds"
    :isRandom="true"
   />

   <!-- ハンバーガーメニュー -->
   <div class="relative">
    <button
     @click.stop="toggleMenu(index)"
     class="btn btn-ghost p-1 rounded hover:bg-gray-200"
     aria-label="メニューを開く"
    >
     <MoreVertical class="h-5 w-5" />
    </button>

    <div
     v-if="openMenuIndex === index"
     class="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10 border"
    >
     <div>
      <button @click.stop="copySeed(index)" class="btn btn-success w-full hover:opacity-80">
       複製
      </button>
      <button @click.stop="removeSeed(index)" class="btn btn-error w-full hover:opacity-80">
       消去
      </button>
     </div>
    </div>
   </div>
  </div>
 </div>

 <!-- 追加ボタン(下部) -->
 <div v-if="configStore.bingoRandomSeeds.length > 0" class="mt-4">
  <button @click="addSeed()" class="btn btn-success px-3 py-1 rounded hover:opacity-80">
   + 追加
  </button>
 </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { BingoItem } from '@/scripts/types';
import { useConfigMaker } from '@/configMaker/useConfigMaker';
import BingoItemForm from '@/configMaker/BingoItemForm.vue';
import { MoreVertical } from 'lucide-vue-next';
import { BingoItemSchema } from '@/scripts/schema';

// pinia
const configStore = useConfigMaker();

const openMenuIndex = ref<number | null>(null);

// メニューボタンの開閉
const toggleMenu = (index: number) => {
 openMenuIndex.value = openMenuIndex.value === index ? null : index;
};

const addSeed = (isTop: boolean = false) => {
 const newSeed: BingoItem = BingoItemSchema.parse({});
 isTop ? configStore.bingoRandomSeeds.unshift(newSeed) : configStore.bingoRandomSeeds.push(newSeed);
};

const copySeed = (index: number) => {
 const newSeed = { ...configStore.bingoRandomSeeds[index] };
 configStore.bingoRandomSeeds.splice(index + 1, 0, newSeed);
 openMenuIndex.value = null;
};

const removeSeed = (index: number) => {
 configStore.bingoRandomSeeds.splice(index, 1);
 openMenuIndex.value = null;
};
</script>
