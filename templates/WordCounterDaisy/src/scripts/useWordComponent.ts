// src/apps/scripts/useWordComponent.ts
import { computed, Ref, ref, watch } from 'vue';
import { GeneratorConfig } from './types';

export function useWordComponent(
 count: Ref<number>,
 msAnimation = 1000,
 generator: GeneratorConfig
) {
 // 状態管理
 const isAnimating = ref(false);
 const afterTextIndex = ref(0);

 // 進捗率の計算（0〜1の範囲、ループする）
 const progress = computed(() => {
  const rawProgress = count.value / (generator.TARGET || 1);

  // イースターモードは常にループ
  if (generator.EASTER_MODE) return rawProgress % 1;

  return generator.IS_LOOP ? rawProgress % 1 : Math.min(rawProgress, 1);
 });

 // 進捗率
 const progressRatio = computed(() => (count.value === 0 ? 0 : Math.max(progress.value, 1)));

 // 配列内のインデックスを進捗率から計算
 const getItemByProgress = (items: any[] | null) => {
  if (!items || items.length === 0) return null;

  const index = Math.floor(progress.value * items.length);
  return items[Math.min(index, items.length - 1)];
 };

 // ランダムなテキストを選択
 const selectRandomAfterText = () => {
  const texts = generator.TEXTS_AFTER;
  if (!texts || texts.length === 0) return '';

  afterTextIndex.value = Math.floor(Math.random() * texts.length);
  return texts[afterTextIndex.value];
 };

 // 現在の状態に基づいてテキストを決定
 const currentText = computed(() => {
  // 初期状態
  if (count.value === 0 && generator.TEXTS_FIRST !== undefined) {
   return generator.TEXTS_FIRST;
  }

  // イースターエッグモード
  if (generator.EASTER_MODE && generator.EASTER_DATA) {
   return generator.EASTER_DATA(progressRatio.value);
  }

  // 目標達成後
  if (progress.value >= 1 && generator.TEXTS_AFTER && generator.TEXTS_AFTER.length > 0) {
   return generator.TEXTS_AFTER[afterTextIndex.value];
  }

  // 通常状態
  return getItemByProgress(generator.TEXTS) || '';
 });

 // 現在の状態に基づいてスタイルを決定
 const currentStyle = computed(() => {
  // 初期状態
  if (count.value === 0 && generator.STYLES_FIRST !== undefined) {
   return generator.STYLES_FIRST;
  }

  // 通常状態
  return getItemByProgress(generator.STYLES) || { textColor: '', colorClass: '' };
 });

 // カウンターのスタイル
 const counterStyle = computed(() => ({
  text: currentText.value,
  ...currentStyle.value
 }));

 // アニメーションのトリガー
 const triggerAnimation = () => {
  isAnimating.value = true;

  // 目標達成時、新しいランダムテキストを選択
  if (progress.value >= 1 && generator.TEXTS_AFTER && generator.TEXTS_AFTER.length > 0) {
   selectRandomAfterText();
  }

  setTimeout(() => {
   isAnimating.value = false;
  }, msAnimation);
 };

 // 初期化時にランダムテキストを設定
 if (generator.TEXTS_AFTER && generator.TEXTS_AFTER.length > 0) {
  selectRandomAfterText();
 }

 // countの変更を監視
 watch(
  () => count.value,
  (newCount, oldCount) => {
   if (newCount !== oldCount) {
    triggerAnimation();
   }
  },
  { immediate: true }
 );

 return {
  generator,
  isAnimating,
  progress,
  progressRatio,
  counterStyle
 };
}
