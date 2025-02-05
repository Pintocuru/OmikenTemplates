<!-- src/GouseiSuika.vue -->
<template>
 <div id="container" class="container mx-auto p-4">
  <div
   v-if="gameState.Resultflag"
   class="result-bubble w-[300px] h-[300px] mx-auto rounded-full flex flex-col items-center justify-center relative whitespace-nowrap"
  >
   <div class="result-title text-5xl mb-1 font-['RocknRoll_One'] text-[#f0f0f0] [-webkit-text-stroke:1px_#B3843A]">
    スコア
   </div>
   <div
    class="result-score text-[80px] -mt-6 font-['Mochiy_Pop_P_One'] bg-gradient-to-b from-white to-[#ffcc00] bg-clip-text text-transparent [-webkit-text-stroke:3px_#B3843A]"
   >
    {{ gameState.Result.score }}
   </div>
   <div class="result-name text-5xl font-['RocknRoll_One'] text-white [-webkit-text-stroke:1px_#B3843A]">
    {{ gameState.Result.name }}
   </div>
  </div>

  <div class="bg-[#ffeeb3] border-[3px] border-[#ffcc00] rounded-[50px] mx-5 p-5 text-4xl font-['RocknRoll_One']">
   <div class="text-center mb-2.5">
    <span
     class="text-[#f5E5BC] [text-shadow:-3px_-3px_3px_#B3843A,3px_-3px_3px_#B3843A,-3px_3px_3px_#B3843A,3px_3px_3px_#B3843A]"
    >
     🍉スイカランキング🍉
    </span>
   </div>
   <ul class="list-none p-0 m-0">
    <li
     v-for="(player, index) in SUIKAViewPlayers"
     :key="index"
     class="py-0 px-2.5 flex items-center font-bold"
     :class="{
      'bg-gradient-to-r from-[#F4D777] to-[#FFF2C6] text-[#B99F4F]': index === 0,
      'bg-gradient-to-r from-[#A1BCCC] to-[#D5E5F2] text-[#5380B3]': index === 1,
      'bg-gradient-to-r from-[#F0B16E] to-[#FFE1BD] text-[#BC7851]': index === 2,
      'bg-gradient-to-r from-[#D9E9F7] to-[#F2F9FF] text-[#4D6F8C]': index >= 3
     }"
    >
     <template v-if="index < 3">
      <img :src="`img/image_${index + 1}.png`" :alt="`${index + 1}位の画像`" class="inline-block w-20 h-20 mr-5" />
     </template>
     <template v-else>
      <span class="inline-block w-20 h-20 mr-5 text-center">[{{ index + 1 }}]</span>
     </template>
     <span class="flex justify-center items-center w-full">
      <span class="text-[1em]">{{ player.points }}</span>
      <span class="text-[0.7em]">({{ player.name }})</span>
     </span>
    </li>
   </ul>
   <div class="p-0 m-0 text-[0.7em] flex justify-center items-center w-full">
    Average: {{ SUIKAaveragePoint }} ( {{ gameState.totalCount }} / {{ gameState.totalPoint }} )
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watchEffect } from 'vue';
import GouseiSuika from './Scripts/GouseiSuika';
import { PostMessage } from '@common/api/PostMessage';
import { SETTINGS } from '@common/settings';
import { CommentChara } from '@common/commonTypes';
import { SuikaGameType, SuikaVisitType } from './type';

const props = defineProps<{ filterComments: CommentChara[] }>();

// とりあえず定数(後で別に移す)
// ランキング:下位何位まで表示させるか
const RANK_LIMIT = 20;

// ref
const userVisits = reactive<Record<string, SuikaVisitType>>({});
const gameState = reactive<SuikaGameType>({
 rankings: [],
 userStats: {},
 draws: 0,
 totalDraws: 0,
 totalPoint: 0,
 currentUserIds: [], // このコードでは不要
 ruleId: '', // このコードでは不要
 settings: [] // このコードでは不要
});

// 総スコア/総回数の平均点を算出
const SUIKAaveragePoint = computed(() =>
 gameState.totalPoint > 0 ? (gameState.totalPoint / gameState.totalCount).toFixed(0) : 0
);
// rankDisplayLimitまでのユーザーを表示する
const SUIKAViewPlayers = computed(() => {
 return gameState.rankings.slice(0, RANK_LIMIT);
});

// コメント監視とクリーンアップ
watchEffect(() => {
 props.filterComments.forEach((comment: CommentChara) => {
  if (comment.data.userId === SETTINGS.BOT_USER_ID) return;

  // ユーザーデータ作成
  const { userId } = comment.data;
  const visit = userVisits[userId] || { userId, name: comment.data.displayName, draws: 0, isRanking: true };
  visit.draws++;
  if (visit.draws >= 6 && !comment.data.hasGift) visit.isRanking = false;
  userVisits[userId] = visit;

  try {
   // スイカゲームの実行
   const result = GouseiSuika.func(gameState, comment, {
    mode: comment.userWordMatchId === 'kabo' ? 1 : comment.userWordMatchId === 'kujira' ? 2 : 0,
    isRank: visit.isRanking,
    isFruit: true
   });

   Object.assign(gameState, result.game);
   postResults(comment, result.placeholder);
  } catch (e) {
   console.error(e);
  }
 });
});

// PostMessage送信処理を関数化
function postResults(comment: CommentChara, result: { [id: string]: string | number }) {
 return; // とりあえず
 new PostMessage([
  { type: 'error', delaySeconds: 3.5, content: result.message as string },
  { type: 'error', delaySeconds: 8, content: `${comment.data.name}の${result.points}は、${result.winsRank}位だよ。` }
 ]).post();
}

// 結果を伝えるタイミングで表示の更新を行う
const resultFlag = ref(false);
const resultTimeout = ref<number | undefined>();
const rankingDisplayTimeout = ref<number | undefined>();

function displayGameResult(displayDelay: number = 3500) {
 resultFlag.value = false;

 // 既存のタイマーをクリア
 if (resultTimeout.value) clearTimeout(resultTimeout.value);
 if (rankingDisplayTimeout.value) clearTimeout(rankingDisplayTimeout.value);

 resultTimeout.value = setTimeout(
  () => {
   resultFlag.value = true;
   setTimeout(() => {
    resultFlag.value = false;
   }, 5000);
  },
  displayDelay + SETTINGS.basicDelaySeconds * 1000
 ) as unknown as number;

 rankingDisplayTimeout.value = setTimeout(
  () => {
   gameState.rankPlayers = gameState.rankings.slice(0, RANK_LIMIT);
  },
  displayDelay + SETTINGS.basicDelaySeconds * 1000
 ) as unknown as number;
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@200..900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=RocknRoll+One&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Mochiy+Pop+P+One&display=swap');

/* バブルアニメーション用のスタイル */
.result-bubble {
 background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.7));
 box-shadow:
  inset 0 0 100px rgba(255, 255, 255, 1),
  inset 0 0 100px rgba(207, 235, 247, 0.8),
  0 0 60px rgba(255, 255, 255, 0.7);
 animation: bubble 4s ease-in-out infinite alternate;
}

@keyframes bubble {
 0% {
  transform: translateY(30px);
 }
 100% {
  transform: translateY(0);
 }
}
</style>
