// src/scripts/useBingoState.ts
import { ref, computed, Ref, watch, onMounted } from 'vue';
import { ThemeType } from '@/scripts/types';

export function useBingoState() {
 // 状態管理
 const cardSize: Ref<3 | 4 | 5> = ref(3);
 const difficultyLevel: Ref<number> = ref(3);
 const theme: Ref<ThemeType> = ref('light');

 // 配列サイズをcardSizeに基づいて動的に計算
 const totalCells = computed(() => cardSize.value * cardSize.value);

 // テーマ変更の監視
 watch(
  theme,
  (newTheme) => {
   // data-themeの変更
   document.documentElement.setAttribute('data-theme', newTheme);

   // data-set-theme と data-act-class を動的に変更
   const elements = document.querySelectorAll('[data-set-theme]');
   elements.forEach((element) => {
    // 現在選ばれているテーマに一致する要素をアクティブにする
    if (element.getAttribute('data-set-theme') === newTheme) {
     element.classList.add('active'); // 選択されたテーマを強調
    } else {
     element.classList.remove('active'); // 非選択のテーマは強調を外す
    }
   });
  },
  { immediate: true }
 );

 // 初期テーマを手動で設定（theme-change との同期）
 onMounted(() => {
  document.documentElement.setAttribute('data-theme', theme.value);
 });

 // カードサイズが変更されたときの配列サイズ更新用関数
 const setCardSize = (size: 3 | 4 | 5) => {
  cardSize.value = size;
 };

 return {
  cardSize,
  difficultyLevel,
  theme,
  totalCells,
  setCardSize
 };
}
