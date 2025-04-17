// src/BingoCard/useBingoState.ts
import { ref, Ref, watch, onMounted, computed } from 'vue';
import { ThemeType } from '@common/DaisyUi/DaisyUiTheme';
import { CardSize, validateBingoConfig } from '@/scripts/schema';

// config
const config = validateBingoConfig(window.BINGO_CONFIG);

export function useBingoState() {
 // 状態管理
 const cardSize: Ref<CardSize> = ref(config.bingoCard.cardSize);
 const theme: Ref<ThemeType> = ref(config.bingoCard.theme || 'light');

 // 総マス数を計算
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

 // 初期テーマを手動で設定
 onMounted(() => {
  document.documentElement.setAttribute('data-theme', theme.value);
 });

 return {
  cardSize,
  totalCells,
  theme
 };
}
