// src/apps/scripts/useVictoryComponent.ts
import { computed, ref, watch } from 'vue';
import { SecondNameMode } from './secondNameMode';

export interface Props {
 count: number;
 targetCount?: number;
 loopCount?: boolean;
 progressTexts?: string[];
 progressTextsAfter?: string[];
 progressStyles?: {
  textColor: string;
  colorClass: string;
 }[];
 secondNameMode?: boolean;
}

export function useVictoryComponent(props: Props, msAnimation = 1000) {
 // アニメーション中かどうか
 const isAnimating = ref(false);

 // targetCountを最大とする強度
 const pulseIntensity = computed(() => Math.min(props.count / props.targetCount!, 1));

 // 進捗率の計算
 const getProgressIndex = (totalItems: number) => {
  if (totalItems <= 0) return 0;
  const index = Math.floor((progressPercentage.value / 100) * totalItems);
  return index >= totalItems ? totalItems - 1 : index;
 };

 // 進捗率の計算
 const progressPercentage = computed(() => {
  const percentage = (props.count / props.targetCount!) * 100;
  if (props.secondNameMode) return percentage % 100;
  return props.loopCount ? percentage % 100 : Math.min(percentage, 100);
 });

 // 進捗率に基づいたテキストとスタイルを取得
 const progressText = computed(() => {
  // props.countを依存関係に含める
  const count = props.count;

  // 隠しモード
  if (props.secondNameMode) {
   if (progressPercentage.value <= 0 && pulseIntensity.value <= 0) return 'カモン!';
   else return SecondNameMode();
  }

  // targetCountを超えていて、progressTextsAfterがある場合はランダムで選出
  if (
   pulseIntensity.value >= 1 &&
   props.progressTextsAfter &&
   props.progressTextsAfter.length > 0
  ) {
   const randomIndex = Math.floor(Math.random() * props.progressTextsAfter.length);
   return props.progressTextsAfter[randomIndex];
  }

  // 通常の処理
  return props.progressTexts![getProgressIndex(props.progressTexts!.length)];
 });

 const progressStyle = computed(
  () => props.progressStyles![getProgressIndex(props.progressStyles!.length)]
 );

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
