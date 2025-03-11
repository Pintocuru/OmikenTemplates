// src/apps/scripts/useWordComponent.ts
import { computed, Ref, ref, watch } from 'vue';
import { WordCounterConfig } from './types';

const generatorProduction: WordCounterConfig['generator'] = {
 TARGET: window.WORD_CONFIG?.generator?.TARGET || 15, // 目標となる数値
 IS_LOOP: window.WORD_CONFIG?.generator?.IS_LOOP || false, // 目標達成後、色を変化させるか
 TEXTS_FIRST: window.WORD_CONFIG?.generator?.TEXTS_FIRST || undefined, // countが初期値のテキスト
 STYLES_FIRST: window.WORD_CONFIG?.generator?.STYLES_FIRST || undefined, // countが初期値のカラー(TailwindCSS使用)
 TEXTS: window.WORD_CONFIG?.generator?.TEXTS || null, // 数値が増えるたびに変化するテキスト
 TEXTS_AFTER: window.WORD_CONFIG?.generator?.TEXTS_AFTER || null, // 目標達成後、変化するテキスト(ランダム)
 STYLES: window.WORD_CONFIG?.generator?.STYLES || [], // 数値が増えるたびに変化するカラー(TailwindCSS使用)
 EASTER_MODE: window.WORD_CONFIG?.generator?.EASTER_MODE || undefined, // Splatoonの二つ名モード(隠し)
 EASTER_DATA: undefined // Splatoonの二つ名モード(隠し)
};

export function useWordComponent(
 count: Ref<number, number>,
 msAnimation = 1000,
 generatorTest?: WordCounterConfig['generator'],
 EASTER_DATA?: WordCounterConfig['generator']['EASTER_DATA']
) {
 const generator = generatorTest ? generatorTest : generatorProduction;

 // アニメーション中かどうか
 const isAnimating = ref(false);
 // ランダムテキスト用の状態変数
 const afterTextIndex = ref(0);

 // targetCountを最大とする強度
 const pulseIntensity = computed(() => {
  const targetCount = generator.TARGET || 1; // デフォルト値を設定
  return Math.min(count.value / targetCount, 1);
 });

 // 進捗率の計算
 const getProgressIndex = (totalItems: number) => {
  if (totalItems <= 0) return 0;
  const index = Math.floor((progressPercentage.value / 100) * totalItems);
  return index >= totalItems ? totalItems - 1 : index;
 };

 // 進捗率の計算
 const progressPercentage = computed(() => {
  const targetCount = generator.TARGET || 1; // デフォルト値を設定
  const percentage = (count.value / targetCount) * 100;

  // 隠しモードの場合
  if (generator.EASTER_MODE) return percentage % 100;

  // ループモードの場合
  return generator.IS_LOOP ? percentage % 100 : Math.min(percentage, 100);
 });

 // TEXTS_AFTERからランダムなテキストを選択する関数
 const getRandomAfterText = () => {
  const TEXTS_AFTER = generator?.TEXTS_AFTER ?? [];
  if (!TEXTS_AFTER || TEXTS_AFTER.length === 0) return '';

  afterTextIndex.value = Math.floor(Math.random() * TEXTS_AFTER.length);
  return TEXTS_AFTER[afterTextIndex.value];
 };

 // 進捗率に基づいたテキストとスタイルを取得
 const progressText = computed(() => {
  const { TEXTS, TEXTS_FIRST, TEXTS_AFTER } = generator;

  // pulseIntensityが0の場合、TEXTS_FIRSTを適用
  if (pulseIntensity.value === 0 && TEXTS_FIRST !== undefined && TEXTS_FIRST !== null) {
   return TEXTS_FIRST ?? '';
  }

  // イースターエッグ(隠しモード)
  if (generator.EASTER_MODE && EASTER_DATA) {
   return EASTER_DATA(pulseIntensity.value);
  }

  // targetCountを超えていて、TEXTS_AFTERがある場合は現在のランダム選択テキストを返す
  if (pulseIntensity.value >= 1 && TEXTS_AFTER && TEXTS_AFTER.length > 0) {
   return TEXTS_AFTER[afterTextIndex.value];
  }

  // 通常の処理
  const totalItems = TEXTS?.length ?? 0; // `null` / `undefined` の場合は `0`
  return totalItems > 0 ? TEXTS![getProgressIndex(totalItems)] : '';
 });

 // 進捗率に基づいたスタイルを取得
 const progressStyle = computed(() => {
  // pulseIntensityが0の場合、STYLES_FIRSTを適用
  const { STYLES, STYLES_FIRST } = generator;
  if (pulseIntensity.value === 0 && STYLES_FIRST !== undefined && STYLES_FIRST !== null) {
   return STYLES_FIRST;
  }

  return (
   STYLES?.[getProgressIndex(STYLES?.length || 0)] || {
    textColor: '',
    colorClass: ''
   }
  );
 });

 // カウンターのスタイル
 const counterStyle = computed(() => ({
  text: progressText.value,
  ...progressStyle.value
 }));

 // カウント変更時のアニメーション
 const triggerAnimation = () => {
  isAnimating.value = true;

  // pulseIntensityが1以上かつTEXTS_AFTERがある場合、新しいランダムテキストを選択
  if (pulseIntensity.value >= 1 && generator.TEXTS_AFTER && generator.TEXTS_AFTER.length > 0) {
   getRandomAfterText();
  }

  setTimeout(() => {
   isAnimating.value = false;
  }, msAnimation);
 };

 // 初期化時にランダムテキストを設定
 if (generator.TEXTS_AFTER && generator.TEXTS_AFTER.length > 0) {
  getRandomAfterText();
 }

 // props.countの変更を監視
 watch(
  () => count.value,
  (newCount, oldCount) => {
   if (newCount !== oldCount) triggerAnimation();
   // pulseIntensityが1である時、新しいランダムテキストを選択
   if (pulseIntensity.value >= 1 && generator.TEXTS_AFTER && generator.TEXTS_AFTER.length > 0) {
    getRandomAfterText();
   }
  },
  { immediate: true }
 );

 return {
  generator,
  isAnimating,
  pulseIntensity,
  counterStyle
 };
}
