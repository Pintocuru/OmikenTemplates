// src/configMaker/configMaker.ts
import { ref, watch, computed } from 'vue';
import { BingoConfig, BingoItem } from '@/scripts/schema';
import { useBingoState } from '@/BingoCard/useBingoState';
import { defineStore } from 'pinia';
import { BingoItemSchema, validateBingoConfig } from '@/scripts/schema';

// 定数
const FILE_NAME = 'config.js';
const MIME_TYPE = 'application/javascript';

// 初期設定の検証
const config = validateBingoConfig(window.BINGO_CONFIG);

/**
 * ビンゴ設定管理のためのPiniaストア
 */
export const useConfigMaker = defineStore('config', () => {
 const { cardSize, theme, totalCells } = useBingoState();

 // 状態管理
 const bingoSeeds = ref<BingoItem[]>(config.bingoSeeds);
 const bingoRandomSeeds = ref<BingoItem[]>(config.bingoRandomSeeds);

 /**
  * 新しい空のビンゴアイテムを作成
  * @returns 空のビンゴアイテム
  */
 const createEmptyBingoItem = (): BingoItem => {
  return BingoItemSchema.parse({});
 };

 /**
  * ビンゴシードの数を調整する
  * @param targetLength 目標の長さ
  */
 const adjustBingoSeedsLength = (targetLength: number) => {
  if (bingoSeeds.value.length === targetLength) {
   return;
  }

  if (bingoSeeds.value.length < targetLength) {
   // 不足分のアイテムを追加
   const additionalItems = Array(targetLength - bingoSeeds.value.length)
    .fill(null)
    .map(() => createEmptyBingoItem());

   bingoSeeds.value = [...bingoSeeds.value, ...additionalItems];
  } else {
   // 超過分のアイテムを削除
   const removeCount = bingoSeeds.value.length - targetLength;

   // 空のアイテムのインデックスを特定
   const emptyIndices = bingoSeeds.value
    .map((seed, index) => (seed.title === '' ? index : -1))
    .filter((i) => i !== -1)
    .slice(0, removeCount);

   if (emptyIndices.length === removeCount) {
    // 空のアイテムだけで削除可能な場合
    bingoSeeds.value = bingoSeeds.value.filter((_, index) => !emptyIndices.includes(index));
   } else {
    // 空のアイテムが足りない場合は末尾から削除
    bingoSeeds.value = bingoSeeds.value.slice(0, targetLength);
   }
  }
 };

 /**
  * 現在の設定からコンフィグオブジェクトを生成
  * @returns BingoConfig オブジェクト
  */
 const buildConfigObject = (): BingoConfig => {
  return {
   bingoCard: {
    cardSize: cardSize.value,
    theme: theme.value
   },
   bingoSeeds: bingoSeeds.value,
   bingoRandomSeeds: bingoRandomSeeds.value
  };
 };

 // JavaScript設定ファイルの内容を生成
 const buildConfigFileContent = (config: BingoConfig): string => {
  return (
   `const BINGO_CONFIG = ${JSON.stringify(config, null, 2)};\n` +
   `if (typeof window !== 'undefined') window.BINGO_CONFIG = BINGO_CONFIG;`
  );
 };

 // 現在の設定をファイルとしてダウンロード
 const generateConfig = async () => {
  try {
   const config = buildConfigObject();
   const content = buildConfigFileContent(config);

   const blob = new Blob([content], { type: MIME_TYPE });
   const url = URL.createObjectURL(blob);

   const link = document.createElement('a');
   link.href = url;
   link.download = FILE_NAME;

   // リンクをDOMに追加、クリック、そして削除
   document.body.appendChild(link);
   link.click();

   // クリーンアップ
   setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
   }, 100);

   return true;
  } catch (error) {
   console.error('設定ファイルの生成中にエラーが発生しました:', error);
   return false;
  }
 };

 /**
  * シードをインポート
  * @param seedData インポートするシードデータ
  */
 const importSeeds = (seedData: BingoItem[]) => {
  try {
   // 各シードアイテムを検証
   const validSeeds = seedData.map((seed) => BingoItemSchema.parse(seed));
   bingoRandomSeeds.value = validSeeds;
   return true;
  } catch (error) {
   console.error('シードのインポート中にエラーが発生しました:', error);
   return false;
  }
 };

 // カードサイズ変更時にシード数を調整
 watch(cardSize, (newSize) => {
  const newLength = newSize * newSize;
  adjustBingoSeedsLength(newLength);
 });

 // 有効なビンゴアイテム数の計算
 const validSeedCount = computed(
  () => bingoRandomSeeds.value.filter((item) => !!item.title).length
 );

 return {
  bingoSeeds,
  bingoRandomSeeds,
  cardSize,
  totalCells,
  theme,
  generateConfig,
  importSeeds,
  validSeedCount
 };
});
