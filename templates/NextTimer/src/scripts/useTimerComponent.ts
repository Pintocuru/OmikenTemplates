import { computed, Ref } from 'vue';
import { TimerState } from './types';

export function useTimerComponent(timerState: Ref<TimerState>) {
 // 桁ごとの数字を返す
 const countdownDigits = computed(
  () => timerState.value.countdown?.toString().padStart(2, '0').split('').map(Number) || []
 );

 return {
  countdownDigits
 };
}
