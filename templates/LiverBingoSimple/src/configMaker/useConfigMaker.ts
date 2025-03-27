// src/configMaker/configMaker.ts
import { ref, watch } from 'vue';
import { BingoConfig, BingoItem } from '@/scripts/types';
import { useBingoState } from '@/scripts/useBingoState';
import { defineStore } from 'pinia';

// config
const configBingoSeeds: BingoItem[] = window.BINGO_CONFIG?.bingoSeeds || [];
const configBingoRandomSeeds: BingoItem[] = window.BINGO_CONFIG?.bingoRandomSeeds || [];

// ---

export const useConfigMaker = defineStore('config', () => {
 const { cardSize, theme } = useBingoState();

 // シード管理
 const bingoSeeds = ref<BingoItem[]>(configBingoSeeds);
 const bingoRandomSeeds = ref<BingoItem[]>(configBingoRandomSeeds);

 // カードサイズ変更時に固定項目数を調整
 watch(cardSize, (newSize) => {
  const newLength = newSize * newSize;
  if (bingoSeeds.value.length < newLength) {
   // 不足分を追加
   const addCount = newLength - bingoSeeds.value.length;
   for (let i = 0; i < addCount; i++) {
    bingoSeeds.value.push({
     title: '',
     target: 1,
     weight: 1,
     unit: 1
    });
   }
  } else if (bingoSeeds.value.length > newLength) {
   // 超過分を削除（空の項目から優先的に削除）
   const removeCount = bingoSeeds.value.length - newLength;
   const emptyIndices = bingoSeeds.value
    .map((seed, index) => (seed.title === '' ? index : -1))
    .filter((i) => i !== -1)
    .slice(0, removeCount);

   if (emptyIndices.length === removeCount) {
    // 空の項目だけで削除可能
    bingoSeeds.value = bingoSeeds.value.filter((_, index) => !emptyIndices.includes(index));
   } else {
    // 空の項目が足りない場合は末尾から削除
    bingoSeeds.value = bingoSeeds.value.slice(0, newLength);
   }
  }
 });

 // config.jsの生成
 const generateConfig = () => {
  const config: BingoConfig = {
   bingoCard: {
    cardSize: cardSize.value,
    theme: theme.value
   },
   bingoSeeds: bingoSeeds.value,
   bingoRandomSeeds: bingoRandomSeeds.value
  };

  const blob = new Blob(
   [
    `const BINGO_CONFIG = ${JSON.stringify(config, null, 2)};\n if (typeof window !== 'undefined') window.BINGO_CONFIG = BINGO_CONFIG;`
   ],
   { type: 'application/javascript' }
  );
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'config.js';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
 };

 return {
  bingoSeeds,
  bingoRandomSeeds,
  cardSize,
  theme,
  generateConfig
 };
});
