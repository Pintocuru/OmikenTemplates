<!-- src/SuikaRanking.vue -->
<template>
 <div class="container mx-auto p-4">
  <SuikaResult
   v-if="gameState.Resultflag"
   :score="gameState.Result.score"
   :name="gameState.Result.name"
  />
  <SuikaRankingList
   :rankings="gameState.rankings"
   :average-point="
    gameState.totalPoint > 0 ? Number((gameState.totalPoint / gameState.totalCount).toFixed(0)) : 0
   "
   :total-count="gameState.totalDraws"
   :total-point="gameState.totalPoint"
  />
 </div>
</template>

<script setup lang="ts">
import { useGameState } from './useGameState';
import { useCommentHandler } from './useCommentHandler';
import SuikaResult from './SuikaResult.vue';
import SuikaRankingList from './SuikaRankingList.vue';
import type { CommentChara } from '@common/commonTypes';

const props = defineProps<{
 filterComments: CommentChara[];
}>();

const { gameState, displayGameResult } = useGameState();

const { handleComment } = useCommentHandler(gameState);

// ウォッチャーでコメント処理とゲーム状態の更新を行う
watch(
 () => props.filterComments, // 監視対象
 (newValue) => {
  newValue.forEach((comment: CommentChara) => {
   const result = handleComment(comment);
   if (result) displayGameResult(result);
  });
 },
 { deep: true }
);
</script>
