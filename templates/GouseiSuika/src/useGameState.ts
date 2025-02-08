// src/components/suika/composables/useGameState.ts
import type { SuikaGameType } from './type';
import { SETTINGS } from '@common/settings';

export function useGameState() {
 const defaultState: SuikaGameType = {
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
 };

 // 管理用/表示用の状態管理
 const gameState = reactive<SuikaGameType>(defaultState);
 const displayState = ref<SuikaGameType>(defaultState);

 const resultTimeout = ref<number>();
 const rankingDisplayTimeout = ref<number>();

 // ゲームの実際の状態を更新
 function updateGameState(newState: Partial<SuikaGameType>) {
  Object.assign(gameState, newState);
 }

 function displayGameResult(newState: Partial<SuikaGameType>, displayDelay: number = 3500) {
  // ゲーム状態を更新
  Object.assign(gameState, newState);

  // 既存のタイマーをクリア
  if (resultTimeout.value) clearTimeout(resultTimeout.value);
  if (rankingDisplayTimeout.value) clearTimeout(rankingDisplayTimeout.value);

  // 表示用の状態をリセット
  displayState.value = {
   ...displayState.value,
   Resultflag: false
  };

  // 指定した遅延後に表示用の状態を更新
  resultTimeout.value = setTimeout(
   () => {
    displayState.value = {
     ...displayState.value,
     ...newState,
     Resultflag: true
    };

    // ResultFlagを一定時間後に非表示
    setTimeout(() => {
     displayState.value = {
      ...displayState.value,
      Resultflag: false
     };
    }, 5000);
   },
   Math.max(displayDelay + SETTINGS.basicDelaySeconds * 1000, 0)
  ) as unknown as number;

  // ランキング表示の更新も同じ遅延で実施
  rankingDisplayTimeout.value = setTimeout(
   () => {
    displayState.value = {
     ...displayState.value,
     rankPlayers: gameState.rankings
    };
   },
   Math.max(displayDelay + SETTINGS.basicDelaySeconds * 1000, 0)
  ) as unknown as number;
 }

 return {
  gameState,
  displayState,
  updateGameState,
  displayGameResult
 };
}
