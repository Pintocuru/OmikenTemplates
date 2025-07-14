<!-- src/MainGenerator/components/CharacterControlPanel.vue -->
<template>
 <div class="fixed bottom-4 right-4 z-50">
  <!-- コントロールボタン群 -->
  <div
   class="flex flex-col items-end gap-2 mb-2 transition-all duration-500 ease-out"
   :class="[
    isMenuVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
   ]"
   @mouseenter="handleMenuMouseEnter"
   @mouseleave="isMenuVisible = false"
  >
   <!-- 表示サイズ変更ボタン -->
   <div
    class="bg-green-600/70 hover:bg-green-600/90 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 shadow-lg backdrop-blur-sm"
    :class="sizeConfig.controlButton"
    @click="increaseDisplaySize"
    @contextmenu.prevent="decreaseDisplaySize"
    title="左クリック：サイズ拡大 / 右クリック：サイズ縮小"
   >
    <ZoomIn :class="sizeConfig.controlIcon" class="text-white" />
   </div>
   <!-- 表示モード切り替えアイコン -->
   <div
    class="bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 shadow-lg backdrop-blur-sm"
    :class="sizeConfig.controlButton"
    @click="switchToNextMode"
    @contextmenu.prevent="switchToPrevMode"
    title="左クリック：次のモード / 右クリック：前のモード"
   >
    <Monitor :class="sizeConfig.controlIcon" class="text-white" />
   </div>
  </div>

  <!-- キャラクター画像群 -->
  <div class="flex items-end gap-2" style="flex-direction: row-reverse">
   <div
    v-for="(character, index) in characters"
    :key="index"
    class="relative cursor-pointer"
    :style="{ zIndex: characters.length - index }"
    @mouseenter="index === 0 ? handleMouseEnter() : null"
    @mouseleave="index === 0 ? handleMouseLeave() : null"
    @click="handleCharacterClick(character, false)"
    @contextmenu.prevent="handleCharacterClick(character, true)"
   >
    <div
     class="relative rounded-full overflow-hidden transition-all duration-300 shadow-lg"
     :class="[
      isMenuVisible && index === 0 ? 'scale-110 shadow-xl' : 'scale-100',
      index === 0 ? sizeConfig.primaryAvatar : sizeConfig.secondaryAvatar
     ]"
    >
     <!-- 背景のグロー効果 -->
     <div
      class="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full transition-opacity duration-300"
      :class="[isMenuVisible && index === 0 ? 'opacity-100' : 'opacity-0']"
     ></div>

     <!-- キャラクター画像 -->
     <img
      :src="getImagePath((character.image as CharacterImageType)[currentExpressions[index]])"
      :alt="`${character.name}のアバター`"
      class="w-full h-full object-cover transition-all duration-500"
      :class="[isMenuVisible && index === 0 ? 'brightness-110' : 'brightness-100']"
      :style="{
       backgroundColor: character.color.backgroundColor || '#ccc'
      }"
     />

     <!-- ホバー時のオーバーレイ -->
     <div
      class="absolute inset-0 bg-white/10 rounded-full transition-opacity duration-300"
      :class="[isMenuVisible && index === 0 ? 'opacity-100' : 'opacity-0']"
     ></div>
    </div>

    <!-- ホバー時のパルス効果 -->
    <div
     class="absolute inset-0 rounded-full border-2 border-white/30 transition-all duration-300"
     :class="[isMenuVisible && index === 0 ? 'scale-150 opacity-0' : 'scale-100 opacity-100']"
    ></div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { BotMessage, characterEmotions, DisplaySize } from '@/types/types';
import {
 CharacterType,
 CharacterImageType,
 CharacterEmotionType,
 PostActionType,
 PostActionSchema
} from '@type/';
import { ZoomIn, Monitor } from 'lucide-vue-next';

// Props
const props = defineProps<{
 characters: CharacterType[];
 displaySize: DisplaySize;
 switchToNextMode: () => void;
 switchToPrevMode: () => void;
 increaseDisplaySize: () => void;
 decreaseDisplaySize: () => void;
 generateTestMessage: (postAction: PostActionType, isToast: boolean) => BotMessage;
}>();

// Emits
const emit = defineEmits<{
 testMessage: [message: BotMessage];
}>();

// サイズ設定の定数
const SIZE_CONFIG = {
 xs: {
  primaryAvatar: 'w-10 h-10',
  secondaryAvatar: 'w-8 h-8',
  controlButton: 'w-8 h-8',
  controlIcon: 'w-4 h-4'
 },
 sm: {
  primaryAvatar: 'w-12 h-12',
  secondaryAvatar: 'w-10 h-10',
  controlButton: 'w-10 h-10',
  controlIcon: 'w-5 h-5'
 },
 md: {
  primaryAvatar: 'w-16 h-16',
  secondaryAvatar: 'w-12 h-12',
  controlButton: 'w-12 h-12',
  controlIcon: 'w-6 h-6'
 },
 lg: {
  primaryAvatar: 'w-20 h-20',
  secondaryAvatar: 'w-16 h-16',
  controlButton: 'w-14 h-14',
  controlIcon: 'w-7 h-7'
 },
 xl: {
  primaryAvatar: 'w-24 h-24',
  secondaryAvatar: 'w-20 h-20',
  controlButton: 'w-16 h-16',
  controlIcon: 'w-8 h-8'
 }
} as const;

// 画像パス取得関数
const imageBaseUrl = import.meta.env?.VITE_IMAGE_BASE_URL || './Characters/';
const getImagePath = (profileImage: string) => `${imageBaseUrl}${profileImage}`;

// リアクティブ変数
const sizeConfig = computed(() => SIZE_CONFIG[props.displaySize]);
const isMenuVisible = ref(false);
const characters = computed(() => props.characters);
const currentExpressions = ref<CharacterEmotionType[]>([]);
const expressionTimer = ref<number | null>(null);
const menuTimer = ref<number | null>(null);

// 初期化
onMounted(() => {
 // 各キャラクターの初期表情を設定
 currentExpressions.value = characters.value.map(() => 'default');
 startExpressionCycle();
});

// クリーンアップ
onUnmounted(() => {
 if (expressionTimer.value) {
  clearTimeout(expressionTimer.value);
 }
 if (menuTimer.value) {
  clearTimeout(menuTimer.value);
 }
});

// 表情サイクルの開始（5秒に1回抽選を行い、10%で特別な表情）
const startExpressionCycle = () => {
 const updateExpressions = () => {
  characters.value.forEach((character, index) => {
   // 90%の確率でdefaultを維持、10%の確率で特別な表情に変更
   const changeChance = Math.random() < 0.1;

   if (changeChance) {
    // 'default'以外の表情をランダムに選択
    const nonDefaultEmotions = characterEmotions.filter((emotion) => emotion !== 'default');
    const randomEmotion = nonDefaultEmotions[Math.floor(Math.random() * nonDefaultEmotions.length)];
    currentExpressions.value[index] = randomEmotion;
   } else {
    currentExpressions.value[index] = 'default';
   }
  });
  expressionTimer.value = setTimeout(updateExpressions, 5000);
 };

 // 初回実行
 updateExpressions();
};

// マウスイベントハンドラー（改善版）
const handleMouseEnter = () => {
 if (menuTimer.value) {
  clearTimeout(menuTimer.value);
 }
 isMenuVisible.value = true;
};

const handleMouseLeave = () => {
 // 少し遅延を入れてメニューを閉じる（マウスの移動を考慮）
 menuTimer.value = setTimeout(() => {
  isMenuVisible.value = false;
 }, 500);
};

// メニュー要素用のマウスイベントハンドラー
const handleMenuMouseEnter = () => {
 if (menuTimer.value) {
  clearTimeout(menuTimer.value);
 }
 isMenuVisible.value = true;
};

// キャラクタークリック時の処理
const handleCharacterClick = (character: CharacterType, isToast: boolean) => {
 try {
  // PostActionSchemaを使用してテストメッセージ用のデータを作成
  const postAction = PostActionSchema.parse({
   characterKey: character.id,
   messageContent: !isToast
    ? `${character.name}のテストメッセージです！`
    : `${character.name}のトーストメッセージです！`
  });

  // テストメッセージを生成
  const testMessage = props.generateTestMessage(postAction, isToast);

  // 親コンポーネントに通知
  emit('testMessage', testMessage);
 } catch (error) {
  console.error('テストメッセージの生成に失敗しました:', error);
 }
};

// 表情を手動で変更（デバッグ用）
const changeExpression = (characterIndex: number, expression: CharacterEmotionType) => {
 if (currentExpressions.value[characterIndex] !== undefined) {
  currentExpressions.value[characterIndex] = expression;
 }
};
</script>

<style scoped>
/* カスタムアニメーション */
@keyframes pulse {
 0% {
  transform: scale(1);
  opacity: 1;
 }
 100% {
  transform: scale(1.5);
  opacity: 0;
 }
}

@keyframes bounce {
 0%,
 20%,
 50%,
 80%,
 100% {
  transform: translateY(0);
 }
 40% {
  transform: translateY(-4px);
 }
 60% {
  transform: translateY(-2px);
 }
}

.pulse-animation {
 animation: pulse 2s infinite;
}

.bounce-animation {
 animation: bounce 2s infinite;
}

/* ホバー時のスムーズなトランジション */
.transition-all {
 transition-property: all;
 transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* グラデーション効果 */
.bg-gradient-to-br {
 background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

/* 複数キャラクター配置時の重なり効果 */
.relative {
 position: relative;
}
</style>
