// src/components/suika/composables/useGameState.ts
import type { SuikaGameType } from './type';
import { SETTINGS } from '@common/settings';

export function useGameState() {
 const gameState = reactive<SuikaGameType>({
  rankings: [],
  userStats: {},
  draws: 0,
  totalDraws: 0,
  totalPoint: 0,
  currentUserIds: [],
  ruleId: '',
  settings: [],
  Resultflag: false,
  Result: { score: 0, name: '' }
 });

 const resultTimeout = ref<number>();
 const rankingDisplayTimeout = ref<number>();

 function updateGameState(newState: Partial<SuikaGameType>) {
  Object.assign(gameState, newState);
 }

 function displayGameResult(newState: Partial<SuikaGameType>, displayDelay: number = 3500) {
  // 既存のタイマーをクリア
  if (resultTimeout.value) clearTimeout(resultTimeout.value);
  if (rankingDisplayTimeout.value) clearTimeout(rankingDisplayTimeout.value);

  // 古いランキングを保持したままアニメーションを実行
  const oldRankPlayers = gameState.rankPlayers; // 現在のランキングを保持
  // 新しいランキングデータを即時反映
  updateGameState(newState);

  // 結果フラグはアニメーション終了後に設定
  resultTimeout.value = setTimeout(() => {
   gameState.Resultflag = true;
  }, displayDelay) as unknown as number; // displayDelay 時間後にフラグを立てる

  // さらに 5 秒後にフラグを元に戻す
  setTimeout(() => {
   gameState.Resultflag = false;
  }, displayDelay + 5000);

  // アニメーション終了後に新しいランキングを反映
  rankingDisplayTimeout.value = setTimeout(() => {
   // アニメーション中は古いランキングを表示
   gameState.rankPlayers = oldRankPlayers;
   // アニメーション後に新しいランキングを反映
   gameState.rankPlayers = gameState.rankings;
  }, displayDelay) as unknown as number;
 }

 return {
  gameState,
  updateGameState,
  displayGameResult
 };
}
