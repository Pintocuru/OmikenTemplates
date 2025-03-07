// src/apps/scripts/useVictoryComponent.ts
import { computed, ref, watch } from 'vue';

export interface Props {
 count: number;
 targetCount?: number;
 loopCount?: boolean;
 progressTexts?: string[];
 progressStyles?: {
  textColor: string;
  colorClass: string;
 }[];
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
  return props.loopCount ? percentage % 100 : Math.min(percentage, 100);
 });

 // 進捗率に基づいたテキストとスタイルを取得
 const progressText = computed(
  () => props.progressTexts![getProgressIndex(props.progressTexts!.length)]
 );
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
 watch(
  () => props.count,
  (newCount, oldCount) => {
   if (newCount !== oldCount) triggerAnimation();
  },
  { immediate: true }
 );

 return {
  isAnimating,
  pulseIntensity,
  counterStyle
 };
}
