// src/scripts/useBingoState.ts
import { ref, computed, Ref, watch, onMounted } from 'vue';
import { BingoCard, ThemeType } from '@/scripts/types';

// config
const bingoCard: BingoCard = window.BINGO_CONFIG?.bingoCard || {
 cardSize: 3,
 theme: 'light',
 level: 1
};

export function useBingoState() {
 // 状態管理
 const cardSize: Ref<3 | 4 | 5> = ref(bingoCard.cardSize);
 const difficultyLevel: Ref<number> = ref(bingoCard.level || 1);
 const theme: Ref<ThemeType> = ref(bingoCard.theme || 'light');

 // 配列サイズをcardSizeに基づいて動的に計算
 const totalCells = computed(() => cardSize.value * cardSize.value);

 // テーマ変更の監視
 watch(
  theme,
  (newTheme) => {
   // data-themeの変更
   document.documentElement.setAttribute('data-theme', newTheme);
  },
  { immediate: true }
 );

 // 初期テーマを手動で設定（theme-change との同期）
 onMounted(() => {
  document.documentElement.setAttribute('data-theme', theme.value);
 });

 return {
  cardSize,
  difficultyLevel,
  theme,
  totalCells
 };
}
