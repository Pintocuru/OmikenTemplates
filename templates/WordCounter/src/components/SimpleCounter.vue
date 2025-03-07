<!-- SimpleCounter.vue -->
<template>
 <div class="flex items-center justify-center">
  <div
   class="relative flex flex-col items-center justify-center w-64 h-64 rounded-full shadow-lg"
   :class="counterStyle.colorClass"
  >
   <!-- カウンター -->
   <div class="relative z-10 flex flex-col items-center justify-center">
    <!-- 数値 -->
    <TransitionGroup name="count">
     <div :key="count" class="text-8xl font-rounded font-black text-white tracking-tight">
      {{ count }}
     </div>
    </TransitionGroup>

    <!-- ステータステキスト -->
    <div
     v-if="progressTexts.length > 0"
     class="text-2xl font-bold mt-2 tracking-wide bg-white rounded-full px-4 py-1"
     :style="{ color: counterStyle.textColor }"
    >
     <span class="relative">
      {{ counterStyle.text }}
     </span>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

interface Props {
 count: number;
 targetCount?: number;
 loopCount?: boolean;
 progressTexts?: string[];
}

const props = withDefaults(defineProps<Props>(), {
 targetCount: 15,
 loopCount: true,
 progressTexts: () => [
  '高評価👍️',
  'ナイス！',
  'ファンタスティック！',
  'スーパースター！',
  'ウルトラスーパー！'
 ]
});

// 進捗率に基づくテキスト設定
const PROGRESS_TEXTS: string[] = props.progressTexts;

// 進捗率に基づくスタイル設定
const PROGRESS_STYLES = [
 {
  textColor: '#10b981',
  colorClass: 'bg-gradient-to-br from-green-400 to-cyan-500'
 },
 {
  textColor: '#0ea5e9',
  colorClass: 'bg-gradient-to-br from-cyan-500 to-blue-500'
 },
 {
  textColor: '#d946ef',
  colorClass: 'bg-gradient-to-br from-purple-500 to-pink-500'
 }
];

// 進捗率の計算
const getProgressIndex = (totalItems: number) => {
 const index = Math.floor((progressPercentage.value / 100) * totalItems);
 return totalItems > 0 ? index % totalItems : 0;
};

// 進捗率の計算
const progressPercentage = computed(() => {
 const percentage = (props.count / props.targetCount) * 100;
 return props.loopCount ? percentage % 100 : Math.min(percentage, 99.9);
});

// 進捗率に基づいたテキストとスタイルを取得
const progressText = computed(() => PROGRESS_TEXTS[getProgressIndex(PROGRESS_TEXTS.length)]);
const progressStyle = computed(() => PROGRESS_STYLES[getProgressIndex(PROGRESS_STYLES.length)]);

const counterStyle = computed(() => ({
 text: progressText.value,
 ...progressStyle.value
}));
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Mochiy+Pop+One&display=swap');

.font-rounded {
 font-family: 'Mochiy Pop One', sans-serif;
}

/* カウント変更時のアニメーション */
.count-enter-active,
.count-leave-active {
 transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.count-enter-from {
 opacity: 0;
 transform: scale(0.8) translateY(10px) rotate(10deg);
}

.count-leave-to {
 opacity: 0;
 transform: scale(1.2) rotate(-10deg);
 position: absolute;
}

.count-leave-active {
 position: absolute;
}
</style>
