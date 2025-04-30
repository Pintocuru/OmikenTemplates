<!-- test.vue -->
<template>
 <div class="flex items-center justify-center p-4">
  <div class="relative w-32 h-32" :class="{ 'animate-hover': animationEnabled }">
   <!-- ベース六角形（回転四角で近似） -->
   <div
    class="absolute inset-0 bg-opacity-70 backdrop-filter backdrop-blur-md rounded-lg transform rotate-45 transition-all duration-700"
    :class="[`bg-${counterConfig.typeColor || 'gray'}-800`]"
    style="filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.4))"
   ></div>

   <!-- 内側の六角形 - ガラス風エフェクト -->
   <div
    class="absolute inset-3 bg-opacity-30 backdrop-filter backdrop-blur-sm rounded-lg transform rotate-45 transition-all duration-500"
    :class="[`bg-${counterConfig.typeColor || 'gray'}-700`]"
   >
    <!-- 内側の光沢エフェクト -->
    <div class="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-10"></div>
   </div>

   <!-- パルスリング効果 -->
   <div
    v-if="animationEnabled"
    class="absolute inset-0 rounded-lg transform rotate-45 ring-effect"
    :style="{ borderColor: colorVars['--counter-color'] }"
   ></div>

   <!-- ホログラフィック線エフェクト -->
   <div class="absolute inset-0 holographic-lines opacity-20"></div>

   <!-- カウンター内容 -->
   <div class="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
    <!-- タイトル -->
    <div
     class="text-xs font-bold uppercase tracking-wider mb-1 text-glow transition-all duration-300"
     :style="{ color: colorVars['--counter-color'] }"
    >
     {{ counterConfig.title }}
    </div>

    <!-- カウント値 -->
    <div class="flex items-baseline">
     <span class="text-4xl font-bold text-white value-display transition-all duration-300">{{
      count
     }}</span>
     <span v-if="typeof countMax === 'number'" class="text-xs ml-1 text-gray-300"
      >/{{ countMax ?? '' }}</span
     >
    </div>

    <!-- 倍率バッジ -->
    <div
     v-if="counterConfig.multiplier !== 1"
     class="px-1.5 py-0.5 rounded-full text-xs shadow-md z-10 text-white transition-all duration-300"
     :style="{ backgroundColor: colorVars['--counter-color-translucent'] }"
    >
     x{{ counterConfig.multiplier }}
    </div>
   </div>

   <!-- 角の装飾 - テクノロジカルなノードとして再設計 -->
   <div
    class="absolute -top-1 -right-1 w-4 h-4 rounded-full transition-all duration-500 node-pulse"
    :style="{ backgroundColor: colorVars['--counter-color'] }"
   ></div>
   <div
    class="absolute -bottom-1 -left-1 w-4 h-4 rounded-full transition-all duration-500 node-pulse-delayed"
    :style="{ backgroundColor: colorVars['--counter-color'] }"
   ></div>

   <!-- グロー効果 - よりダイナミックに -->
   <div
    class="absolute inset-0 rounded-lg opacity-40 z-5 transition-all duration-700"
    :style="{
     background: `radial-gradient(circle, ${colorVars['--counter-color']} 0%, transparent 80%)`,
     filter: 'blur(15px)'
    }"
    :class="{ 'pulse-glow': animationEnabled }"
   ></div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { ColorType, CounterConfig } from '@scripts/schema';

const props = defineProps<{
 count: number;
 countMax: number | null;
 counterConfig: CounterConfig;
}>();

const animationEnabled = ref(true);

// カラースキームに基づいたCSS変数を計算
const colorVars = computed(() => {
 const colorMap: Record<ColorType, string> = {
  default: '#E0E0E0', // = gray-300
  blue: '#3b82f6', // = blue-500
  green: '#10b981', // = green-500
  red: '#ef4444', // = red-500
  purple: '#8b5cf6', // = purple-500
  yellow: '#f59e0b', // = yellow-500
  pink: '#ec4899', // = pink-500
  gray: '#6b7280' // = gray-500
 };

 const selectedColor = colorMap[props.counterConfig.typeColor ?? 'default'];
 // 透明度を持つ色も用意
 const selectedColorTranslucent = selectedColor.replace(')', ', 0.6)').replace('#', 'rgba(');

 return {
  '--counter-color': selectedColor,
  '--counter-color-translucent': selectedColorTranslucent
 };
});

// アニメーションの初期設定
onMounted(() => {
 // コンポーネントのマウント時にアニメーションを有効化
 animationEnabled.value = true;
});
</script>

<style scoped>
/* ホバーアニメーション */
.animate-hover {
 animation: hover 10s ease-in-out infinite;
}

@keyframes hover {
 0%,
 100% {
  transform: translateY(0);
 }
 50% {
  transform: translateY(-5px);
 }
}

/* テキストグロー効果 */
.text-glow {
 text-shadow: 0 0 8px currentColor;
}

/* パルスリングエフェクト */
.ring-effect {
 border: 1px solid transparent;
 animation: ringPulse 4s ease-in-out infinite;
}

@keyframes ringPulse {
 0%,
 100% {
  opacity: 0.2;
  transform: rotate(45deg) scale(1);
 }
 50% {
  opacity: 0.4;
  transform: rotate(45deg) scale(1.05);
 }
}

/* バッジグロー */
.badge-glow {
 box-shadow: 0 0 10px currentColor;
}

/* 数値表示アニメーション */
.value-display {
 position: relative;
 animation: valueGlow 5s ease-in-out infinite;
}

@keyframes valueGlow {
 0%,
 100% {
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
 }
 50% {
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
 }
}

/* ノードパルスアニメーション */
.node-pulse {
 box-shadow: 0 0 10px currentColor;
 animation: nodePulse 5s ease-in-out infinite;
}

.node-pulse-delayed {
 box-shadow: 0 0 10px currentColor;
 animation: nodePulse 5s ease-in-out 1s infinite;
}

@keyframes nodePulse {
 0%,
 100% {
  opacity: 0.7;
  transform: scale(1);
 }
 50% {
  opacity: 1;
  transform: scale(1.2);
 }
}

/* デジタルスキャンライン */
.digital-scan {
 animation: scanLine 6s linear infinite;
}

.digital-scan-reverse {
 animation: scanLine 6s linear 1.5s infinite reverse;
}

@keyframes scanLine {
 0% {
  transform: translateX(-100%);
 }
 100% {
  transform: translateX(100%);
 }
}

/* ホログラフィックライン */
.holographic-lines {
 background: repeating-linear-gradient(
  45deg,
  rgba(255, 255, 255, 0.1),
  rgba(255, 255, 255, 0.1) 1px,
  transparent 1px,
  transparent 10px
 );
}

/* グローパルスアニメーション */
.pulse-glow {
 animation: glowPulse 8s ease-in-out infinite;
}

@keyframes glowPulse {
 0%,
 100% {
  opacity: 0.3;
  filter: blur(15px);
 }
 50% {
  opacity: 0.5;
  filter: blur(20px);
 }
}
</style>
