// src/apps/scripts/useWordComponent.ts
import { computed, ref, watch } from 'vue';
import { WordCounterConfig } from './types';

export interface Props {
 count: number;
 generator: WordCounterConfig['generator']; // generator プロパティを直接受け取る
}

export function useWordComponent(props: Props, msAnimation = 1000) {
 // アニメーション中かどうか
 const isAnimating = ref(false);

 // targetCountを最大とする強度
 const pulseIntensity = computed(() => {
  const targetCount = props.generator.TARGET || 1; // デフォルト値を設定
  return Math.min(props.count / targetCount, 1);
 });

 // 進捗率の計算
 const getProgressIndex = (totalItems: number) => {
  if (totalItems <= 0) return 0;
  const index = Math.floor((progressPercentage.value / 100) * totalItems);
  return index >= totalItems ? totalItems - 1 : index;
 };

 // 進捗率の計算
 const progressPercentage = computed(() => {
  const targetCount = props.generator.TARGET || 1; // デフォルト値を設定
  const percentage = (props.count / targetCount) * 100;

  // 隠しモードの場合
  if (props.generator.EASTER_MODE) return percentage % 100;

  // ループモードの場合
  return props.generator.IS_LOOP ? percentage % 100 : Math.min(percentage, 100);
 });

 // 進捗率に基づいたテキストとスタイルを取得
 const progressText = computed(() => {
  // イースターエッグ(隠しモード)
  if (props.generator.EASTER_MODE && props.generator.EASTER_DATA) {
   return props.generator.EASTER_DATA(pulseIntensity.value);
  }

  // targetCountを超えていて、progressTextsAfterがある場合はランダムで選出
  if (
   pulseIntensity.value >= 1 &&
   props.generator.TEXTS_AFTER &&
   props.generator.TEXTS_AFTER.length > 0
  ) {
   const randomIndex = Math.floor(Math.random() * props.generator.TEXTS_AFTER.length);
   return props.generator.TEXTS_AFTER[randomIndex];
  }

  // 通常の処理
  return props.generator.TEXTS?.[getProgressIndex(props.generator.TEXTS?.length || 0)] || '';
 });

 // 進捗率に基づいたスタイルを取得
 const progressStyle = computed(() => {
  return (
   props.generator.STYLES?.[getProgressIndex(props.generator.STYLES?.length || 0)] || {
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
  setTimeout(() => {
   isAnimating.value = false;
  }, msAnimation);
 };

 // props.countの変更を監視
 watch(
  () => props.count,
  (newCount, oldCount) => {
   if (newCount !== oldCount) {
    triggerAnimation();
   }
  },
  { immediate: true }
 );

 return {
  isAnimating,
  pulseIntensity,
  counterStyle
 };
}
