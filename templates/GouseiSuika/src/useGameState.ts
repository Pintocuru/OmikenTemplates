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

  gameState.Resultflag = false;
  console.log(newState);

  resultTimeout.value = setTimeout(
   () => {
    updateGameState(newState);
    gameState.Resultflag = true;
    setTimeout(() => {
     gameState.Resultflag = false;
    }, 5000);
   },
   displayDelay + SETTINGS.basicDelaySeconds * 1000
  ) as unknown as number;

  rankingDisplayTimeout.value = setTimeout(
   () => {
    gameState.rankPlayers = gameState.rankings;
   },
   displayDelay + SETTINGS.basicDelaySeconds * 1000
  ) as unknown as number;
 }

 return {
  gameState,
  updateGameState,
  displayGameResult
 };
}
